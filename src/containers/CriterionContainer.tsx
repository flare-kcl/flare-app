import { ExperimentModule } from '@containers/ExperimentContainer'
import { CriteriaScreen, ExperimentCriteria } from '@screens'

type CriteriaModuleState = {
  criteria: ExperimentCriteria
  description: string
  continueMessage: string
}

export const CriterionContainer: ExperimentModule<CriteriaModuleState> = ({
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
