import { useRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { WebView, WebViewNavigation } from 'react-native-webview'

import { Box, Text, Button, SafeAreaView } from '@components'
import { useAlert } from '@utils/AlertProvider'

export type ExternalLinkScreenProps = {
  link: string
  title: string
  closeDetectionMatch?: string
  onNext: () => void
}

export const ExternalLinkScreen: React.FunctionComponent<ExternalLinkScreenProps> = ({
  link,
  title,
  onNext,
  closeDetectionMatch,
}) => {
  const Alert = useAlert()
  const webView = useRef<any>()
  const onNavigationStateChange = (navigation: WebViewNavigation) => {
    if (closeDetectionMatch && navigation.url.includes(closeDetectionMatch)) {
      onNext()
    }
  }

  const onNextPress = () => {
    Alert.alert(
      'Are you sure?',
      'You will not be able to return to this screen. Are you sure you want to continue?',
      [
        {
          label: 'Cancel',
          style: 'cancel',
        },
        {
          label: 'Continue',
          onPress: () => onNext(),
        },
      ],
    )
  }

  // Force the webview to reset to original origin (This is the recommended way...)
  const resetWebView = () => {
    const redirectTo = 'window.location = "' + link + '"'
    webView.current.injectJavaScript(redirectTo)
  }

  return (
    <SafeAreaView flex={1} backgroundColor="purple">
      <Box
        flexDirection="row"
        backgroundColor="purple"
        paddingVertical={4}
        alignItems="center"
      >
        <Box width="25%" pl={5}>
          <TouchableOpacity onPress={resetWebView}>
            <MaterialIcons name="loop" size={24} color="white" />
          </TouchableOpacity>
        </Box>
        <Box width="50%" alignItems="center">
          <Text color="white" fontSize={16} fontWeight="600">
            {title}
          </Text>
        </Box>
        <Button
          width="25%"
          alignItems="flex-end"
          pr={5}
          label="Exit"
          onPress={onNextPress}
          textProps={{
            fontSize: 16,
          }}
        />
      </Box>
      <WebView
        ref={webView}
        source={{ uri: link }}
        allowsFullscreenVideo
        javaScriptEnabled
        allowsBackForwardNavigationGestures
        onNavigationStateChange={onNavigationStateChange}
      />
    </SafeAreaView>
  )
}
