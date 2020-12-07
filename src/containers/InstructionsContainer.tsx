import { useEffect, useState } from 'react'
import { ExperimentModule } from './ExperimentContainer'
import { Stepper } from '@components'
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
        () => (
          <TextInstructionScreen
            heading="Check your surroundings"
            description="Before you begin the experiment, make sure you are alone, in a quiet room, where you will not be disturbed. "
            actionLabel="Please select ‘next’ to confirm."
            onNext={onNextInstruction}
          />
        ),
        () => (
          <TextInstructionScreen
            heading="Check your phone battery"
            description="Make sure your device is fully charged, or is plugged in, and you have enough time to complete the whole experiment."
            actionLabel="Please select ‘next’ to confirm."
            onNext={onNextInstruction}
          />
        ),
        () => (
          <TextInstructionScreen
            heading="Check your Wifi"
            description="Make sure you are connected to the internet using wifi and you have airplane mode turned on (you may need to turn wifi on after you have selected airplane mode)."
            actionLabel="Ignore any messages, calls, or notifications you may receive during this time."
            onNext={onNextInstruction}
          />
        ),
        () => (
          <TextInstructionScreen
            heading="Practice Time"
            description="Before you begin the experiment, we need to to practice using the rating interface."
            actionLabel="Please select ‘next’ to confirm."
            onNext={onNextInstruction}
          />
        ),
        () => (
          <HeadphonesDetectionScreen
            headphoneType="ON_EAR"
            onNext={onNextInstruction}
          />
        ),
        () => <VolumeInstructionScreen onNext={onNextInstruction} />,
      ]
    : []

  // Append Volume Calibration if configured
  function onFinishCalibration(volume) {
    updateExperiment({ volume })
    onNextInstruction()
  }

  if (mod.advancedVolumeCalibration) {
    introScreens = introScreens.concat(() => (
      <VolumeCalibrationScreen onFinishCalibration={onFinishCalibration} />
    ))
  }

  // All slides for trial setup
  const onNextTrialInstruction = () =>
    updateModule({ currentTrialInstruction: mod.currentTrialInstruction + 1 })
  let trialScreens = mod.renderTrialTask
    ? [
        () => (
          <TextInstructionScreen
            heading="Task Instructions"
            description="You will now see some images. You will be asked to rate your feelings and familiarity for these images."
            actionLabel="Use the whole range of scales to help you make as detailed a rating of how you feel as possible."
            color="teal"
            onNext={onNextTrialInstruction}
          />
        ),
        () => (
          <RatingExplainationScreen
            heading="A few seconds after each circle appears, this scale will disappear at the bottom of the screen."
            description="Each time the scale appears, press the corresponding number on the screen to rate how much you expect to hear a scream."
            color="teal"
            onNext={onNextTrialInstruction}
          />
        ),
        () => (
          <RatingPracticeScreen
            heading="Press any number to practice making a rating with the scaling below."
            color="teal"
            onNext={onNextTrialInstruction}
          />
        ),
        () => (
          <IntervalExplainationScreen
            description="Before each circle is presented, you will see a white screen with a cross in the middle like the one shown above. It is important that you keep looking at the cross and wait for the next circle to appear."
            color="teal"
            onNext={onNextTrialInstruction}
          />
        ),
        () => (
          <TextInstructionScreen
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

  // If no screens left then finish module
  if (IntroScreen === undefined && TrialScreen === undefined) {
    onModuleComplete()
  }

  return (
    <>
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
      {CurrentScreen && <CurrentScreen />}
    </>
  )
}
