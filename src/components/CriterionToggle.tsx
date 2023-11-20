import { BoxProps } from '@shopify/restyle'
import { Button } from './Button'
import { Box } from './Box'
import { Theme } from '@utils/theme'

type ButtonProps = {
  label: string
  value: any
}

type CriterionToggleProps = BoxProps<Theme> & {
  id: number | string
  value: boolean
  onChange: Function
  leftButton?: ButtonProps
  rightButton?: ButtonProps
}

export const CriterionToggle: React.FunctionComponent<CriterionToggleProps> = ({
  id,
  value,
  onChange,
  leftButton = {
    label: 'No',
    value: false,
  },
  rightButton = {
    label: 'Yes',
    value: true,
  },
  ...props
}) => {
  const updateChoice = (value: boolean) => {
    // Update parent
    onChange?.(id, value)
  }

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      {...props}
    >
      <Button
        flex={1}
        label={leftButton.label}
        textProps={{
          color: value == leftButton.value ? 'white' : 'purple',
          fontWeight: '700',
        }}
        backgroundColor={value == leftButton.value ? 'purple' : 'purpleLight'}
        width="100%"
        height={70}
        accessibilityLabel={leftButton.label}
        borderRadius="m"
        marginRight={2}
        onPress={() => updateChoice(leftButton.value)}
      />
      <Button
        flex={1}
        label={rightButton.label}
        textProps={{
          color: value == rightButton.value ? 'white' : 'purple',
          fontWeight: '700',
        }}
        backgroundColor={value == rightButton.value ? 'purple' : 'purpleLight'}
        width="100%"
        height={70}
        accessibilityLabel={rightButton.label}
        borderRadius="m"
        marginLeft={2}
        onPress={() => updateChoice(rightButton.value)}
      />
    </Box>
  )
}
