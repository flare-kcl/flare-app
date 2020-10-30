import { Image as NativeImage, ImageSourcePropType, ImageStyle } from 'react-native'
import {
  useRestyle,
  spacing,
  border,
  backgroundColor,
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  createVariant,
  createRestyleComponent,
  AllProps
} from '@shopify/restyle'

import { Theme } from '@utils/theme'

const restyleFunctions = [spacing, border, backgroundColor]
type Props = ImageSourcePropType &
  SpacingProps<Theme> &
  BackgroundColorProps<Theme> &
  BorderProps<Theme>

export const Image = createRestyleComponent<Props, Theme>(
    [spacing, border, backgroundColor, createVariant({ themeKey: 'imageVarients' })],
    NativeImage,
);

// export const Image = ({ source, ...rest }: Props) => {
//   const props = useRestyle(restyleFunctions, rest)

//   return (
//     <NativeImage source={source} {...props} />
//   )
// }
