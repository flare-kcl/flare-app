import { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useNetInfo } from '@react-native-community/netinfo'
import Spinner from 'react-native-spinkit'
import { Box, Text, Button, SafeAreaView, ScrollView } from '@components'
import { ExperimentModule } from '@redux/reducers'
import { palette } from '@utils/theme'
import { useEffect } from 'react'

type SummaryScreenProps = {
  modules: ExperimentModule[]
  syncExperiment: () => void
  onExit: () => void
}

export const SummaryScreen: React.FC<SummaryScreenProps> = ({
  modules,
  syncExperiment,
  onExit,
}) => {
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const netInfo = useNetInfo()
  const allModulesSynced =
    modules.filter((modules) => !modules.moduleCompleted).length === 0

  const syncExperimentAnimated = async () => {
    // Start animation
    setIsSyncing(true)
    // Start sync
    await syncExperiment()
    // End Animtion
    setIsSyncing(false)
  }

  // Trigger sync when connection is stable
  useEffect(() => {
    if (netInfo.isInternetReachable) {
      if (isSyncing === false) {
        syncExperimentAnimated()
      }
    }
  }, [netInfo.isInternetReachable])

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
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
              p={4}
              backgroundColor="white"
              borderColor="red"
              borderWidth={4}
              borderRadius="m"
            >
              <Text variant="heading3" fontWeight="600" color="darkGrey">
                You do not have internet access, Please come back when you have
                a stable connection.
              </Text>
            </Box>
          )}

          <Box flex={1} justifyContent="flex-end" pb={6}>
            <Button
              testID="ContinueButton"
              label="Sync Now"
              variant="primary"
              backgroundColor="coral"
              disabled={!allModulesSynced && !isSyncing}
              opacity={allModulesSynced ? 0 : 1}
              onPress={() => syncExperimentAnimated()}
            />
            <Button
              variant="primary"
              label="Complete Experiment"
              disabled={!allModulesSynced}
              opacity={allModulesSynced ? 1 : 0.5}
              onPress={onExit}
            />
          </Box>
        </Box>
      </SafeAreaView>
    </ScrollView>
  )
}
