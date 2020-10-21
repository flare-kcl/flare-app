import { useEffect, useState } from 'react'
import { Image, Button, StyleSheet } from 'react-native'
import { Box } from '@components'
import AssetCache from '@utils/AssetCache'

// The remote image used to test file caching
export const IMAGE_URL = 'https://picsum.photos/600/400'

export const TestCacheScreen = () => {
  const [ image, setImage ] = useState(
    AssetCache.retrieveLocalUri(IMAGE_URL)
  )

  // Download image to cache
  const downloadFile = () => {
    AssetCache.cacheFile(IMAGE_URL)
      .then(url => setImage(url))
  }

  // Delete image from cache
  const deleteFile = () => {
    AssetCache.deleteCachedFile(IMAGE_URL)
      .then(() => setImage(null))
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
    >
      <Image
        style={styles.image}
        source={{ uri: image }}
      />

    <Box
      flex={1}
      alignSelf='center'
      marginTop={4}
      flexDirection={{
        phone: 'row',
      }}
      >
      <Button title="Delete Image" onPress={deleteFile} />
      <Button title="Download Image" onPress={downloadFile} />
    </Box>
    </Box>
  )
}

const styles = StyleSheet.create({
 image: {
   width: 300,
   height: 200,
   alignSelf: 'center',
   marginTop: 40
 }
})
