import { Text } from '.'
import { Box } from './Box'
import { SafeAreaView } from './SafeAreaView'

type ToastProps = {
  id: any
  toastRef: ToastRef
  title: string
  description: string
}

export type ToastRef = {
  dismiss: () => void
}

export const Toast: React.FC<ToastProps> = ({ id, title, description }) => {
  return (
    <Box
      flex={1}
      bottom={50}
      right={30}
      left={30}
      position="absolute"
      zIndex={90}
      justifyContent="flex-end"
    >
      <SafeAreaView flex={1}>
        <Box
          key={id}
          minHeight={130}
          width="100%"
          pt={4}
          px={4}
          backgroundColor="white"
          borderTopColor="yellow"
          borderTopWidth={10}
          borderRadius="l"
          shadowColor="black"
        >
          {/* Toast Heading */}
          <Text color="darkGrey" fontSize={20} fontFamily="Inter-Bold">
            {title}
          </Text>

          {/* Toast description */}
          <Text
            mt={4}
            color="darkGrey"
            fontFamily="Inter-Regular"
            fontSize={16}
          >
            {description}
          </Text>
        </Box>
      </SafeAreaView>
    </Box>
  )
}
