import { useEffect } from 'react'
import { ExperimentModule } from './ExperimentContainer'
import { ScrollView, Stepper } from '@components'
import { TextInstructionScreen } from '@screens'
import { VolumeInstructionScreen } from '@screens/VolumeInstructionScreen'
import { HeadphonesDetectionScreen } from '@screens/HeadphonesDetectionScreen'
import { VolumeCalibrationScreen } from '@screens/VolumeCalibrationScreen'

type InstructionScreenDefinition = {
  title: string
  body: string
  actionLabel: string
}

type InstructionsModuleDefenition = {
  includeVolumeCalibration: boolean
  volumeIncrements: [number]
  endScreenTitle: string
  endScreenBody: string
  screens: InstructionScreenDefinition[]
}

export type InstructionsModuleState = InstructionsModuleDefenition & {
  currentInstruction?: number
  volumeRating?: number
}

export const InstructionsContainer: ExperimentModule<InstructionsModuleState> = ({
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

  if (!mod.includeVolumeCalibration) {
    unconditionalStimulus.setVolume(experiment.definition.usFileVolume)
  }

  // Use zero on first render
  const currentInstruction = mod.currentInstruction ?? 0

  // All the slides to render in order to render setup
  const onNextInstruction = () =>
    updateModule({ currentInstruction: mod.currentInstruction + 1 })

  let introScreens = mod.screens
    .map((screen: InstructionScreenDefinition) => (key) => (
      <TextInstructionScreen
        key={key}
        heading={screen.title}
        description={screen.body}
        actionLabel={screen.actionLabel}
        onNext={onNextInstruction}
      />
    ))
    .concat([
      (key) => (
        <HeadphonesDetectionScreen
          key={key}
          headphoneType={experiment.headphoneType}
          onNext={onNextInstruction}
        />
      ),
      (key) => (
        <VolumeInstructionScreen
          key={key}
          minimumVolume={experiment.definition.minimumVolume}
          onNext={onNextInstruction}
        />
      ),
    ])

  // Append Volume Calibration if configured
  function onFinishCalibration(volume, volumeRating) {
    updateExperiment({ volume })
    updateModule({
      volumeRating,
      currentInstruction: mod.currentInstruction + 1,
    })
  }

  if (mod.includeVolumeCalibration) {
    introScreens = introScreens.concat((key) => (
      <VolumeCalibrationScreen
        key={key}
        unconditionalStimulus={unconditionalStimulus}
        onFinishCalibration={onFinishCalibration}
        volumeIncrements={mod.volumeIncrements}
      />
    ))
  }

  // Insert end screen
  if (mod.endScreenTitle || mod.endScreenBody) {
    introScreens = introScreens.concat((key) => (
      <TextInstructionScreen
        key={key}
        heading={mod.endScreenTitle}
        description={mod.endScreenBody}
        onNext={onNextInstruction}
      />
    ))
  }

  // Get the current screen from the list
  const IntroScreen = introScreens?.[currentInstruction]

  // Generate a component with appropariate key to optimize rendering
  const Screen = IntroScreen && IntroScreen(`setup-${currentInstruction}`)

  // If no screens left then finish module
  if (IntroScreen === undefined) {
    onModuleComplete()
  }

  return (
    <ScrollView>
      <Stepper
        color="purple"
        stageLabel="Setup instructions"
        numberOfSteps={introScreens.length}
        currentStep={currentInstruction}
      />
      {Screen}
    </ScrollView>
  )
}
