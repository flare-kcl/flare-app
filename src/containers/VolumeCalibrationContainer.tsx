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

export const VolumeCalibrationContainer: React.FunctionComponent<ModuleContainerProps> = ({
  updateExperiment,
  onModuleComplete,
}) => {
  function onFinishCalibration(volume) {
    updateExperiment({ volume })
    onModuleComplete()
  }

  return <VolumeCalibrationScreen onFinishCalibration={onFinishCalibration} />
}
