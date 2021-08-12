import { ExperimentModule } from './ExperimentContainer'
import { QuestionsScreen } from '@screens'
import { useEffect } from 'react'

export type PostExperimentQuestions = {
  experimentUnpleasantRating?: boolean
  didFollowInstructions?: boolean
  didRemoveHeadphones?: boolean
  didPayAttention?: boolean
  taskEnvironment?: boolean
  wasQuiet?: boolean
  wasNotAlone?: boolean
  wasInterrupted?: boolean
}

export type PostExperimentAnswers = {
  experimentUnpleasantRating?: number
  didFollowInstructions?: boolean
  didRemoveHeadphones?: boolean
  headphonesRemovalReason?: string
  didPayAttention?: boolean
  taskEnvironment?: boolean
  wasQuiet?: boolean
  wasNotAlone?: boolean
  wasInterrupted?: boolean
}

export type PostExperimentQuestionsState = {
  heading: string
  questions: PostExperimentQuestions
  answers: PostExperimentAnswers
}

export const PostExperimentQuestionsContainer: ExperimentModule<PostExperimentQuestionsState> = ({
  module: mod,
  updateModule,
  onModuleComplete,
  exitExperiment,
}) => {
  useEffect(() => {
    if (mod.answers === undefined) {
      updateModule({ answers: {} })
    }
  }, [])

  function updateAnswers(answers: Partial<PostExperimentAnswers>) {
    updateModule({
      answers: {
        ...mod.answers,
        ...answers,
      },
    })
  }

  return (
    <QuestionsScreen
      heading={mod.heading}
      questions={mod.questions}
      answers={mod.answers ?? {}}
      updateAnswers={updateAnswers}
      onContinue={() => onModuleComplete()}
    />
  )
}
