import { Experiment } from '@containers/ExperimentContainer'
import { TermsScreen } from '@screens'

type TermsModuleState = {
  terms: string
}

type ModuleContainerProps = {
  module: TermsModuleState
  experiment: Experiment
  onModuleComplete: () => void
  exitExperiment: () => void
}

export const TermsContainer: React.FunctionComponent<ModuleContainerProps> = ({
  module: mod,
  onModuleComplete,
  exitExperiment,
}) => {
  return (
    <TermsScreen
      terms={mod.terms}
      onAccept={onModuleComplete}
      onExit={exitExperiment}
    />
  )
}
