import { FontAwesome, Entypo } from '@expo/vector-icons'
import { useNetInfo } from '@react-native-community/netinfo'

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
  const netInfo = useNetInfo()
  const allModulesSynced =
    modules.filter((modules) => !modules.moduleCompleted).length === 0

  // Trigger sync when connection is stable
  useEffect(() => {
    if (netInfo.isInternetReachable) {
      syncExperiment()
    }
  }, [netInfo.isInternetReachable])

  return (
    <ScrollView
      style={{
        backgroundColor: palette.greenPrimary,
      }}
    >
      <SafeAreaView flex={1}>
        <Box
          flex={1}
          alignItems="center"
          justifyContent="flex-start"
          pt={8}
          px={5}
          backgroundColor="greenPrimary"
        >
          <Text variant="heading" mb={9}>
            {allModulesSynced ? 'Sync Complete' : 'Syncing Data...'}
          </Text>

          {/* Show connection status */}
          {!netInfo.isInternetReachable && !allModulesSynced && (
            <Box
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              mb={4}
              p={4}
              backgroundColor="lightGrey"
              borderRadius="m"
            >
              <Text variant="heading3" fontWeight="600" color="red">
                You do not have internet access, Please come back when you have
                a stable connection.
              </Text>
            </Box>
          )}

          {/* Makeshift table */}
          <Box width="100%">
            {modules.map((mod) => (
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                height={70}
                mb={4}
                px={4}
                backgroundColor="lightGrey"
                borderRadius="m"
              >
                <Text fontWeight="bold" fontSize={16} color="darkGrey">
                  ({mod.moduleId}) {mod.moduleType}
                </Text>
                {mod.moduleSynced ? (
                  <FontAwesome name="check" size={24} color={palette.purple} />
                ) : (
                  <Entypo name="squared-cross" size={24} color={palette.red} />
                )}
              </Box>
            ))}
          </Box>

          {allModulesSynced && (
            <Box flex={1} justifyContent="flex-end" pb={6}>
              <Button
                variant="primary"
                label="Complete Experiment"
                onPress={onExit}
              />
            </Box>
          )}
        </Box>
      </SafeAreaView>
    </ScrollView>
  )
}
