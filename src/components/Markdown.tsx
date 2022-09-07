import { Box } from '@components'
import { BoxProps } from '@shopify/restyle'
import { palette, Theme } from '@utils/theme'
import * as WebBrowser from 'expo-web-browser'
import debounce from 'lodash/debounce'
import { marked } from 'marked'
import { useState } from 'react'
import { Dimensions, Linking, Platform } from 'react-native'
import AutoHeightWebView from 'react-native-autoheight-webview'

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

      table {
        border-collapse: collapse;
      }

      th {
        background-color: ${palette.purple};
        border: ${palette.purple};
        color: ${palette.white};
      }

      td, th {
        padding: 0.5rem 0.25rem;
        text-align: left;
        vertical-align: top;
      }

      th {
        padding: 0.5rem 0.5rem;
      }

      td {
        border-bottom: 1px solid ${palette.darkGrey};
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

  const debouncedSetHeight = debounce(setHeight, 500)

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
          // Set the height of the Box to the height needed by the WebView's content.
          //
          // For an unknown reason, onSizeUpdated is called multiple times with
          // the same content. (It may be caused by DOM reflow as the WebView is
          // rendering the content but unsure.)
          //
          // Moreover, onSizeUpdated is also retriggered when the size of the
          // wrapper Box changes.
          //
          // These two issues combined means that on Android, the height of the
          // WebView is constantly changing in an infinite loop.
          //
          // To prevent this from happening, we debounce the call to so that we
          // only update the height of the Box once the content has settled.
          //
          // This issue doesn't happen on iOS, but it doesn't hurt to debounce
          // for that platform too.
          debouncedSetHeight(size.height)
        }}
      />
    </Box>
  )
}
