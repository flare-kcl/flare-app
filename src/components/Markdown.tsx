import * as WebBrowser from 'expo-web-browser'
import { BoxProps } from '@shopify/restyle'
import { Dimensions, Linking, Platform, View } from 'react-native'
import { marked } from 'marked'

import { Box, Text } from '@components'
import theme, { Theme, palette } from '@utils/theme'
import { WebView } from 'react-native-webview'
import AutoHeightWebView from 'react-native-autoheight-webview'
import { useState } from 'react'

const createFontFace = (
  fontFamily: string,
  fontWeight: number,
  fontFileName: string,
  fontStyle: 'normal' | 'italic' = 'normal',
) => {
  const fontUrl = Platform.select({
    ios: fontFileName,
    android: `file:///android_asset/fonts/${fontFileName}`,
  })

  return `
  @font-face {
    font-family: '${fontFamily}';
    font-weight: ${fontWeight};
    font-style: ${fontStyle};
    src: local('${fontFileName.split('.')[0]}'), url('${fontUrl}');
  }
  `
}

const createHtml = (markdown: string) => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      ${createFontFace('Inter', 400, 'Inter-Regular.ttf')}
      ${createFontFace('Inter', 600, 'Inter-SemiBold.ttf')}

      body {
        font-family: 'Inter';
        font-size: 16px;
        line-height: 1.5;
        color: ${palette.darkGrey};
        background-color: ${palette.greenLight};
        padding: 0.75rem;
        margin: 0;
      }

      h1, h2, h3, h4, h5, h6 {
        line-height: 1.2;
        margin: 0 0 1.5rem;
        font-weight: 600;
      }

      h1 {
        font-size: 1.953rem;
      }

      h2 {
        font-size: 1.563rem;
      }

      h3 {
        font-size: 1.25rem;
      }

      h4, h5, h6 {
        font-size: 1rem;
      }

      p {
        line-height: 1.5rem;
        margin: 0 0 1.5rem 0;
      }

      ul, ol, table {
        margin: 0 0 1.5rem 0;
      }

      a {
        color: ${palette.greenDark};
      }

      hr {
        border: 1px solid ${palette.darkGrey};
        margin: 0 0 1.5rem;
      }

    </style>
  </head>
  <body>
    ${marked.parse(markdown)}
  </body>
</html>
`
}

type MarkdownProps = BoxProps<Theme> & {
  markdown: string
}

export const Markdown: React.FunctionComponent<MarkdownProps> = ({
  markdown,
  ...props
}) => {
  const [height, setHeight] = useState<number | undefined>()

  // Validate Markdown input
  if (markdown == undefined && markdown != '') {
    return null
  }

  return (
    <Box height={height} {...props}>
      <AutoHeightWebView
        style={{ width: Dimensions.get('window').width - 48 }}
        scrollEnabled={false}
        originWhitelist={['*']}
        source={{ html: createHtml(markdown), baseUrl: '' }}
        onShouldStartLoadWithRequest={(event) => {
          if (event.url.startsWith('file://')) {
            return true
          }

          if (event.url.startsWith('http')) {
            // Open HTTP/S links in a browser modal
            WebBrowser.openBrowserAsync(event.url, {
              toolbarColor: palette.purple,
              controlsColor: palette.darkGrey,
            })
          } else if (
            event.url.startsWith('mailto') ||
            event.url.startsWith('tel')
          ) {
            // Open mail and tel links using OS default apps
            Linking.openURL(event.url)
          }

          // Unsupported link. Fail silently.
          return false
        }}
        onSizeUpdated={(size) => {
          // On iOS the height of the Box needs to be set manually
          // On Android, height must be left undefined
          if (Platform.OS === 'ios') {
            setHeight(size.height)
          }
        }}
      />
    </Box>
  )
}
