import {
  Image as NativeImage,
  ImageProps,
} from 'react-native'
import {
  spacing,
  border,
  backgroundColor,
  SpacingProps,
  BorderProps,
  LayoutProps,
  OpacityProps,
  BackgroundColorProps,
  createRestyleComponent,
} from '@shopify/restyle'

import { Theme } from '@utils/theme'

type Props =
  ImageProps &
  SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  OpacityProps<Theme> &
  LayoutProps<Theme> &
  BorderProps<Theme>

export const Image = createRestyleComponent<Props, Theme>(
  [spacing, border, backgroundColor],
  NativeImage,
)
