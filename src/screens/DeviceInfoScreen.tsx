import { useEffect } from 'react'
import * as Device from 'expo-device'
import { ScrollView } from 'react-native-gesture-handler'
import {
  Box,
  Button,
  Text,
  LabeledDateField,
  LabeledTextField,
  LabeledPickerField,
  SafeAreaView,
} from '@components'

import { BasicInfoContainerState } from '@containers/BasicInfoContainer'

export type DeviceInfoScreenProps = {
  dob: string
  gender: string
  genders: [{ label: string; value: string }]
  operatingSystem: string
  model: string
  manufacturer: string
  version: string
  updateModule: (BasicInfoContainerState) => void
  onNext: () => void
}

export const DeviceInfoScreen: React.FunctionComponent<DeviceInfoScreenProps> = ({
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
  useEffect(() => {
    updateModule({
      model: Device.modelName,
      manufacturer: Device.manufacturer,
      version: Device.osVersion,
      operatingSystem: Device.osName,
    })
  }, [])

  function setDob(dob) {
    updateModule({ dob })
  }

  function setGender(gender) {
    updateModule({ gender })
  }

  return (
    <>
      <ScrollView
        scrollEventThrottle={16}
        contentInsetAdjustmentBehavior="automatic"
        style={{
          height: '100%',
        }}
      >
        <SafeAreaView>
          <Box flex={1} pt={10} px={6} pb={6}>
            <Text variant="heading">Your information</Text>
            <Text variant="heading3">Please enter your details below</Text>
            <LabeledDateField
              label="Date of birth"
              value={dob ? new Date(dob) : new Date()}
              onChange={setDob}
              disabled
            />
            <LabeledPickerField
              label="Gender"
              value={gender}
              options={genders}
              onChange={setGender}
              placeholder="Select your gender..."
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
            {gender && (
              <Button
                variant="primary"
                label="Next"
                marginTop={4}
                onPress={onNext}
              />
            )}
          </Box>
        </SafeAreaView>
      </ScrollView>
    </>
  )
}
