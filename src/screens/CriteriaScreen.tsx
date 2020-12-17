import { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'

import {
  Box,
  Text,
  Button,
  Markdown,
  CriterionToggle,
  SafeAreaView,
} from '@components'
import { useAlert } from '@utils/AlertProvider'

type ExperimentCriterion = {
  id: number
  questionText: string
  helpText: string
  value?: boolean
  requiredValue?: boolean
  required: boolean
}

export type ExperimentCriteria = ExperimentCriterion[]

export type CriteriaScreenParams = {
  criteria: ExperimentCriteria
  description: string
  continueMessage: string
  onPassCriteria?: (criteria: ExperimentCriteria) => void
  onFailCriteria?: () => void
  onExit?: () => void
}

export const CriteriaScreen: React.FunctionComponent<CriteriaScreenParams> = ({
  criteria,
  description,
  continueMessage,
  onPassCriteria,
  onFailCriteria,
  onExit,
}) => {
  const Alert = useAlert()
  let [consentCriteria, setConsentCriteria] = useState<ExperimentCriteria>(
    criteria,
  )

  // Utility function to update the criteria object
  const updateCriteria = (id: number, value: boolean) => {
    setConsentCriteria(
      consentCriteria.map((criteria) => {
        if (criteria.id == id) {
          return {
            ...criteria,
            value,
          }
        }

        return criteria
      }),
    )
  }

  // Utility function to check the validity of consent data
  const onContinue = () => {
    // Check if any questions are unanswered
    if (
      consentCriteria.find(
        (criterion) => criterion.value === undefined && criterion.required,
      )
    ) {
      Alert.alert(
        'Check your answers!',
        "It looks like you haven't answered all the questions.",
      )
      return null
    }

    // Check if any of the answers make participant incompatible
    const invalidCriterion = consentCriteria.find(
      (criterion) =>
        criterion.requiredValue !== undefined &&
        criterion.value != criterion.requiredValue,
    )

    // Proceed or redirect
    if (invalidCriterion) {
      // In future will be handled by ViewController
      onFailCriteria()
    } else {
      onPassCriteria(consentCriteria)
    }
  }

  return (
    <ScrollView
      scrollEventThrottle={16}
      contentInsetAdjustmentBehavior="automatic"
      style={{
        position: 'absolute',
        height: '100%',
      }}
    >
      <SafeAreaView flex={1}>
        <Box flex={1} px={6} pt={10}>
          {/* Experiment Description */}
          <Markdown mb={4}>{description}</Markdown>

          {/* Loop over each consent criteria */}
          {consentCriteria.map((criterion) => (
            <Box key={`criterion-${criterion.id}`} pt={2} pb={8}>
              <Text variant="heading2">{criterion.questionText}</Text>
              {criterion.helpText !== '' && (
                <Text fontSize={15} mb={4}>
                  {criterion.helpText}
                </Text>
              )}
              <CriterionToggle
                id={criterion.id}
                name={criterion.questionText}
                value={criterion.value}
                onChange={updateCriteria}
                mt={4}
              />
            </Box>
          ))}

          <Box borderTopColor="lightGrey" borderTopWidth={2} pt={6} pb={6}>
            {/* Small feature text to remined them to check answers */}
            <Markdown pb={4}>{continueMessage}</Markdown>
            <Button
              testID="ContinueButton"
              label="Continue"
              variant="primary"
              onPress={() => onContinue()}
            />
            <Button
              testID="ExitButton"
              label="Exit Experiment"
              variant="exit"
              onPress={() => onExit()}
            />
          </Box>
        </Box>
      </SafeAreaView>
    </ScrollView>
  )
}
