import {
  TouchableOpacity,
  Animated,
  TouchableOpacityProps,
  View,
} from 'react-native'
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
  composeRestyleFunctions,
  createRestyleComponent,
} from '@shopify/restyle'

import { Text } from './Text'
import { Theme } from '@utils/theme'
import { Box } from './Box'

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  VariantProps<Theme, 'buttonVariants'>

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  border,
  backgroundColor,
  // Create new variant for themed buttons
  createVariant<Theme>({ themeKey: 'buttonVariants' }),
])

type Props = RestyleProps & {
  testID?: string
  label?: string
  icon?: any
  textProps?: TextProps<Theme>
  // Props for TouchableOpacity
  onPress: () => void
  flex?: number
  activeOpacity?: number
  disabled: boolean
}

export const Button = ({
  testID,
  label,
  icon: Icon,
  onPress,
  flex = 0,
  activeOpacity = 0.8,
  textProps,
  disabled,
  ...rest
}: Props) => {
  const { style, ...props } = useRestyle(restyleFunctions, rest)

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      delayPressIn={0}
      delayPressOut={0}
      activeOpacity={activeOpacity}
      style={{
        flex,
        flexDirection: 'row',
        width: '100%',
      }}
    >
      <Box width="100%" alignItems="center" justifyContent="center" {...props}>
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
