import { TextInput, TextInputProps } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import DatePicker from 'react-native-date-picker'
import {
  createRestyleComponent,
  spacing,
  border,
  VariantProps,
  backgroundColor,
  SpacingProps,
  BorderProps,
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
      <DatePicker
        mode="date"
        date={value}
        locale="fr"
        onDateChange={(date) => onChange(date)}
      />
    </Box>
  </Box>
)

export const LabeledPickerField = ({
  label,
  value,
  options = [],
  onChange,
}) => {
  return (
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
        pl={1}
      >
        <Picker
          style={{ width: '100%' }}
          selectedValue={value}
          onValueChange={(itemValue, _) => onChange(itemValue)}
        >
          {options.map((option) => (
            <Picker.Item {...option} />
          ))}
        </Picker>
      </Box>
    </Box>
  )
}
