import { useState } from 'react'
import { Alert } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'

import { Box, Button, Markdown, CriterionToggle, Text } from '@components'

type ExperimentCriterion = {
  name: string
  description: string
  value?: boolean
  requiredValue?: boolean
}

type ExperimentCriteria = ExperimentCriterion[]

type CriteriaScreenProps = {
  onPassCriteria?: Function
  onFailCriteria?: Function
  onExit?: Function
}

export const CriteriaScreen: React.FunctionComponent<CriteriaScreenProps> = ({
  onPassCriteria,
  onFailCriteria,
  onExit,
}) => {
  const navigation = useNavigation()

  // TODO: Swap out for prop
  const experimentDescription = `
  # What is this experiment?

  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac magna ut neque auctor varius et eu lectus. Proin eget fringilla lectus. Donec feugiat, turpis sed blandit lacinia, dolor nulla pretium quam, quis cursus neque lorem et ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquam tortor at rhoncus condimentum. Maecenas gravida nibh et gravida pretium. Morbi quam nisl, tempor et auctor sit amet, convallis et dui. Duis luctus mollis dolor vitae rutrum. Cras dapibus congue neque sed sodales.
  `

  // TODO: Swap out for prop
  const postCriteriaText = `
  ### Ready to continue?

  Please make sure all of the above criteria are answered correctly. This is essential to the integreity of the your data.
  `

  // TODO: Swap out for prop
  const consentCriteriaExample = [
    {
      name: 'heart-criteria',
      description: `### 1. Do you have a pre-existing heart condition?`,
      value: null,
      requiredValue: false,
    },
    {
      name: 'ptsd-criteria',
      description: `### 2. Do you suffer from PTSD?`,
      value: null,
      requiredValue: false,
    },
    {
      name: 'anxiety-criteria',
      description: `### 3. Do you have a diagnosed anxiety condtion?  \n Mauris ut urna nunc. Proin luctus, odio cursus ornare sodales, sapien metus ultrices nisl, at pulvinar dui ipsum et lacus. Cras sodales faucibus est vel volutpat. Pellentesque lacinia suscipit mi ut euismod. Donec ut viverra ante. Morbi bibendum vulputate neque vitae viverra. Mauris egestas vehicula tortor. Aenean ornare euismod massa, at cursus urna sodales nec.`,
      value: null,
    },
  ]

  const [consentCriteria, setConsentCriteria] = useState<ExperimentCriteria>(
    consentCriteriaExample,
  )

  // Utility function to update the criteria object
  const updateCriteria = (name: string, value: boolean) => {
    setConsentCriteria(
      consentCriteria.map((criteria) => {
        if (criteria.name == name) {
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
    if (consentCriteria.find((criterion) => criterion.value == null)) {
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
      onFailCriteria?.()
      navigation.navigate('Reject')
    } else {
      onPassCriteria?.()
    }
  }

  return (
    <>
      <ScrollView
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        style={{
          position: 'absolute',
          height: '100%',
        }}
      >
        <Box flex={1} px={6} pt={10} pb={10}>
          {/* Experiment Description */}
          <Markdown mb={4}>{experimentDescription}</Markdown>

          {/* Loop over each consent criteria */}
          {consentCriteria.map((criterion) => (
            <Box key={criterion.name} pt={2} pb={8}>
              <Markdown>{criterion.description}</Markdown>
              <CriterionToggle
                name={criterion.name}
                value={criterion.value}
                onChange={updateCriteria}
                mt={4}
              />
            </Box>
          ))}

          <Box borderTopColor="lightGrey" borderTopWidth={2} pt={6}>
            {/* Small feature text to remined them to check answers */}
            <Markdown pb={4}>{postCriteriaText}</Markdown>
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
              onPress={() => onExit?.()}
            />
          </Box>
        </Box>
      </ScrollView>
    </>
  )
}
