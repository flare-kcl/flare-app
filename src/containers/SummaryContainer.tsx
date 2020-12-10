import { ExperimentModule } from './ExperimentContainer'
import { SummaryScreen } from '@screens'

type SummaryModuleState = {}

export const SummaryContainer: ExperimentModule<SummaryModuleState> = ({
  module: mod,
  onModuleComplete,
  exitExperiment,
}) => {
  return (
    <SummaryScreen
      Summary={mod.Summary}
      onAccept={onModuleComplete}
      onExit={exitExperiment}
    />
  )
}
