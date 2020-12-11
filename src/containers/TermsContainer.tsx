import { ExperimentModule } from './ExperimentContainer'
import { TermsScreen } from '@screens'

type TermsModuleState = {
  terms: string
}

export const TermsContainer: ExperimentModule<TermsModuleState> = ({
  module: mod,
  onModuleComplete,
  exitExperiment,
}) => {
  return (
    <TermsScreen
      terms={mod.terms}
      onAccept={onModuleComplete}
      onExit={() => exitExperiment('TERMS_DECLINE')}
    />
  )
}
