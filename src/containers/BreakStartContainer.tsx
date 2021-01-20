import { useEffect } from 'react'
import { subHours, addSeconds } from 'date-fns'
import { ExperimentModule } from './ExperimentContainer'
import { TextInstructionScreen } from '@screens'
import { scheduleNotification } from '@utils/notifications'
import { brand } from 'expo-device'

export type BreakStartModuleState = {
  startTitle: number
  startBody: number
  duration: number
}

export const BreakStartContainer: ExperimentModule<BreakStartModuleState> = ({
  module: mod,
  onModuleComplete,
  updateExperiment,
}) => {
  // Disable timeout for this experiment until n seconds in future.
  const breakEndDate = addSeconds(new Date(), mod.duration)
  useEffect(() => {
    // Update State
    updateExperiment({ breakEndDate })

    // Add notification alerts
    scheduleNotification('BREAK_OVER', breakEndDate)

    // Add warning notification 2 hours before end if break is over 4 hours
    if (mod.duration >= 14400) {
      const reminderDate = subHours(breakEndDate, 2)
      scheduleNotification('BREAK_OVER_APPROACHING', reminderDate)
    }
  }, [])

  return (
    <TextInstructionScreen
      heading={mod.startTitle}
      description={mod.startBody}
      textAlign="left"
      actionLabel="Select 'next' to start break tasks"
      onNext={() => onModuleComplete()}
    />
  )
}
