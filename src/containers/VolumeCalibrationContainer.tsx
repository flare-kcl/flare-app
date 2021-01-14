import { ExperimentModule } from './ExperimentContainer'
import { VolumeCalibrationScreen } from '@screens/VolumeCalibrationScreen'

type TermsModuleState = {
  terms: string
}

type ModuleContainerProps = {
  module: TermsModuleState
  onModuleComplete: () => void
  updateExperiment: (Experiment) => void
  exitExperiment: () => void
}

export const VolumeCalibrationContainer: ExperimentModule<ModuleContainerProps> = ({
  mod,
  updateExperiment,
  onModuleComplete,
}) => {
  function onFinishCalibration(volume) {
    updateExperiment({ volume })
    onModuleComplete()
  }

  return (
    <VolumeCalibrationScreen
      unconditionalStimulus={mod.unconditionalStimulus}
      onFinishCalibration={onFinishCalibration}
    />
  )
}
