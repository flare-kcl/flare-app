import { useEffect, useState } from 'react'
import { ExperimentModule } from './ExperimentContainer'
import { SafeAreaView, Stepper } from '@components'
import { TextInstructionScreen } from '@screens'
import { VolumeInstructionScreen } from '@screens/VolumeInstructionScreen'
import { HeadphonesDetectionScreen } from '@screens/HeadphonesDetectionScreen'
import { RatingExplainationScreen } from '@screens/RatingExplainationScreen'
import { RatingPracticeScreen } from '@screens/RatingPracticeScreen'
import { IntervalExplainationScreen } from '@screens/IntervalExplainationScreen'
import { VolumeCalibrationScreen } from '@screens/VolumeCalibrationScreen'

type InstructionsModuleState = {
  renderIntroTask: boolean
  renderTrialTask: boolean
  advancedVolumeCalibration: boolean
  currentAppInstruction?: number
  currentTrialInstruction?: number
}

export const InstructionsContainer: ExperimentModule<InstructionsModuleState> = ({
  module: mod,
  updateModule,
  experiment,
  updateExperiment,
  onModuleComplete,
}) => {
  // Store current instruction in state
  useEffect(() => {
    if (mod.currentAppInstruction === undefined) {
      updateModule({ currentAppInstruction: 0, currentTrialInstruction: 0 })
    }
  }, [])

  // Use zero on first render
  const currentAppInstruction = mod.currentAppInstruction ?? 0
  const currentTrialInstruction = mod.currentTrialInstruction ?? 0

  // All the slides to render in order to render setup
  const onNextInstruction = () =>
    updateModule({ currentAppInstruction: mod.currentAppInstruction + 1 })
  let introScreens = mod.renderIntroTask
    ? [
        (key) => (
          <TextInstructionScreen
            key={key}
            heading="Check your surroundings"
            description="Before you begin the experiment, make sure you are alone, in a quiet room, where you will not be disturbed. "
            actionLabel="Please select ‘next’ to confirm."
            onNext={onNextInstruction}
          />
        ),
        (key) => (
          <TextInstructionScreen
            key={key}
            heading="Check your phone battery"
            description="Make sure your device is fully charged, or is plugged in, and you have enough time to complete the whole experiment."
            actionLabel="Please select ‘next’ to confirm."
            onNext={onNextInstruction}
          />
        ),
        (key) => (
          <TextInstructionScreen
            key={key}
            heading="Check your Wifi"
            description={`Make sure you are connected to the internet using wifi and you have airplane mode turned on (you may need to turn wifi on after you have selected airplane mode).\n\nIgnore any messages, calls, or notifications you may receive during this time.`}
            actionLabel="Please select ‘next’ to confirm."
            onNext={onNextInstruction}
          />
        ),
        (key) => (
          <HeadphonesDetectionScreen
            key={key}
            headphoneType={experiment.headphoneType}
            onNext={onNextInstruction}
          />
        ),
        (key) => (
          <VolumeInstructionScreen key={key} onNext={onNextInstruction} />
        ),
      ]
    : []

  // Append Volume Calibration if configured
  function onFinishCalibration(volume) {
    updateExperiment({ volume })
    onNextInstruction()
  }

  if (mod.advancedVolumeCalibration) {
    introScreens = introScreens.concat((key) => (
      <VolumeCalibrationScreen
        key={key}
        unconditionalStimulus={experiment.definition.unconditionalStimulus}
        onFinishCalibration={onFinishCalibration}
      />
    ))
  }

  // All slides for trial setup
  const onNextTrialInstruction = () =>
    updateModule({ currentTrialInstruction: mod.currentTrialInstruction + 1 })
  let trialScreens = mod.renderTrialTask
    ? [
        (key) => (
          <TextInstructionScreen
            key={key}
            heading="Practice Time"
            description="Before you begin the experiment, we need to to practice using the rating interface."
            actionLabel="Please select ‘next’ to confirm."
            color="teal"
            onNext={onNextTrialInstruction}
          />
        ),
        (key) => (
          <RatingExplainationScreen
            key={key}
            heading="A few seconds after each circle appears, this scale will appear at the bottom of the screen."
            description="Each time the scale appears, press the corresponding number on the screen to rate how much you expect to hear a scream."
            color="teal"
            textAlign="center"
            onNext={onNextTrialInstruction}
          />
        ),
        (key) => (
          <RatingPracticeScreen
            key={key}
            heading="Press any number to practice making a rating with the scaling below."
            color="teal"
            onNext={onNextTrialInstruction}
          />
        ),
        (key) => (
          <IntervalExplainationScreen
            key={key}
            description="Before each circle is presented, you will see a white screen with a cross in the middle like the one shown above. It is important that you keep looking at the cross and wait for the next circle to appear."
            color="teal"
            onNext={onNextTrialInstruction}
          />
        ),
        (key) => (
          <TextInstructionScreen
            key={key}
            heading="Instructions Complete"
            description={`The experiment will now begin.\n\n You may occasionaly hear a scream.\n\n Remember to rate how much you expect to hear a scream by pressing a number every time the scale appears.`}
            color="teal"
            onNext={onNextTrialInstruction}
          />
        ),
      ]
    : []

  // Get the correct screen
  const IntroScreen = introScreens?.[currentAppInstruction]
  const TrialScreen = trialScreens?.[currentTrialInstruction]
  const CurrentScreen = IntroScreen ?? TrialScreen
  const inRatingPhase = IntroScreen === undefined && TrialScreen !== undefined

  // Generate a component with appropariate key to optimize rendering
  const Screen =
    CurrentScreen &&
    CurrentScreen(
      inRatingPhase
        ? `setup-${currentTrialInstruction}`
        : `intro-${currentAppInstruction}`,
    )

  // If no screens left then finish module
  if (IntroScreen === undefined && TrialScreen === undefined) {
    onModuleComplete()
  }

  return (
    <SafeAreaView flex={1}>
      <Stepper
        color={inRatingPhase ? 'teal' : 'purple'}
        stageLabel={inRatingPhase ? 'Task Instructions' : 'Set up instructions'}
        numberOfSteps={
          inRatingPhase ? trialScreens.length : introScreens.length
        }
        currentStep={
          inRatingPhase ? currentTrialInstruction : currentAppInstruction
        }
      />
      {Screen}
    </SafeAreaView>
  )
}
