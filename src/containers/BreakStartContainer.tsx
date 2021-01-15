import { ExperimentModule } from './ExperimentContainer'
import { TermsScreen, TextInstructionScreen } from '@screens'
import { useEffect } from 'react'
import { addSeconds } from 'date-fns'

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
  useEffect(() => {
    updateExperiment({
      breakEndDate: addSeconds(new Date(), mod.duration),
    })
  }, [])

  return (
    <TextInstructionScreen
      heading={mod.startTitle}
      description={mod.startBody}
      textAlign='left'
      actionLabel="Select 'next' to start break tasks"
      onNext={() => onModuleComplete()}
    />
  )
}
