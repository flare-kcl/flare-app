import { useState, useEffect } from 'react'
import { Platform } from 'react-native'
import * as Device from 'expo-device'
import { ScrollView } from 'react-native-gesture-handler'
import {
  Box,
  Button,
  Text,
  LabeledDateField,
  LabeledTextField,
  LabeledPickerField,
} from '@components'

export type DeviceInfoScreenProps = {
  dob: string
  setDob: (string) => void
  gender: string
  genders: [{ label: string; value: string }]
  setGender: (string) => void
  operatingSystem: string
  setOperatingSystem: (string) => void
  model: string
  setModel: (string) => void
  manufacturer: string
  setManufacturer: (string) => void
  version: string
  setVersion: (string) => void
  onNext: () => void
}

export const DeviceInfoScreen: React.FunctionComponent<DeviceInfoScreenProps> = ({
  dob,
  setDob,
  gender,
  genders,
  setGender,
  operatingSystem,
  setOperatingSystem,
  model,
  setModel,
  manufacturer,
  setManufacturer,
  version,
  setVersion,
  onNext,
}) => {
  useEffect(() => {
    setOperatingSystem(Device.osName)
    setVersion(Platform.Version)
    setManufacturer(Device.manufacturer)
    setModel(Device.modelName)
  }, [])

  return (
    <>
      <ScrollView
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        style={{
          height: '100%',
        }}
      >
        <Box pt={4} px={4} pb={4}>
          <Text variant="heading">Your information</Text>
          <Text variant="heading3">Please enter your details below</Text>
          <LabeledDateField
            label="Date of birth"
            value={dob && new Date(dob)}
            onChange={setDob}
            disabled
          />
          <LabeledPickerField
            label="Gender"
            value={gender}
            options={genders}
            onChange={setGender}
          />
          <LabeledTextField
            label="Operating System"
            value={operatingSystem}
            disabled
          />
          <LabeledTextField label="OS Version" value={version} disabled />
          <LabeledTextField
            label="Device Manufacturer"
            value={manufacturer}
            disabled
          />
          <LabeledTextField label="Device Model" value={model} disabled />
          <Button variant="primary" label="Next" mt={4} onPress={onNext} />
        </Box>
      </ScrollView>
    </>
  )
}
