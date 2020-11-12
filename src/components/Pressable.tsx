import { Pressable as NativePressable, PressableProps } from 'react-native'
import {
  spacing,
  border,
  VariantProps,
  backgroundColor,
  SpacingProps,
  BorderProps,
  AllProps,
  BackgroundColorProps,
  createVariant,
  createRestyleComponent,
} from '@shopify/restyle'

import { Theme } from '@utils/theme'

const restyleFunctions = [
  spacing,
  border,
  backgroundColor,
  // Create new variant for themed buttons
  createVariant({ themeKey: 'buttonVariants' }),
]
type Props = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  PressableProps &
  VariantProps<Theme, 'buttonVariants'> &
  AllProps<Theme> & {
    // Custom Props...
    testID?: string
    children: any
  }

export const Pressable = createRestyleComponent<Props, Theme>(
  restyleFunctions,
  NativePressable,
)
