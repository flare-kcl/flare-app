import { TouchableOpacity, Dimensions } from 'react-native'
import {
  Box,
  Text,
  Button,
  TrialImageStack,
  ScrollView,
  CriterionToggle,
} from '@components'
import { VisualStimuli } from '@containers/ExperimentContainer'

type CAQuestionScreenProps = {
  question: string
  answer: boolean | undefined
  updateAnswer: (answer: boolean) => void
  onNext: () => void
}

export const CAQuestionScreen: React.FunctionComponent<CAQuestionScreenProps> = ({
  question,
  answer,
  updateAnswer,
  onNext,
}) => {
  return (
    <ScrollView>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        pt={{
          s: 5,
          m: 12,
        }}
        px={5}
      >
        <Box pb={0}>
          {question && (
            <Text variant="heading2" mb={10}>
              {question}
            </Text>
          )}

          <CriterionToggle
            id={null}
            value={answer}
            onChange={(_, value) => updateAnswer(value)}
          />
        </Box>

        <Box flex={1} justifyContent="flex-end" pb={6}>
          <Button
            variant="primary"
            label="Next"
            onPress={onNext}
            opacity={answer == undefined ? 0 : 1}
            disabled={answer == undefined}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}

type CAConfirmationQuestionScreenProps = {
  question: string
  stimuli: VisualStimuli[]
  answer: string | undefined
  updateAnswer: (answer: string) => void
  onNext: () => void
}

export const CAConfirmationQuestionScreen: React.FunctionComponent<CAConfirmationQuestionScreenProps> = ({
  question,
  stimuli,
  answer,
  updateAnswer,
  onNext,
}) => {
  let d = Dimensions.get('screen')
  const size = d.width * 0.8

  return (
    <ScrollView>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        pt={{
          s: 5,
          m: 12,
        }}
      >
        <Box
          pb={0}
          px={5}
          alignItems="flex-start"
          justifyContent="flex-start"
          mb={8}
        >
          <Text variant="heading" mb={4}>
            {question}
          </Text>

          <Box alignSelf="flex-start">
            <Text variant="caption2">
              Tap image to select & press 'Next' to continue
            </Text>
          </Box>
        </Box>

        {stimuli.map((stimulus) => (
          <TouchableOpacity
            delayPressIn={0}
            delayPressOut={0}
            activeOpacity={0.8}
            style={{
              width: size,
              height: size,
              marginBottom: 20,
            }}
            onPress={() => updateAnswer(stimulus.label)}
          >
            <Box
              flex={1}
              p={1}
              borderWidth={8}
              borderColor={answer === stimulus.label ? 'purple' : 'purpleLight'}
              borderRadius="l"
            >
              <Box flex={1} flexDirection="row">
                <TrialImageStack stimulusImage={stimulus.image} />
              </Box>
            </Box>
          </TouchableOpacity>
        ))}
      </Box>

      <Box flex={1} justifyContent="flex-end" pt={8} px={5} pb={6}>
        <Button
          variant="primary"
          label="Next"
          onPress={onNext}
          opacity={answer == undefined ? 0 : 1}
          disabled={answer == undefined}
        />
      </Box>
    </ScrollView>
  )
}
