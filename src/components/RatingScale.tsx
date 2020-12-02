import { useState, useCallback } from 'react'
import { Box, Text } from '@components'
import { Dimensions } from 'react-native'
import { Pressable } from '@components'
import { debounce } from 'lodash'

import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'

type RatingScaleProps = {
  anchorLabelLeft: string
  anchorLabelCenter: string
  anchorLabelRight: string
  lockFirstRating: boolean
  onChange: (value: number) => void
}

export const RatingScale: React.FunctionComponent<RatingScaleProps> = ({
  anchorLabelLeft = 'Certain no scream',
  anchorLabelCenter = 'Uncertain',
  anchorLabelRight = 'Certain scream',
  onChange,
  lockFirstRating = true,
}) => {
  // Keep track of selected value
  const ratingOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9]
  const [locked, setLocked] = useState(false)
  const [currentButton, setCurrentButton] = useState<number>()

  // Calculate size of buttons
  const screenWidth = Dimensions.get('screen').width
  const boxSize = 0.1 * screenWidth

  // Only lock if specified via props
  const setRatingLocked = (locked: boolean) => {
    if (lockFirstRating) {
      setLocked(locked)
    }
  }

  // Update internal state + parent
  const setSelectionOption = (value: number, debounceLock = false) => {
    setCurrentButton(value)
    // If we are swiping we only want to lock when we stop swiping
    if (debounceLock) {
      debouncedLock(value)
    } else {
      setRatingLocked(true)
      onChange(value)
    }
  }

  // Debounce locking for 100ms
  const debouncedLock = useCallback(
    debounce((value: number) => {
      setRatingLocked(true)
      onChange(value)
    }, 300),
    [],
  )

  const onSwipe = (event: PanGestureHandlerGestureEvent) => {
    // Get position across screen
    const { absoluteX } = event.nativeEvent
    // See what segment along scale the finger is scrolling past
    let value = Math.round((absoluteX / screenWidth) * ratingOptions.length)
    // Apply 1-9 bounds to value
    value = value < 1 ? 1 : value > 9 ? 9 : value
    if (!locked) {
      setSelectionOption(value, true)
    }
  }

  return (
    <PanGestureHandler onGestureEvent={onSwipe}>
      <Box
        flex={1}
        justifyContent="flex-start"
        flexDirection={{
          phone: 'column',
        }}
        pb={16}
      >
        {/* Trial rating scale */}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-end"
          width="100%"
          p={1}
          height={1.3 * boxSize}
        >
          {ratingOptions.map((value) => (
            <Pressable
              key={`rating-button-${value}`}
              width={value == currentButton ? 1.3 * boxSize : boxSize}
              height={value == currentButton ? 1.3 * boxSize : boxSize}
              backgroundColor={value == currentButton ? 'purple' : 'darkGrey'}
              alignItems="center"
              justifyContent="center"
              onPress={() => (!locked ? setSelectionOption(value) : null)}
            >
              <Text fontSize={20} fontWeight="bold" color="white">
                {value}
              </Text>
            </Pressable>
          ))}
        </Box>

        {/* Helper labels */}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="flex-start"
          px={1}
          pt={4}
        >
          <Box width="25%">
            <Text textAlign="left" fontWeight="600">
              {anchorLabelLeft}
            </Text>
          </Box>
          <Box width="33%">
            <Text textAlign="center" fontWeight="600">
              {anchorLabelCenter}
            </Text>
          </Box>
          <Box width="25%">
            <Text textAlign="right" fontWeight="600">
              {anchorLabelRight}
            </Text>
          </Box>
        </Box>
      </Box>
    </PanGestureHandler>
  )
}
