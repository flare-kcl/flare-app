import { ScrollView as NativeScrollView, ScrollViewProps } from 'react-native'

export const ScrollView: React.FC<ScrollViewProps> = ({ style, ...props }) => (
  <NativeScrollView
    bouncesZoom={false}
    alwaysBounceVertical={false}
    style={{ flex: 1, height: '100%', ...style }}
    contentContainerStyle={{ flexGrow: 1 }}
    contentInsetAdjustmentBehavior="automatic"
    bounces={false}
    {...props}
  />
)
