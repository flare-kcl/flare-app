import { useState } from 'react'
import { ExperimentModule } from './ExperimentContainer'
import { DeviceInfoScreen, HeadphoneChoiceScreen } from '@screens'
import { useEffect } from 'react'

export type PickerOptions = [{ label: string; value: string }]
export type HeadphoneType = 'IN_EAR' | 'ON_EAR' | 'OVER_EAR'

export type BasicInfoContainerState = {
  genders: PickerOptions
  screenIndex?: BasicInfoScreens
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
  // Set initial screen value
  const screen = mod.screenIndex ?? 0

  function nextScreen() {
    if (screen === BasicInfoScreens.DeviceInfo) {
      updateModule({ screenIndex: BasicInfoScreens.HeadphoneChoice })
    } else {
      onModuleComplete()
    }
  }

  switch (screen) {
    case BasicInfoScreens.DeviceInfo:
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

    case BasicInfoScreens.HeadphoneChoice:
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

    default:
      return null
  }
}
