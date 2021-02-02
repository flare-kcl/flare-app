import { useSelector } from 'react-redux'
import { SummaryScreen } from '@screens'
import { ExperimentModule } from './ExperimentContainer'
import { allModulesSyncedSelector } from '@redux/selectors'

type SummaryContainerState = {
  notificationsScheduled: boolean
}

export const SummaryContainer: ExperimentModule<SummaryContainerState> = ({
  module: mod,
  updateModule,
  onModuleComplete,
  syncExperiment,
}) => {
  const allModulesSynced = useSelector(allModulesSyncedSelector)

  return (
    <SummaryScreen
      allModulesSynced={allModulesSynced}
      notificationsScheduled={mod.notificationsScheduled}
      setNotificationsScheduled={() => updateModule({
        notificationsScheduled: true
      })}
      syncExperiment={syncExperiment}
      onExit={() => onModuleComplete()}
    />
  )
}
