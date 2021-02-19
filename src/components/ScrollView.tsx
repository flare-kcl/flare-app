import {
  ScrollView as NativeScrollView,
  ScrollViewProps,
  StatusBar,
  StyleProp,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRestyle, BoxProps, boxRestyleFunctions } from '@shopify/restyle'

import { Theme, palette } from '@utils/theme'

const restyleFunctions = boxRestyleFunctions
type Props = BoxProps<Theme> & {
  style: StyleProp<any>
  scroll: ScrollViewProps
}

export const ScrollView: React.FC<Props> = ({ style, scroll, ...rest }) => {
  const props = useRestyle(restyleFunctions, rest)
  const inserts = useSafeAreaInsets()

  return (
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
      {...props}
    />
  )
}
