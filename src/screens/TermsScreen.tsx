import { useRef, useState } from 'react'
import { Dimensions } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { FontAwesome } from '@expo/vector-icons'
import * as WebBrowser from 'expo-web-browser';
import Markdown from 'react-native-markdown-display'

import { Box, Button } from '@components'
import { palette } from '@utils/theme'
const dimensions = Dimensions.get('screen')

type TermsScreenProps = {
  onAccept?: Function,
  onExit?: Function
}

export const TermsScreen: React.FunctionComponent<TermsScreenProps> = ({ onAccept, onExit }) => {
  const scrollRef = useRef<ScrollView>(null)
  const [showZoomButton, setShowZoomButton] = useState(true)

  // Custom link handler
  const onLinkPress = (url) => {
    if (url) {
      // Open in a browser modal
      WebBrowser.openBrowserAsync(url, {
        toolbarColor: palette.purple,
        controlsColor: palette.darkGrey
      })
      return false;
    }

    // return true to open with `Linking.openURL
    // return false to handle it yourself
    return true
  }

  return (
    <>
      <ScrollView
        ref={scrollRef}
        onScroll={(event) => {
          const scrollBottom =
            event.nativeEvent.contentOffset.y +
            event.nativeEvent.layoutMeasurement.height
          if (scrollBottom > event.nativeEvent.contentSize.height - 70) {
            setShowZoomButton(false)
          } else {
            setShowZoomButton(true)
          }
        }}
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        style={{
          position: 'absolute',
          height: '100%',
        }}
      >
        {/* Terms and Condition Text */}
        <Box paddingHorizontal={4} paddingTop={10} paddingBottom={10}>
          <Markdown
            onLinkPress={onLinkPress}
            style={{
              body: {
                fontFamily: 'Inter',
                fontWeight: '500',
                color: palette.darkGrey,
              },
              paragraph: {
                marginBottom: 20,
              },
              list_item: {
                marginBottom: 20,
              },
              link: {
                color: palette.greenDark,
              },
              heading1: {
                fontSize: 45,
                color: palette.darkGrey,
                alignSelf: 'center',
                fontWeight: 'bold',
                width: '100%',
                marginBottom: 10,
              },
              heading2: {
                fontWeight: 'bold',
                width: '100%',
              },
              heading3: {
                fontWeight: '600',
              },
            }}
          >
            {/* TODO: Will be swapped out for prop when we have example experiment! */}
            {terms}
          </Markdown>

          <Button
            testID="AcceptButton"
            label="I Accept T&C's"
            backgroundColor="purple"
            paddingVertical={4}
            borderRadius="m"
            marginTop={4}
            activeOpacity={0.6}
            onPress={() => onAccept?.()}
          />

          <Button
            testID="ExitButton"
            label="Exit Experiment"
            marginTop={6}
            textProps={{ color: 'black', fontSize: 18, opacity: 0.8 }}
            onPress={() => onExit?.()}
          />
        </Box>
      </ScrollView>

      {/* The scroll indicator button */}
      {showZoomButton && (
        <Button
          testID="ScrollButton"
          icon={<FontAwesome name="chevron-down" size={25} color="white" />}
          backgroundColor="greenDark"
          position="absolute"
          right={20}
          top={dimensions.height - 190}
          borderRadius="round"
          height={60}
          width={60}
          activeOpacity={0.8}
          onPress={() => scrollRef.current?.scrollToEnd()}
        />
      )}
    </>
  )
}

// Example Terms and Conditions, Well be swapped out eventually!
const terms = `
# Terms & Conditions

Welcome to [Some Link](http://www.lorem-ipsum.info). This site is provided as a service to our visitors and may be used for informational purposes only. Because the Terms and Conditions contain legal obligations, please read them carefully.

1. YOUR AGREEMENT
By using this Site, you agree to be bound by, and to comply with, these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use this site.
PLEASE NOTE: We reserve the right, at our sole discretion, to change, modify or otherwise alter these Terms and Conditions at any time. Unless otherwise indicated, amendments will become effective immediately. Please review these Terms and Conditions periodically. Your continued use of the Site following the posting of changes and/or modifications will constitute your acceptance of the revised Terms and Conditions and the reasonableness of these standards for notice of changes. For your information, this page was last updated as of the date at the top of these terms and conditions.

2. PRIVACY
Please review our Privacy Policy, which also governs your visit to this Site, to understand our practices.

3. LINKED SITES
This Site may contain links to other independent third-party Web sites ("Linked Sites”). These Linked Sites are provided solely as a convenience to our visitors. Such Linked Sites are not under our control, and we are not responsible for and does not endorse the content of such Linked Sites, including any information or materials contained on such Linked Sites. You will need to make your own independent judgment regarding your interaction with these Linked Sites.

4. FORWARD LOOKING STATEMENTS
All materials reproduced on this site speak as of the original date of publication or filing. The fact that a document is available on this site does not mean that the information contained in such document has not been modified or superseded by events or by a subsequent document or filing. We have no duty or policy to update any information or statements contained on this site and, therefore, such information or statements should not be relied upon as being current as of the date you access this site.

5. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY
A. THIS SITE MAY CONTAIN INACCURACIES AND TYPOGRAPHICAL ERRORS. WE DOES NOT WARRANT THE ACCURACY OR COMPLETENESS OF THE MATERIALS OR THE RELIABILITY OF ANY ADVICE, OPINION, STATEMENT OR OTHER INFORMATION DISPLAYED OR DISTRIBUTED THROUGH THE SITE. YOU EXPRESSLY UNDERSTAND AND AGREE THAT: (i) YOUR USE OF THE SITE, INCLUDING ANY RELIANCE ON ANY SUCH OPINION, ADVICE, STATEMENT, MEMORANDUM, OR INFORMATION CONTAINED HEREIN, SHALL BE AT YOUR SOLE RISK; (ii) THE SITE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS; (iii) EXCEPT AS EXPRESSLY PROVIDED HEREIN WE DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, WORKMANLIKE EFFORT, TITLE AND NON-INFRINGEMENT; (iv) WE MAKE NO WARRANTY WITH RESPECT TO THE RESULTS THAT MAY BE OBTAINED FROM THIS SITE, THE PRODUCTS OR SERVICES ADVERTISED OR OFFERED OR MERCHANTS INVOLVED; (v) ANY MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF THE SITE IS DONE AT YOUR OWN DISCRETION AND RISK; and (vi) YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR FOR ANY LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF ANY SUCH MATERIAL.

B. YOU UNDERSTAND AND AGREE THAT UNDER NO CIRCUMSTANCES, INCLUDING, BUT NOT LIMITED TO, NEGLIGENCE, SHALL WE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE OR CONSEQUENTIAL DAMAGES THAT RESULT FROM THE USE OF, OR THE INABILITY TO USE, ANY OF OUR SITES OR MATERIALS OR FUNCTIONS ON ANY SUCH SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. THE FOREGOING LIMITATIONS SHALL APPLY NOTWITHSTANDING ANY FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY.

6. EXCLUSIONS AND LIMITATIONS
SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, OUR LIABILITY IN SUCH JURISDICTION SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.

7. OUR PROPRIETARY RIGHTS
This Site and all its Contents are intended solely for personal, non-commercial use. Except as expressly provided, nothing within the Site shall be construed as conferring any license under our or any third party's intellectual property rights, whether by estoppel, implication, waiver, or otherwise. Without limiting the generality of the foregoing, you acknowledge and agree that all content available through and used to operate the Site and its services is protected by copyright, trademark, patent, or other proprietary rights. You agree not to: (a) modify, alter, or deface any of the trademarks, service marks, trade dress (collectively "Trademarks") or other intellectual property made available by us in connection with the Site; (b) hold yourself out as in any way sponsored by, affiliated with, or endorsed by us, or any of our affiliates or service providers; (c) use any of the Trademarks or other content accessible through the Site for any purpose other than the purpose for which we have made it available to you; (d) defame or disparage us, our Trademarks, or any aspect of the Site; and (e) adapt, translate, modify, decompile, disassemble, or reverse engineer the Site or any software or programs used in connection with it or its products and services.

The framing, mirroring, scraping or data mining of the Site or any of its content in any form and by any method is expressly prohibited.

8. INDEMNITY
By using the Site web sites you agree to indemnify us and affiliated entities (collectively "Indemnities") and hold them harmless from any and all claims and expenses, including (without limitation) attorney's fees, arising from your use of the Site web sites, your use of the Products and Services, or your submission of ideas and/or related materials to us or from any person's use of any ID, membership or password you maintain with any portion of the Site, regardless of whether such use is authorized by you.

9. COPYRIGHT AND TRADEMARK NOTICE
Except our generated dummy copy, which is free to use for private and commercial use, all other text is copyrighted. generator.lorem-ipsum.info © 2013, all rights reserved

10. INTELLECTUAL PROPERTY INFRINGEMENT CLAIMS
It is our policy to respond expeditiously to claims of intellectual property infringement. We will promptly process and investigate notices of alleged infringement and will take appropriate actions under the Digital Millennium Copyright Act ("DMCA") and other applicable intellectual property laws. Notices of claimed infringement should be directed to:

generator.lorem-ipsum.info
`
