import { useState } from 'react'
import { Image, Button, StyleSheet } from 'react-native'
import { Box, Text } from '@components'
import AssetCache from '@utils/AssetCache'

// The remote image used to test file caching
export const IMAGE_URL = 'https://picsum.photos/600/400'

export const TestCacheScreen = () => {
  const [loaded, setLoaded] = useState(false)
  const [image, setImage] = useState(AssetCache.retrieveLocalUri(IMAGE_URL))

  // Download image to cache
  const downloadFile = () => {
    AssetCache.cacheFile(IMAGE_URL).then((url) => setImage(url))
  }

  // Delete image from cache
  const deleteFile = () => {
    AssetCache.deleteCachedFile(IMAGE_URL).then(() => {
      setImage(null)
      setLoaded(false)
    })
  }

  return (
    <Box
      flex={1}
      flexDirection={{
        phone: 'column',
      }}
      backgroundColor="mainBackground"
      paddingVertical={10}
      paddingHorizontal={6}
      testID="TestCacheScreen"
    >
      {/* When image is loaed, this text appears and is detected by test */}
      {loaded && (
        <Text testID="ImageLoadIndicator" textAlign="center">
          Image has loaded offline!
        </Text>
      )}

      <Image
        style={styles.image}
        source={{ uri: image }}
        onLoad={() => {
          // Using image != null vs true fixes bug on Android
          setLoaded(image != null)
        }}
        onError={() => setLoaded(false)}
      />

      <Box
        flex={1}
        alignSelf="center"
        marginTop={4}
        flexDirection={{
          phone: 'row',
        }}
      >
        <Box marginRight={4}>
          <Button
            testID="ClearButton"
            title="Delete Image"
            onPress={deleteFile}
          />
        </Box>
        <Box>
          <Button
            testID="DownloadButton"
            title="Download Image"
            onPress={downloadFile}
          />
        </Box>
      </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 200,
    alignSelf: 'center',
    marginTop: 40,
  },
})
