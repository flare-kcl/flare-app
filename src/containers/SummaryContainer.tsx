import { useSelector } from 'react-redux'
import { ExperimentModule } from './ExperimentContainer'
import { SummaryScreen } from '@screens'

type SummaryModuleState = {}

export const SummaryContainer: ExperimentModule<SummaryModuleState> = ({
  module: mod,
  onModuleComplete,
  exitExperiment,
}) => {
  const modules = useSelector((state) => state.modules)

  return (
    <SummaryScreen
      Summary={mod.Summary}
      modules={modules}
      onAccept={onModuleComplete}
      onExit={exitExperiment}
    />
  )
}
