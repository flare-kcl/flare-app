import { ExperimentModule } from '@containers/ExperimentContainer'
import { CriteriaScreen, ExperimentCriteria } from '@screens'

export type CriteriaModuleState = {
  questions: ExperimentCriteria
  introText: string
  outroText: string
}

export const CriterionContainer: ExperimentModule<CriteriaModuleState> = ({
  module: mod,
  updateModule,
  onModuleComplete,
  exitExperiment,
}) => {
  function submitCritera(updatedCriteria: ExperimentCriteria) {
    // Proceed to next module
    onModuleComplete({
      questions: updatedCriteria,
    })
  }

  return (
    <CriteriaScreen
      criteria={mod.questions}
      description={mod.introText}
      continueMessage={mod.outroText ?? ''}
      onPassCriteria={submitCritera}
      onFailCriteria={() => exitExperiment('INCORRECT_CRITERIA')}
      onExit={() => exitExperiment('INCORRECT_CRITERIA')}
    />
  )
}
