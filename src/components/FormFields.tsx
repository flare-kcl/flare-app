import { useRef } from 'react'
import { Dimensions, TextInput, TextInputProps } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import DatePicker from 'react-native-date-picker'
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet'
import { format } from 'date-fns'
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
  TextProps,
  BoxProps,
} from '@shopify/restyle'

import { Text } from './Text'
import { Box } from './Box'
import { Pressable } from './Pressable'
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

type FormFieldProps<ValueType> = BoxProps<Theme> & {
  label: string
  value: ValueType
  onChange?: (ValueType) => void
  onTap?: () => void
  labelProps?: TextProps<Theme>
  disabled?: boolean
}

export const LabeledTextField: React.FC<FormFieldProps<string>> = ({
  label,
  value,
  onChange,
  onTap,
  disabled,
  labelProps = {},
  ...props
}) => (
  <Box width="100%" py={4} {...props}>
    {!!label && (
      <Text variant="heading3" pb={1} {...labelProps}>
        {label}
      </Text>
    )}

    <TextField
      variant="login"
      autoCapitalize="none"
      autoCorrect={false}
      backgroundColor={disabled ? 'offWhite' : 'white'}
      onChangeText={(text) => onChange?.(text)}
      value={value}
      onTouchEnd={() => onTap?.()}
      editable={disabled !== true}
    />
  </Box>
)

export const LabeledDateField: React.FC<FormFieldProps<Date>> = ({
  label,
  value,
  onChange,
  ...props
}) => (
  <Box width="100%" py={4} {...props}>
    <Text variant="heading3" pb={1}>
      {label}
    </Text>
    <Box
      borderColor="purple"
      borderWidth={2}
      borderRadius="m"
      alignItems="center"
      backgroundColor="white"
    >
      <DatePicker
        mode="date"
        date={value}
        onDateChange={(date) => onChange(format(date, 'yyyy-MM-dd'))}
      />
    </Box>
  </Box>
)

type PickerFieldProps = FormFieldProps<string> & {
  options: { value: string; label: string }[]
  placeholder?: string
}

export const LabeledPickerField: React.FC<PickerFieldProps> = ({
  label,
  value,
  placeholder,
  options = [],
  onChange,
  ...props
}) => {
  const actionSheetRef = useRef<ActionSheetRef>(null)
  const setModal = (open) => actionSheetRef.current?.setModalVisible(open)
  const selectedLabel = options.find((option) => option.value == value)?.label
  const maxHeight = Dimensions.get('screen').height * 0.7

  return (
    <>
      <Box {...props}>
        <Pressable onPress={() => setModal(true)} {...props}>
          <Box width="100%">
            {!!label && (
              <Text variant="heading3" pb={2}>
                {label}
              </Text>
            )}

            <Box
              height={50}
              flex={1}
              flexDirection="row"
              alignItems="center"
              borderWidth={2}
              borderColor="purple"
              paddingLeft={3}
              borderRadius="m"
              backgroundColor="white"
            >
              <Text fontSize={14} numberOfLines={1} ellipsizeMode="tail">
                {selectedLabel ?? placeholder}
              </Text>
            </Box>
          </Box>
        </Pressable>
      </Box>

      <ActionSheet
        ref={actionSheetRef}
        defaultOverlayOpacity={0.8}
      >
        <Box px={{ s: 4, m: 6 }}>
          <Box
            flexDirection="row"
            justifyContent="space-between"
            alignItems="flex-start"
            py={6}
          >
            <Box maxWidth="75%">
              <Text variant="heading2">{label}</Text>
            </Box>
            <Pressable mt={2} onPress={() => setModal(false)}>
              <Text variant="buttonLabel" color="purple" fontSize={16}>
                Done
              </Text>
            </Pressable>
          </Box>

          {/* <ScrollView> */}
          <Box minHeight={300} pb={10} maxHeight={maxHeight}>
            {options.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => onChange(option.value)}
              >
                <Box
                  backgroundColor="offWhite"
                  borderRadius="s"
                  mb={3}
                  px={2}
                  py={3}
                  borderColor={option.value == value ? 'purple' : 'offWhite'}
                  borderWidth={3}
                >
                  <Text variant="selectLabel">{option.label}</Text>
                </Box>
              </Pressable>
            ))}
          </Box>
          {/* </ScrollView> */}
        </Box>
      </ActionSheet>
    </>
  )
}
