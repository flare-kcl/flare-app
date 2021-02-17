import { ExperimentModule } from './ExperimentContainer'
import { TermsScreen } from '@screens'

export type TermsModuleDefinition = {
  terms: string
}

export type TermsModuleState = TermsModuleDefinition & {
  agreed?: boolean
}

export const TermsContainer: ExperimentModule<TermsModuleState> = ({
  module: mod,
  updateModule,
  onModuleComplete,
  exitExperiment,
}) => {
  return (
    <TermsScreen
      terms={mod.terms}
      onAccept={() => onModuleComplete({ agreed: true })}
      onExit={() => exitExperiment('TERMS_DECLINE')}
    />
  )
}
