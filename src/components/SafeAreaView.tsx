import { SafeAreaView as NativeSafeAreaview } from 'react-native'
import {
  spacing,
  border,
  backgroundColor,
  SpacingProps,
  BorderProps,
  AllProps,
  BackgroundColorProps,
  createVariant,
  createRestyleComponent,
} from '@shopify/restyle'

import { Theme } from '@utils/theme'

const restyleFunctions = [spacing, border, backgroundColor]
type Props = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
  AllProps<Theme> & {
    // Custom Props...
    testID?: string
    children: any
  }

export const SafeAreaView = createRestyleComponent<Props, Theme>(
  restyleFunctions,
  NativeSafeAreaview,
)
