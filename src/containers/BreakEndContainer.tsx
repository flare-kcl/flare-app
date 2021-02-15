import { useRef, useState } from 'react'
import { ExperimentModule } from './ExperimentContainer'
import { TextInstructionScreen } from '@screens'
import { useEffect } from 'react'
import {
  isPast,
  addSeconds,
  formatDuration,
  intervalToDuration,
  differenceInSeconds,
} from 'date-fns'
import { BreakEndScreen } from '@screens/BreakEndScreen'
import { format } from 'date-fns/esm'

export type BreakEndModuleState = {
  endTitle: number
  endBody: number
  duration: number
}

export const BreakEndContainer: ExperimentModule<BreakEndModuleState> = ({
  module: mod,
  experiment,
  onModuleComplete,
  updateExperiment,
}) => {
  const timerRef = useRef<any>()
  const [canContinue, setCanContinue] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState<string>()
  const [extendedTimeRemaining, setExtendedTimeRemaining] = useState<string>()

  // Convert string to date
  const breakEndDate =
    experiment.breakEndDate && Date.parse(experiment.breakEndDate)

  const enableTimeout = () => {
    // Enable timeout again
    updateExperiment({
      breakEndDate: undefined,
    })

    // Continue to next module
    onModuleComplete()
  }

  const onTimerTick = () => {
    const cancelCountdown = () => {
      setCanContinue(true)
      clearInterval(timerRef.current)
    }

    // Cancel if end time becomes invalid
    if (breakEndDate === undefined) {
      cancelCountdown()
    }

    // Cancel timer if we have met end
    if (isPast(breakEndDate)) {
      cancelCountdown()
    }

    // Calculate how long left
    const secondsRemaining = differenceInSeconds(breakEndDate, new Date())

    const duration = intervalToDuration({
      start: new Date(),
      end: breakEndDate,
    })

    // If over 24 hours then use something nicer than countown clock
    if (secondsRemaining >= 86400) {
      setTimeRemaining(null)
      setExtendedTimeRemaining(
        formatDuration(duration, {
          format: ['years', 'months', 'weeks', 'days', 'hours', 'minutes'],
        }),
      )
    } else {
      setExtendedTimeRemaining(null)
      setTimeRemaining(
        `${String(duration.hours).padStart(2, '0')}:${String(
          duration.minutes,
        ).padStart(2, '0')}:${String(duration.seconds).padStart(2, '0')}`,
      )
    }
  }

  // Start countdown timer
  useEffect(() => {
    // If the break has expired then quit early...
    if (
      breakEndDate == undefined ||
      isPast(Date.parse(experiment.breakEndDate))
    ) {
      setCanContinue(true)
      return
    }

    // Start a countdown timer
    timerRef.current = setInterval(onTimerTick, 500)

    // Delete timer on app exit
    return () => {
      clearInterval(timerRef.current)
    }
  }, [])

  return (
    <BreakEndScreen
      heading={mod.endTitle}
      description={mod.endBody}
      timerText={canContinue ? 'Break Over' : timeRemaining}
      eta={format(breakEndDate, 'dd/MM/yyyy - HH:mm:ss')}
      extendedTimerText={extendedTimeRemaining}
      actionLabel={canContinue && 'Select ‘Next’ to continue'}
      buttonDisabled={!canContinue}
      onNext={() => enableTimeout()}
    />
  )
}
