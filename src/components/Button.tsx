import { TouchableOpacity, View, TouchableOpacityProps } from 'react-native'
import {
  useRestyle,
  spacing,
  border,
  VariantProps,
  backgroundColor,
  SpacingProps,
  BorderProps,
  AllProps,
  BackgroundColorProps,
  createVariant,
} from '@shopify/restyle'

import { Text } from './Text'
import { Theme } from '@utils/theme'

const restyleFunctions = [
  spacing,
  border,
  backgroundColor,
  // Create new varient for themed buttons
  createVariant({ themeKey: 'buttonVariants' })
]
type Props = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  TouchableOpacityProps &
  VariantProps<Theme, 'buttonVariants'> &
  AllProps<Theme> & {
    // Custom Props...
    label: string
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
