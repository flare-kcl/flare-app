import { useState, useEffect } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useNetInfo } from '@react-native-community/netinfo'
import Spinner from 'react-native-spinkit'
import { addHours } from 'date-fns'
import { Box, Text, Button, SafeAreaView, ScrollView, NetworkError } from '@components'
import { palette } from '@utils/theme'
import {
  cancelAllNotifications,
  scheduleNotification,
} from '@utils/notifications'

type SummaryScreenProps = {
  allModulesSynced: boolean
  syncExperiment: () => void
  onExit: () => void
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  allModulesSynced,
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
      // Clear all sync notifications
      cancelAllNotifications('SYNC_REQUIRED')

      // Add notifications in 2 & 24 Hours
      scheduleNotification('SYNC_REQUIRED', addHours(new Date(), 2))
      scheduleNotification('SYNC_REQUIRED', addHours(new Date(), 24))
    }

    if (allModulesSynced) {
      // Cancel any future notifications once synced
      cancelAllNotifications('SYNC_REQUIRED')
    }
  }, [netInfo.isInternetReachable, allModulesSynced])

  const finishExperiment = () => {
    // Cancel any future notifications once synced
    cancelAllNotifications('SYNC_REQUIRED')

    // Progress to next screen
    onExit()
  }

  return (
    <ScrollView>
      <SafeAreaView flex={1}>
        <Box
          flex={1}
          width="100%"
          alignItems="center"
          justifyContent="center"
          pt={8}
          px={5}
        >
          <Box alignItems="center" mb={24}>
            <Text variant="heading" mb={5}>
              Experiment Upload
            </Text>

            <Text variant="instructionDescription" textAlign="left" mb={24}>
              We need to upload your response data before you can continue,
              please make sure you are connected to a stable internet
              connection.
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
                <AntDesign
                  name="checkcircle"
                  size={90}
                  color={palette.greenCorrect}
                />
              )
            )}
          </Box>

          {/* Show connection status */}
          {!netInfo.isInternetReachable && !allModulesSynced && (
            <NetworkError />
          )}

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
      </SafeAreaView>
    </ScrollView>
  )
}
