import { useState } from 'react'

import {
  Box,
  Text,
  Button,
  Markdown,
  ScrollView,
  CriterionToggle,
} from '@components'
import { useAlert } from '@utils/AlertProvider'

type ExperimentCriterion = {
  id: number
  questionText: string
  helpText: string
  value?: boolean
  correctAnswer?: boolean
  required: boolean
}

export type ExperimentCriteria = ExperimentCriterion[]

export type CriteriaScreenParams = {
  questions: ExperimentCriteria
  introText: string
  outroText: string
  onPassCriteria?: (criteria: ExperimentCriteria) => void
  onFailCriteria?: () => void
  onExit?: () => void
}

export const CriteriaScreen: React.FunctionComponent<CriteriaScreenParams> = ({
  questions,
  introText,
  outroText,
  onPassCriteria,
  onFailCriteria,
  onExit,
}) => {
  const Alert = useAlert()
  let [consentCriteria, setConsentCriteria] = useState<ExperimentCriteria>(
    questions,
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

  // Get an required questions that haven't been answered
  const unansweredQuestions = consentCriteria.filter(
    (criterion) => criterion.value === undefined && criterion.required,
  )

  // Utility function to check the validity of consent data
  const onContinue = () => {
    // Check if any questions are unanswered
    if (unansweredQuestions.length > 0) {
      Alert.alert(
        'Check your answers',
        "It looks like you haven't answered all the questions.",
      )
      return null
    }

    // Check if any of the answers make participant incompatible
    const invalidCriterion = consentCriteria.find((criterion) =>
      criterion.required === false || criterion.correctAnswer === null
        ? false
        : criterion.value != criterion.correctAnswer,
    )

    // Proceed or redirect
    if (invalidCriterion) {
      onFailCriteria()
    } else {
      onPassCriteria(consentCriteria)
    }
  }

  return (
    <ScrollView>
      <Box flex={1} px={6} pt={10}>
        {/* Experiment introText */}
        <Markdown mb={4} markdown={introText} />

        {/* Loop over each consent criteria */}
        {consentCriteria.map((criterion) => (
          <Box key={`criterion-${criterion.id}`} pt={2} pb={8}>
            <Text variant="heading2">{criterion.questionText}</Text>
            {!!criterion.helpText && <Markdown markdown={criterion.helpText} />}
            <CriterionToggle
              id={criterion.id}
              value={criterion.value}
              onChange={updateCriteria}
              mt={4}
            />
          </Box>
        ))}

        <Box
          flex={1}
          justifyContent="flex-end"
          borderTopColor="darkGrey"
          borderTopWidth={2}
          pt={8}
          mt={4}
          pb={6}
        >
          {/* Small feature text to remined them to check answers */}
          {!!outroText && <Markdown pb={4} markdown={outroText} />}
          <Button
            testID="ContinueButton"
            label="Continue"
            variant="primary"
            disabled={unansweredQuestions.length > 0}
            opacity={unansweredQuestions.length > 0 ? 0.4 : 1}
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
    </ScrollView>
  )
}
