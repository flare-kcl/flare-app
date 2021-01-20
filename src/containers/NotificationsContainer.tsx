import { ExperimentModule } from './ExperimentContainer'
import { NotificationsScreen } from '@screens'
import { requestNotificationPermission } from '@utils/notifications'

export const NotificationsContainer: ExperimentModule = ({
  updateExperiment,
  onModuleComplete,
}) => {
  const activateNotifications = async () => {
    const notificationsEnabled = await requestNotificationPermission()
    if (notificationsEnabled) {
      updateExperiment({ notificationsEnabled: true })
    }

    // Proceed regardless because we can't ask twice
    onModuleComplete()
  }

  return (
    <NotificationsScreen
      onSkip={() => onModuleComplete()}
      onEnable={activateNotifications}
    />
  )
}
