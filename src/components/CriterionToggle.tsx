import { useState } from 'react'
import { BoxProps } from '@shopify/restyle'
import { Box, Button } from '@components'
import { Theme } from '@utils/theme'

type CriterionToggleProps = BoxProps<Theme> & {
  name: string
  value: boolean
  onChange: Function
}

export const CriterionToggle: React.FunctionComponent<CriterionToggleProps> = ({
  name,
  value,
  onChange,
  ...props
}) => {
  const updateChoice = (value: boolean) => {
    // Update parent
    onChange?.(name, value)
  }

  return (
    <Box
      flex={1}
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      {...props}
    >
      <Button
        flex={1}
        label="No"
        textProps={{
          color: value == false ? 'darkGrey' : 'white',
        }}
        backgroundColor={value == false ? 'yellow' : 'darkGrey'}
        width="100%"
        height={60}
        accessibilityLabel="No"
        borderTopLeftRadius="m"
        borderBottomLeftRadius="m"
        borderColor="white"
        borderWidth={2}
        onPress={() => updateChoice(false)}
      />
      <Button
        flex={1}
        label="Yes"
        textProps={{
          color: value == true ? 'darkGrey' : 'white',
        }}
        backgroundColor={value == true ? 'yellow' : 'darkGrey'}
        width="100%"
        height={60}
        accessibilityLabel="Yes"
        borderTopRightRadius="m"
        borderBottomRightRadius="m"
        borderColor="white"
        borderWidth={2}
        onPress={() => updateChoice(true)}
      />
    </Box>
  )
}
