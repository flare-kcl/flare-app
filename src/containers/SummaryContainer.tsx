import { useSelector } from 'react-redux'
import { SummaryScreen } from '@screens'
import { ExperimentModule } from './ExperimentContainer'
import { allModulesSyncedSelector } from '@redux/selectors'

export const SummaryContainer: ExperimentModule = ({
  onModuleComplete,
  syncExperiment,
}) => {
  const allModulesSynced = useSelector(allModulesSyncedSelector)

  return (
    <SummaryScreen
      allModulesSynced={allModulesSynced}
      syncExperiment={syncExperiment}
      onExit={() => onModuleComplete()}
    />
  )
}
