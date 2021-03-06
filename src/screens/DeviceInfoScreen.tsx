import { useEffect, useState } from 'react'
import * as Device from 'expo-device'
import { isPast, isToday } from 'date-fns'
import {
  Box,
  Button,
  Text,
  ScrollView,
  LabeledDateField,
  LabeledTextField,
  LabeledPickerField,
} from '@components'

import { BasicInfoContainerState } from '@containers/BasicInfoContainer'

export type DeviceInfoScreenProps = {
  shouldCollectDob: boolean
  shouldCollectGender: boolean
  dob: string
  gender: string
  genders: { label: string; value: string }[]
  operatingSystem: string
  model: string
  manufacturer: string
  version: string
  updateModule: (BasicInfoContainerState) => void
  onNext: () => void
}

export const DeviceInfoScreen: React.FunctionComponent<DeviceInfoScreenProps> = ({
  shouldCollectDob,
  shouldCollectGender,
  dob,
  gender,
  genders,
  operatingSystem,
  model,
  manufacturer,
  version,
  updateModule,
  onNext,
}) => {
  const [genderValue, setGenderValue] = useState<string>()
  const [dobValue, setDobValue] = useState<string>()
  const dobDate = Date.parse(dobValue)
  const canContinue =
    gender != undefined && isPast(dobDate) && !isToday(dobDate)

  useEffect(() => {
    updateModule({
      model: Device.modelName,
      manufacturer: Device.manufacturer,
      version: Device.osVersion,
      operatingSystem: Device.osName,
      gender: shouldCollectGender ? genderValue : null,
      dob: shouldCollectDob ? dobValue : null,
    })
  }, [dobValue, genderValue])

  return (
    <ScrollView>
      <Box flex={1} pt={10} px={{ s: 3, m: 6 }} pb={6}>
        <Text variant="heading">Your information</Text>
        <Text variant="heading3">Please enter your details below</Text>
        {shouldCollectDob && (
          <LabeledDateField
            label="Date of birth"
            mb={2}
            value={
              dob ? new Date(dob) : dobValue ? new Date(dobValue) : new Date()
            }
            onChange={setDobValue}
            disabled
          />
        )}
        {shouldCollectGender && (
          <LabeledPickerField
            label="Gender"
            value={genderValue}
            options={genders}
            mb={2}
            onChange={setGenderValue}
            placeholder="Select your gender..."
          />
        )}
        <LabeledTextField
          label="Operating System"
          value={operatingSystem}
          mb={2}
          disabled
        />
        <LabeledTextField label="OS Version" value={version} mb={2} disabled />
        <LabeledTextField
          label="Device Manufacturer"
          value={manufacturer}
          mb={2}
          disabled
        />
        <LabeledTextField label="Device Model" value={model} mb={2} disabled />
        <Button
          variant="primary"
          label="Next"
          disabled={!canContinue}
          opacity={canContinue ? 1 : 0.4}
          marginTop={4}
          onPress={onNext}
        />
      </Box>
    </ScrollView>
  )
}
