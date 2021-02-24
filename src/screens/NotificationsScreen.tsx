import { Entypo } from '@expo/vector-icons'
import { Box, Text, Button, ScrollView, Pressable } from '@components'
import { palette } from '@utils/theme'

type IntervalExplainationScreenProps = {
  onSkip: () => void
  onEnable: () => void
}

export const NotificationsScreen: React.FunctionComponent<IntervalExplainationScreenProps> = ({
  onSkip,
  onEnable,
}) => {
  return (
    <ScrollView>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="flex-start"
        pt={{ s: 0, m: 8 }}
        px={6}
      >
        <Text variant="instructionHeading" mt={10} mb={5}>
          Enable Notification
        </Text>

        <Text variant="instructionDescription" mb={24}>
          We use notifications to keep you informed about break periods and
          uploading your data for the study.
        </Text>

        <Entypo name="notification" size={90} color={palette.purple} />

        <Box flex={1} justifyContent="flex-end" pb={6}>
          <Pressable
            onPress={onSkip}
            marginBottom={2}
            paddingVertical={3}
            opacity={0.8}
          >
            <Text fontWeight="600" fontSize={18} textAlign="center">
              Skip Notifications
            </Text>
          </Pressable>
          <Button
            variant="primary"
            label="Enable Permissions"
            onPress={onEnable}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}
