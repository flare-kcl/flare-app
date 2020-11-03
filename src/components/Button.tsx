import { TouchableOpacity, Animated, TouchableOpacityProps } from 'react-native'
import {
  useRestyle,
  spacing,
  border,
  TextProps,
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
import { Box } from './Box'

const restyleFunctions = [
  spacing,
  border,
  backgroundColor,
  // Create new varient for themed buttons
  createVariant({ themeKey: 'buttonVariants' }),
]
type Props = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  TouchableOpacityProps &
  VariantProps<Theme, 'buttonVariants'> &
  AllProps<Theme> & {
    // Custom Props...
    testID?: string
    label?: string
    icon?: any
    textProps?: TextProps<Theme>
  }

export const Button = ({
  testID,
  onPress,
  label,
  icon: Icon,
  activeOpacity,
  textProps,
  disabled,
  ...rest
}: Props) => {
  const props = useRestyle(restyleFunctions, rest)

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={activeOpacity}
    >
      <Box alignItems="center" justifyContent="center" {...props}>
        {Icon}
        {label && (
          <Text variant="buttonLabel" {...textProps}>
            {label}
          </Text>
        )}
      </Box>
    </TouchableOpacity>
  )
}
