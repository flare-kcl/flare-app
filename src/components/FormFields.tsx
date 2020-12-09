import { useRef } from 'react'
import { TextInput, TextInputProps } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import DatePicker from 'react-native-date-picker'
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
import { Box } from './Box'
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

type LabeledTextField = {
  label: string
  value: string
  onChange?: (string) => void
  onTap?: () => void
  disabled?: boolean
}

export const LabeledTextField: React.FC<LabeledTextField> = ({
  label,
  value,
  onChange,
  onTap,
  disabled,
  ...props
}) => (
  <Box width="100%" py={4}>
    <Text fontWeight="bold" color="darkGrey" pb={2}>
      {label}
    </Text>
    <TextField
      variant="login"
      autoCapitalize="none"
      autoCorrect={false}
      onChangeText={(text) => onChange?.(text)}
      onTouchEnd={() => onTap?.()}
      value={value}
      editable={disabled !== true}
      {...props}
    />
  </Box>
)

export const LabeledDateField = ({ label, value, onChange, ...props }) => (
  <Box width="100%" py={4}>
    <Text fontWeight="bold" color="darkGrey" pb={2}>
      {label}
    </Text>
    <Box
      borderColor="purple"
      borderWidth={2}
      borderRadius="m"
      alignItems="center"
    >
      <DatePicker mode="date" date={value} onDateChange={onChange} />
    </Box>
  </Box>
)

export const LabeledPickerField = ({
  label,
  value,
  options = [],
  onChange,
  placeholder,
}) => (
  <Box width="100%" py={4}>
    <Text fontWeight="bold" color="darkGrey" pb={2}>
      {label}
    </Text>
    <Box
      borderColor="purple"
      borderWidth={2}
      borderRadius="m"
      alignItems="center"
      justifyContent="center"
    >
      <RNPickerSelect
        value={value}
        fixAndroidTouchableBug
        placeholder={placeholder}
        textInputProps={{
          height: 50,
          borderRadius: 8,
          paddingLeft: 16,
        }}
        onValueChange={onChange}
        items={options}
      />
    </Box>
  </Box>
)
