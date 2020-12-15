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
          label: 'Dismiss',
          style: 'cancel',
        },
        {
          label: 'Continue',
          onPress: () => onNext(),
        },
      ],
    )
  }

  return (
    <SafeAreaView flex={1} backgroundColor="purple">
      <Box
        flexDirection="row"
        backgroundColor="purple"
        paddingVertical={4}
        alignItems="center"
      >
        <Box width="25%" />
        <Box width="50%" alignItems="center">
          <Text color="white" fontSize={16} fontWeight="600">
            {title}
          </Text>
        </Box>
        <Button
          width="25%"
          alignItems="flex-end"
          pr={5}
          label="Next"
          opacity={closeDetectionMatch !== undefined ? 0 : 1}
          disabled={closeDetectionMatch !== undefined ? true : false}
          onPress={onNextPress}
          textProps={{
            fontSize: 16,
          }}
        />
      </Box>
      <WebView
        source={{ uri: link }}
        onNavigationStateChange={onNavigationStateChange}
      />
    </SafeAreaView>
  )
}
