import { useState, useEffect } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useNetInfo } from '@react-native-community/netinfo'
import Spinner from 'react-native-spinkit'
import { addHours } from 'date-fns'
import {
  Box,
  Text,
  Button,
  SafeAreaView,
  ScrollView,
  NetworkError,
} from '@components'
import { palette } from '@utils/theme'
import {
  cancelAllNotifications,
  scheduleNotification,
} from '@utils/notifications'
import { addMinutes } from 'date-fns/esm'

type SummaryScreenProps = {
  allModulesSynced: boolean
  notificationsScheduled: boolean
  syncExperiment: () => void
  setNotificationsScheduled: () => void
  onExit: () => void
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  notificationsScheduled,
  allModulesSynced,
  setNotificationsScheduled,
  syncExperiment,
  onExit,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const netInfo = useNetInfo()
  const syncExperimentAnimated = async () => {
    // Start animation
    setIsSyncing(true)
    // Start sync
    await syncExperiment()
    // End Animtion
    setIsSyncing(false)
  }

  useEffect(() => {
    // Trigger sync when connection is stable
    if (netInfo.isInternetReachable) {
      if (isSyncing === false && allModulesSynced === false) {
        syncExperimentAnimated()
      }
    } else {
      if (!notificationsScheduled) {
        // Add notifications in 2 & 24 Hours
        scheduleNotification('SYNC_REQUIRED', addHours(new Date(), 2))
        scheduleNotification('SYNC_REQUIRED', addHours(new Date(), 24))

        // Set flag to stop duplicate notifications
        setNotificationsScheduled()
      }
    }

    if (allModulesSynced) {
      // Cancel any future notifications once synced
      cancelAllNotifications('SYNC_REQUIRED')

      // Submit end experiment time
      syncExperiment()
    }
  }, [netInfo.isInternetReachable, allModulesSynced])

  const finishExperiment = async () => {
    // Submit end experiment time
    await syncExperiment()

    // Cancel any future notifications once synced
    if (allModulesSynced) {
      cancelAllNotifications('SYNC_REQUIRED')
    }

    // Progress
    onExit()
  }

  return (
    <ScrollView>
      <Box
        flex={1}
        width="100%"
        alignItems="center"
        justifyContent="center"
        pt={8}
        px={5}
      >
        <Box alignItems="center" mb={8}>
          <Text variant="heading" mb={5}>
            Experiment Upload
          </Text>

          <Text variant="instructionDescription" textAlign="left" mb={24}>
            We need to upload your response data before you can continue, please
            make sure you are connected to a stable internet connection.
          </Text>

          {isSyncing ? (
            <Spinner
              isVisible
              size={100}
              type="WanderingCubes"
              color={palette.purple}
            />
          ) : (
            allModulesSynced && (
              <Box
                backgroundColor="white"
                height={80}
                width={80}
                borderRadius="round"
                alignItems="center"
                justifyContent="center"
              >
                <AntDesign
                  name="checkcircle"
                  size={70}
                  color={palette.greenCorrect}
                />
              </Box>
            )
          )}

          {/* Show connection status */}
          {!netInfo.isInternetReachable && !allModulesSynced && (
            <NetworkError />
          )}
        </Box>

        <Box flex={1} justifyContent="flex-end" pb={6}>
          <Button
            testID="ContinueButton"
            label="Sync Now"
            variant="primary"
            backgroundColor="coral"
            disabled={allModulesSynced || isSyncing}
            opacity={allModulesSynced ? 0 : 1}
            onPress={() => syncExperimentAnimated()}
          />
          <Button
            variant="primary"
            label="Complete Experiment"
            disabled={!allModulesSynced}
            opacity={allModulesSynced ? 1 : 0.5}
            onPress={finishExperiment}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}
