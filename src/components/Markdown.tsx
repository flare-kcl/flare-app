// import MarkdownDisplay from 'react-native-markdown-display'
import * as WebBrowser from 'expo-web-browser'
import { BoxProps } from '@shopify/restyle'

import { Box } from '@components'
import theme, { Theme, palette } from '@utils/theme'

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

  // Validate Markdown input
  if (children == undefined && children != '') {
    return null
  }

  return (
    <Box {...props}>
      {children}
      {/*

      // <MarkdownDisplay
      //   onLinkPress={onLinkPress}
      //   style={{
      //     body: {
      //       fontFamily: 'Inter',
      //       fontWeight: '500',
      //       color: palette.darkGrey,
      //       marginBottom: 10,
      //     },
      //     paragraph: {
      //       marginBottom: 10,
      //       fontSize: 16,
      //       color: theme.colors.darkGrey,
      //       fontWeight: '500',
      //     },
      //     list_item: {
      //       marginBottom: 20,
      //     },
      //     link: {
      //       color: palette.purple,
      //     },
      //     heading1: {
      //       fontFamily: 'Inter',
      //       fontSize: 30,
      //       fontWeight: 'bold',
      //       color: palette.darkGrey,
      //       alignSelf: 'flex-start',
      //       marginBottom: 10,
      //     },
      //     heading2: {
      //       fontSize: 22,
      //       fontFamily: 'Inter',
      //       fontWeight: 'bold',
      //       width: '100%',
      //     },
      //     heading3: {
      //       fontFamily: 'Inter',
      //       fontSize: 20,
      //       fontWeight: '600',
      //     },
      //   }}
      // >
      //   {children}
      // </MarkdownDisplay>
        */}
    </Box>
  )
}
