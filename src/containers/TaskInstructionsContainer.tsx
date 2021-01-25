import { useEffect } from 'react'
import { ExperimentModule } from './ExperimentContainer'
import { SafeAreaView, Stepper } from '@components'
import {
  TextInstructionScreen,
  RatingExplainationScreen,
  RatingPracticeScreen,
  IntervalExplainationScreen,
} from '@screens'
import { AnchorLabels } from '@containers/ExperimentContainer'

type TaskInstructionsModuleDefinition = {
  // Screen 1
  introHeading: string
  introBody: string
  // Screen 2
  ratingExplanationHeading: string
  ratingExplanationBody: string
  // Screen 3
  ratingPracticeHeading: string
  // Screen 4
  intervalExplanationBody: string
  // Screen 5
  outroHeading: string
  outroBody: string
}

export type TaskInstructionsModuleState = TaskInstructionsModuleDefinition & {
  currentInstruction?: number
}

export const TaskInstructionsContainer: ExperimentModule<TaskInstructionsModuleState> = ({
  module: mod,
  updateModule,
  experiment,
  unconditionalStimulus,
  updateExperiment,
  onModuleComplete,
}) => {
  // Store current instruction in state
  useEffect(() => {
    if (mod.currentInstruction === undefined) {
      updateModule({ currentInstruction: 0 })
    }
  }, [])

  // Use zero on first render
  const currentInstruction = mod.currentInstruction ?? 0

  // All the slides to render in order to render setup
  const onNextInstruction = () =>
    updateModule({ currentInstruction: mod.currentInstruction + 1 })

  const anchorLabels: AnchorLabels = {
    anchorLabelLeft: experiment.definition.ratingScaleAnchorLabelLeft,
    anchorLabelCenter: experiment.definition.ratingScaleAnchorLabelCenter,
    anchorLabelRight: experiment.definition.ratingScaleAnchorLabelRight,
  }

  const taskInstructions = [
    (key) => (
      <TextInstructionScreen
        key={key}
        heading={mod.introHeading}
        description={mod.introBody}
        actionLabel="Please select ‘next’ to confirm."
        color="teal"
        onNext={onNextInstruction}
      />
    ),
    (key) => (
      <RatingExplainationScreen
        key={key}
        heading={mod.ratingExplanationHeading}
        description={mod.ratingExplanationBody}
        anchorLabels={anchorLabels}
        color="teal"
        textAlign="center"
        onNext={onNextInstruction}
      />
    ),
    (key) => (
      <RatingPracticeScreen
        key={key}
        heading={mod.ratingPracticeHeading}
        anchorLabels={anchorLabels}
        color="teal"
        onNext={onNextInstruction}
      />
    ),
    (key) => (
      <IntervalExplainationScreen
        key={key}
        description={mod.intervalExplanationBody}
        color="teal"
        onNext={onNextInstruction}
      />
    ),
    (key) => (
      <TextInstructionScreen
        key={key}
        heading={mod.outroHeading}
        description={mod.outroBody}
        color="teal"
        onNext={onNextInstruction}
      />
    ),
  ]

  // Get the current screen from the list
  const TaskScreen = taskInstructions?.[currentInstruction]

  // Generate a component with appropariate key to optimize rendering
  const Screen = TaskScreen && TaskScreen(`task-${currentInstruction}`)

  // If no screens left then finish module
  if (Screen === undefined) {
    onModuleComplete()
  }

  return (
    <SafeAreaView flex={1}>
      <Stepper
        color="teal"
        stageLabel="Task Instructions"
        numberOfSteps={taskInstructions.length}
        currentStep={currentInstruction}
      />
      {Screen}
    </SafeAreaView>
  )
}
