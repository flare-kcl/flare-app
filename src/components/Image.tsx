import FastImage, { FastImageProps } from 'react-native-fast-image'
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

type Props = FastImageProps &
  SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  OpacityProps<Theme> &
  LayoutProps<Theme> &
  BorderProps<Theme>

export const Image = createRestyleComponent<Props, Theme>(
  [spacing, border, backgroundColor],
  FastImage,
)
