import { TextInput, TextInputProps } from 'react-native'
import {
  createRestyleComponent,
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
  // Create new variant for themed inputs
  createVariant({ themeKey: 'inputVariants' }),
]
type Props = TextInputProps &
  SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  VariantProps<Theme, 'inputVariants'>

export const TextField = createRestyleComponent<Props, Theme>(
  restyleFunctions,
  TextInput,
)
