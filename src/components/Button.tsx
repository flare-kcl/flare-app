import { TouchableOpacity, View } from 'react-native'
import {
  useRestyle,
  spacing,
  border,
  backgroundColor,
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
} from '@shopify/restyle'

import { Text } from './Text'
import { Theme } from '@utils/theme'

const restyleFunctions = [spacing, border, backgroundColor]
type Props = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> & {
    onPress: () => void
    label: string
    disabled: boolean
  }

export const Button = ({ onPress, label, disabled, ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, rest)

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View {...props}>
        <Text variant="buttonLabel">{label}</Text>
      </View>
    </TouchableOpacity>
  )
}
