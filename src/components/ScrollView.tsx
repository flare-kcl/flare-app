import {
  ScrollView as NativeScrollView,
  ScrollViewProps,
  StyleProp,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRestyle, BoxProps, boxRestyleFunctions } from '@shopify/restyle'

import { Box } from './Box'
import { Theme, palette } from '@utils/theme'

const restyleFunctions = boxRestyleFunctions
type Props = BoxProps<Theme> & {
  style?: StyleProp<any>
  scroll?: ScrollViewProps
  children?: React.ReactNode
}

export const ScrollView: React.FC<Props> = ({
  style,
  scroll,
  children,
  backgroundColor = 'greenLight',
  ...rest
}) => {
  const props = useRestyle(restyleFunctions, rest)
  const inserts = useSafeAreaInsets()

  return (
    <Box flex={1} backgroundColor={backgroundColor}>
      <NativeScrollView
        alwaysBounceVertical={false}
        alwaysBounceHorizontal={false}
        style={{
          flex: 1,
          ...style,
        }}
        contentContainerStyle={{
          minHeight: '100%',
          paddingTop: inserts.top,
          paddingBottom: inserts.bottom,
          ...props,
        }}
        contentInset={{ top: 0, bottom: 0 }}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        overScrollMode="never"
        {...props}
      >
        {children}
    </NativeScrollView>
    </Box>
  )
}
