import { useState } from 'react'
import { ExperimentModule } from './ExperimentContainer'
import { DeviceInfoScreen, HeadphoneChoiceScreen } from '@screens'

export type PickerOptions = [{ label: string; value: string }]
export type HeadphoneType = 'IN_EAR' | 'ON_EAR' | 'OVER_EAR'

type BasicInfoContainerState = {
  genders: PickerOptions
  dob?: string
  gender?: string
  operatingSystem?: string
  model?: string
  manufacturer?: string
  version?: string
  headphoneType?: HeadphoneType
}

enum BasicInfoScreens {
  DeviceInfo = 0,
  HeadphoneChoice = 1,
}

export const BasicInfoContainer: ExperimentModule<BasicInfoContainerState> = ({
  module: mod,
  updateModule,
  updateExperiment,
  onModuleComplete,
}) => {
  const [screen, setScreen] = useState(BasicInfoScreens.DeviceInfo)

  function nextScreen() {
    if (screen === BasicInfoScreens.DeviceInfo) {
      setScreen(BasicInfoScreens.HeadphoneChoice)
    } else {
      onModuleComplete()
    }
  }

  if (screen === BasicInfoScreens.DeviceInfo) {
    return (
      <DeviceInfoScreen
        dob={mod.dob}
        gender={mod.gender}
        genders={mod.genders}
        operatingSystem={mod.operatingSystem}
        model={mod.model}
        manufacturer={mod.manufacturer}
        version={mod.version}
        updateModule={updateModule}
        onNext={nextScreen}
      />
    )
  }

  if (screen === BasicInfoScreens.HeadphoneChoice) {
    return (
      <HeadphoneChoiceScreen
        headphoneType={mod.headphoneType}
        updateHeadphoneType={(headphoneType) => {
          updateModule({ headphoneType })
          updateExperiment({ headphoneType })
        }}
        onNext={nextScreen}
      />
    )
  }
}
