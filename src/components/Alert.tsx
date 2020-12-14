import AudioSensor from '@utils/AudioSensor'
import { TouchableOpacity } from 'react-native'
import { Text } from '.'
import { Box } from './Box'
import { SafeAreaView } from './SafeAreaView'

type AlertProps = {
  id: any
  alertRef: AlertRef
  title: string
  description: string
  actions?: AlertAction[]
}

export const Alert: React.FC<AlertProps> = ({
  id,
  alertRef,
  title,
  description,
  actions,
}) => {
  return (
    <>
      {/* Alert Modal */}
      <Box
        flex={1}
        top={0}
        bottom={0}
        right={0}
        left={0}
        position="absolute"
        zIndex={100}
        justifyContent="flex-end"
      >
        <Box
          key={id}
          minHeight={350}
          width="100%"
          pt={6}
          px={4}
          backgroundColor="white"
          borderTopColor="red"
          borderTopWidth={10}
          borderRadius="m"
        >
          <SafeAreaView flex={1}>
            {/* Alert Heading */}
            <Text
              color="darkGrey"
              fontWeight="800"
              fontSize={28}
              fontFamily="inter"
            >
              {title}
            </Text>

            {/* Alert description */}
            <Text
              mt={6}
              color="darkGrey"
              fontWeight="500"
              fontSize={16}
              fontFamily="inter"
            >
              {description}
            </Text>

            {/* Alert Actions - Buttons to dismiss the modal (or perform another action) */}
            <Box
              flex={1}
              mt={12}
              flexDirection="row"
              justifyContent="flex-start"
              alignItems="flex-start"
              pb={6}
            >
              {actions.length > 0 ? (
                actions.map((props) => (
                  <AlertButton alertRef={alertRef} {...props} />
                ))
              ) : (
                <AlertButton
                  alertRef={alertRef}
                  label="Dismiss"
                  onPress={() => alertRef.dismiss()}
                />
              )}
            </Box>
          </SafeAreaView>
        </Box>
      </Box>

      {/* Alert Overlay */}
      <Box
        flex={1}
        top={0}
        bottom={0}
        right={0}
        left={0}
        position="absolute"
        zIndex={99}
        backgroundColor="black"
        opacity={0.8}
      />
    </>
  )
}

type AlertButtonStyle = 'default' | 'cancel'

export type AlertRef = {
  dismiss: () => void
}

export type AlertAction = {
  label: string
  onPress?: (AlertRef) => void
  style?: AlertButtonStyle
}

export type AlertButtonProps = AlertAction & {
  alertRef: AlertRef
}

const AlertButton: React.FC<AlertButtonProps> = ({
  label,
  onPress,
  alertRef,
  style = 'default',
}) => {
  const color = {
    default: 'purple',
    cancel: 'red',
  }[style]

  return (
    <TouchableOpacity
      delayPressIn={0}
      delayPressOut={0}
      style={{ marginRight: 30 }}
      onPress={() => {
        // Call handler if exists
        onPress?.(alertRef)

        // Dimiss alert
        alertRef.dismiss()
      }}
    >
      <Text fontSize={18} color={color} fontWeight="600">
        {label}
      </Text>
    </TouchableOpacity>
  )
}
