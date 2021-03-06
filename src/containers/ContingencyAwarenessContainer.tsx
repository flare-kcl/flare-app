import { ExperimentModule, VisualStimuli } from './ExperimentContainer'
import shuffle from 'lodash/shuffle'
import {
  CAQuestionScreen,
  CAConfirmationQuestionScreen,
} from '@screens/ContingencyAwarenessScreen'

type ContingencyAwarenessScreen = 'AWARENESS_QUESTION' | 'CONFIRMATION_QUESTION'

export type ContingencyAwarenessModuleDefinition = {
  awarenessQuestion: string
  confirmationQuestion: string
}

export type ContingencyAwarenessModuleState = ContingencyAwarenessModuleDefinition & {
  stimuli: VisualStimuli[]
  awarenessAnswer?: boolean
  confirmationAnswer?: string
  isAware?: boolean
  currentScreen?: ContingencyAwarenessScreen
}

export const ContingencyAwarenessContainer: ExperimentModule<ContingencyAwarenessModuleState> = ({
  module: mod,
  experiment,
  updateModule,
  onModuleComplete,
}) => {
  const currentScreen = mod.currentScreen ?? 'AWARENESS_QUESTION'

  if (currentScreen === 'AWARENESS_QUESTION') {
    return (
      <CAQuestionScreen
        question={mod.awarenessQuestion}
        answer={mod.awarenessAnswer}
        updateAnswer={(awarenessAnswer) => updateModule({ awarenessAnswer })}
        onNext={() => {
          if (mod.awarenessAnswer === true) {
            updateModule({
              currentScreen: 'CONFIRMATION_QUESTION',
              stimuli: shuffle(
                Object.values(experiment.definition.conditionalStimuli),
              ),
            })
          } else {
            onModuleComplete({ isAware: false })
          }
        }}
      />
    )
  }

  if (currentScreen === 'CONFIRMATION_QUESTION') {
    return (
      <CAConfirmationQuestionScreen
        question={mod.confirmationQuestion}
        answer={mod.confirmationAnswer}
        updateAnswer={(confirmationAnswer) =>
          updateModule({ confirmationAnswer })
        }
        stimuli={mod.stimuli}
        onNext={() => {
          onModuleComplete({
            isAware:
              mod.confirmationAnswer ===
              experiment.definition.conditionalStimuli['cs+'].label,
          })
        }}
      />
    )
  }

  return null
}
