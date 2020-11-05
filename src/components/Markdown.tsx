import MarkdownDisplay from 'react-native-markdown-display'
import * as WebBrowser from 'expo-web-browser'
import { BoxProps } from '@shopify/restyle'

import { Box } from '@components'
import { Theme, palette } from '@utils/theme'

type MarkdownProps = BoxProps<Theme>

export const Markdown: React.FunctionComponent<MarkdownProps> = ({
  children,
  ...props
}) => {
  // Custom link handler
  const onLinkPress = (url) => {
    if (url) {
      // Open in a browser modal
      WebBrowser.openBrowserAsync(url, {
        toolbarColor: palette.purple,
        controlsColor: palette.darkGrey,
      })
      return false
    }

    // return true to open with `Linking.openURL
    // return false to handle it yourself
    return true
  }

  return (
    <Box {...props}>
      <MarkdownDisplay
        onLinkPress={onLinkPress}
        style={{
          body: {
            fontFamily: 'Inter',
            fontWeight: '500',
            color: palette.darkGrey,
          },
          paragraph: {
            marginBottom: 10,
          },
          list_item: {
            marginBottom: 20,
          },
          link: {
            color: palette.greenDark,
          },
          heading1: {
            fontSize: 45,
            fontFamily: 'Inter',
            color: palette.darkGrey,
            alignSelf: 'center',
            fontWeight: 'bold',
            width: '100%',
            marginBottom: 10,
          },
          heading2: {
            fontSize: 30,
            fontFamily: 'Inter',
            fontWeight: 'bold',
            width: '100%',
          },
          heading3: {
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: '700',
          },
        }}
      >
        {children}
      </MarkdownDisplay>
    </Box>
  )
}
