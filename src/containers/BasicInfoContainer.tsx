import { ExperimentModule } from './ExperimentContainer'
import { DeviceInfoScreen, HeadphoneChoiceScreen } from '@screens'

export type PickerOptions = [{ label: string; value: string }]
export type HeadphoneType = 'in_ear' | 'on_ear' | 'over_ear'

export type BasicInfoModuleDefinition = {
  genders: PickerOptions
  collectDateOfBirth: boolean
  collectGender: boolean
  collectHeadphoneMake: boolean
  collectHeadphoneModel: boolean
  collectHeadphoneLabel: boolean
}

export type BasicInfoContainerState = BasicInfoModuleDefinition & {
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

const DEFAULT_GENDERS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
]

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
          shouldCollectDob={mod.collectDateOfBirth}
          shouldCollectGender={mod.collectGender}
          gender={mod.gender}
          genders={mod.genders ?? DEFAULT_GENDERS}
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
