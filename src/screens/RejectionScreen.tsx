import { Linking, ScrollView } from 'react-native'
import { Image, Box, Button, Markdown } from '@components'

type RejectionScreenParams = {
  // Ideally a mailto: link
  contactLink?: string
  onExit?: Function
}

export const RejectionScreen: React.FunctionComponent<RejectionScreenParams> = ({
  contactLink,
  onExit,
}) => {
  // TODO: Swap to prop
  const copy = `
  # Thank you for your time!

  Due to the information you have provided we have concluded that you are not an ideal participant for this research experiment.

  If you belive you have answered any questions incorrectly then please use the button below to contact the lead reseacher of this experiment.
  `

  return (
    <Box
      height="100%"
      width="100%"
      flexDirection="column"
      alignItems="center"
      paddingTop={10}
      paddingHorizontal={4}
      backgroundColor="greenLight"
    >
      <ScrollView horizontal={false} width="100%" height="100%">
        <Box
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          paddingTop={10}
          width="100%"
        >
          <Image
            width="100%"
            height="100%"
            maxWidth={240}
            maxHeight={150}
            resizeMode="contain"
            opacity={0.8}
            source={require('../assets/images/fireworks.png')}
          />
        </Box>

        <Markdown paddingTop={10} paddingBottom={6}>
          {copy}
        </Markdown>
        <Box flex={1} flexDirection="column" justifyContent="flex-end">
          {contactLink && (
            <Button
              testID="ContinueButton"
              label="Contact Researcher"
              variant="primary"
              backgroundColor="coral"
              onPress={() => Linking.openURL(contactLink)}
            />
          )}
          <Button
            testID="ExitButton"
            label="Exit Experiment"
            variant="primary"
            onPress={() => onExit?.()}
          />
        </Box>
      </ScrollView>
    </Box>
  )
}
