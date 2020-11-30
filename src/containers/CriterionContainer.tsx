import { Experiment } from '@containers/ExperimentContainer'
import { CriteriaScreen, ExperimentCriteria } from '@screens'

type CriteriaModuleState = {
  criteria: ExperimentCriteria
  description: string
  continueMessage: string
}

type ModuleContainerProps = {
  module: CriteriaModuleState
  experiment: Experiment
  updateModule: (CriteriaModuleState) => void
  onModuleComplete: () => void
  exitExperiment: () => void
}

export const CriterionContainer: React.FunctionComponent<ModuleContainerProps> = ({
  module: mod,
  updateModule,
  onModuleComplete,
  exitExperiment,
}) => {
  function submitCritera(updatedCriteria: ExperimentCriteria) {
    // Update internal state
    updateModule({
      ...mod,
      criiteria: updatedCriteria,
    })

    // Proceed to next module
    onModuleComplete()
  }

  return (
    <CriteriaScreen
      criteria={mod.criteria}
      description={mod.description}
      continueMessage={mod.continueMessage}
      onPassCriteria={submitCritera}
      onFailCriteria={exitExperiment}
      onExit={exitExperiment}
    />
  )
}
