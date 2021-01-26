import { Modal, TouchableOpacity } from 'react-native'

import { ThemeColors } from '@utils/theme'
import { Text, SafeAreaView, Box } from '.'

type AlertProps = {
  id: any
  alertRef: AlertRef
  title: string
  description: string
  actions?: AlertAction[]
  color?: ThemeColors
}

export const Alert: React.FC<AlertProps> = ({
  id,
  alertRef,
  title,
  description,
  actions,
  color,
}) => {
  return (
    <Modal transparent={true} visible={true}>
      {/* Alert Modal */}
      <Box
        flex={1}
        top={0}
        bottom={0}
        right={0}
        left={0}
        position="absolute"
        zIndex={100}
        elevation={100}
        justifyContent="flex-end"
      >
        <Box
          key={id}
          minHeight={350}
          width="100%"
          pt={6}
          px={4}
          backgroundColor="white"
          borderTopColor={color}
          borderTopWidth={10}
          zIndex={110}
        >
          <SafeAreaView flex={1}>
            {/* Alert Heading */}
            <Text color="darkGrey" fontSize={28} fontFamily="Inter-Bold">
              {title}
            </Text>

            {/* Alert description */}
            <Text
              mt={6}
              color="darkGrey"
              fontFamily="Inter-Regular"
              fontSize={16}
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
              zIndex={120}
            >
              {actions != undefined ? (
                actions.map((props) => (
                  <AlertButton alertRef={alertRef} {...props} />
                ))
              ) : (
                <AlertButton
                  alertRef={alertRef}
                  label="Dismiss"
                  onPress={(alertRef) => alertRef.dismiss()}
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
        elevation={99}
        backgroundColor="black"
        opacity={0.8}
      />
    </Modal>
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
    <Box mr={6}>
      <TouchableOpacity
        onPress={() => {
          // Call handler if exists
          onPress?.(alertRef)

          // Dimiss alert
          alertRef.dismiss()
        }}
      >
        <Text fontSize={19} fontFamily="Inter-SemiBold" color={color}>
          {label}
        </Text>
      </TouchableOpacity>
    </Box>
  )
}
