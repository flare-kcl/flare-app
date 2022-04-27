import * as FileSystem from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { hashCode } from './hash'

// Base directory where all cached files are kept
const CACHE_KEY = 'FLARE-ASSETS-CACHE'
const BASE_DIR = FileSystem.documentDirectory + `asset-caches/`

export default class AssetCache {
  // Internal reference of remote URL to local file
  static fileMap = {}

  /**
   * Setup the the system requirements needed for AssetCache to work.
   * Call only once in your applications runtime.
   */
  static async construct() {
    // Create directory if doesn't exist
    FileSystem.readDirectoryAsync(BASE_DIR).catch(() =>
      FileSystem.makeDirectoryAsync(BASE_DIR),
    )

    // Instantaite the URL => URI map
    const rawFileMap = await AsyncStorage.getItem(CACHE_KEY)
    AssetCache.fileMap = rawFileMap != null ? JSON.parse(rawFileMap) : {}
  }

  /**
   * Clean up any download assets after an experiment is finished
   */
  static async deconstruct() {
    await FileSystem.deleteAsync(BASE_DIR)
    await AsyncStorage.removeItem(CACHE_KEY)
  }

  /**
   * Update the internal cache mapping remote to local files
   */
  private static async syncCache() {
    // Convert JSON to string
    const rawFileMap = JSON.stringify(AssetCache.fileMap)

    // Save string into storage
    return await AsyncStorage.setItem(CACHE_KEY, rawFileMap)
  }

  /**
   * Generate an appropriate path for a remote file
   *
   * @param url The url of the remote file
   */
  private static generateFileName(url: string): string {
    const ext = url.split(/[#?]/)[0].split('.').pop().trim()
    return `${BASE_DIR}${hashCode(url)}.${ext}`
  }

  /**
   * This method allows you to download a remote file for use later.
   *
   * @param url URL for the remote file you want to cache
   */
  static async cacheFile(url: string): Promise<string | null> {
    try {
      // Check valid URL
      if (url == null) {
        console.error(`${url} is not a valid URL.`)
        return
      }

      // Check if file exists
      if (AssetCache.fileMap[url] != null) {
        return AssetCache.fileMap[url]
      }

      // Download file async
      const { uri } = await FileSystem.downloadAsync(
        url,
        AssetCache.generateFileName(url),
        {},
      )

      // Update internal map for saved files
      AssetCache.fileMap[url] = uri

      // Update mapping cache
      AssetCache.syncCache()

      // Return the new local file
      return uri
    } catch (e) {
      return Promise.reject(e)
    }
  }

  /**
   * Check if remote file is cached, if so, return local uri.
   *
   * @param url URL for remote file that has been cached
   */
  static retrieveLocalUri(url: string): string | null {
    return AssetCache.fileMap[url]
  }

  /**
   * Delete the cached version of a remote URL
   *
   * @param url The remote url that has been cached locally.
   */
  static async deleteCachedFile(url: string) {
    try {
      // Get the URI from the map
      const uri = AssetCache.fileMap[url]
      if (!uri) return null

      // Remove reference to file
      delete AssetCache.fileMap[url]

      // Delete respective local file
      return Promise.all([
        await AssetCache.deleteFile(uri),
        await AssetCache.syncCache(),
      ])
    } catch (e) {
      console.error('Could not delete file', e)
    }
  }

  /**
   * Delete a file with a given URI
   *
   * @param uri The local file you want to delete
   */
  static async deleteFile(uri: string) {
    try {
      // Delete actual file
      await FileSystem.deleteAsync(uri)
    } catch (e) {
      console.error('Could not delete file', e)
    }
  }

  /**
   * Returns a list of all the cached files
   */
  static async files(): Promise<string[]> {
    return await FileSystem.readDirectoryAsync(BASE_DIR)
  }
}
