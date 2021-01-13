import { ScrollView, Dimensions } from 'react-native'
import { Box, Text, Button, SafeAreaView, Markdown } from '@components'

type TextScreenProps = {
  heading: string
  description: string
  onNext: () => void
}

export const TextScreen: React.FunctionComponent<TextScreenProps> = ({
  heading,
  description,
  onNext,
}) => {
  return (
    <ScrollView style={{ flex: 1, height: '100%' }}>
      <SafeAreaView
        flex={1}
        height="100%"
        minHeight={Dimensions.get('window').height}
      >
        <Box
          flex={1}
          alignItems="center"
          justifyContent="flex-start"
          pt={4}
          px={6}
        >
          <Text variant="instructionHeading" mt={10} mb={5}>
            {heading}
          </Text>

          <Markdown mb={4}>{description}</Markdown>

          <Box flex={1} justifyContent="flex-end" pb={6}>
            <Button
              variant="primary"
              label="Next"
              backgroundColor="purple"
              onPress={onNext}
              textProps={{
                color: 'pureWhite',
              }}
            />
          </Box>
        </Box>
      </SafeAreaView>
    </ScrollView>
  )
}