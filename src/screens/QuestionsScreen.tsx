import {
  ScrollView,
  Box,
  Text,
  RatingScale,
  CriterionToggle,
  LabeledPickerField,
  Button,
} from '@components'
import {
  PostExperimentQuestions,
  PostExperimentAnswers,
} from '@containers/PostExperimentQuestionsContainer'

type QuestionScreenProps = {
  heading: string
  questions: PostExperimentQuestions
  answers: PostExperimentAnswers
  updateAnswers: (answers: Partial<PostExperimentQuestions>) => void
  onContinue: () => void
}

const headphoneOptions = [
  'Never during any timed trials',
  "During timed trials, but I hadn't heard any loud noises",
  'During timed trials, after I had heard one loud noise',
  'During timed trials, after I had heard a few loud noises',
  "During timed trials, because I hadn't heard anything for a long time",
].map((q) => ({ label: q, value: q }))

export const QuestionsScreen: React.FC<QuestionScreenProps> = ({
  heading,
  questions,
  answers,
  updateAnswers,
  onContinue,
}) => {
  function answerQuestion(id, value) {
    updateAnswers({
      [id]: value,
    })
  }

  const canContinue =
    Object.keys(questions).filter((id) => {
      const questionShouldBeAnswered = questions[id]
      const questionAnswer = answers[id]

      if (
        id === 'didRemoveHeadphones' &&
        answers.didRemoveHeadphones == true &&
        answers.headphonesRemovalReason == null
      ) {
        return true
      }

      return questionShouldBeAnswered === true && questionAnswer == undefined
    }).length === 0

  return (
    <ScrollView>
      <Box flex={1} justifyContent="flex-start">
        <Box px={6} pt={{ s: 5, m: 12 }}>
          {heading && <Text variant="heading">{heading}</Text>}
          <Box
            opacity={0.1}
            borderTopColor="darkGrey"
            borderTopWidth={2}
            mt={2}
          />
        </Box>

        {questions.experimentUnpleasantRating && (
          <Box>
            <Box mt={8} px={6} pb={4}>
              <Text variant="heading3">
                How unpleasant did you find the experiment with the loud noises?
              </Text>
            </Box>

            <Box px={1}>
              <RatingScale
                value={answers.experimentUnpleasantRating}
                ratingOptions={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                paddingBottom={0}
                minAnchorHeight={60}
                lockFirstRating={false}
                anchorLabelLeft="Not unpleasant at all"
                anchorLabelCenter=""
                anchorLabelRight="Very unpleasant"
                onChange={(value) =>
                  answerQuestion('experimentUnpleasantRating', value)
                }
              />
            </Box>

            <Box mt={0} px={6} pb={4}>
              <Box
                opacity={0.1}
                borderTopColor="darkGrey"
                borderTopWidth={2}
                mt={8}
              />
            </Box>
          </Box>
        )}

        {questions.didFollowInstructions && (
          <QuestionBox heading="Did you follow the instructions fully during the session?">
            <CriterionToggle
              id="didFollowInstructions"
              value={answers.didFollowInstructions}
              onChange={answerQuestion}
            />
          </QuestionBox>
        )}

        {questions.didRemoveHeadphones && (
          <QuestionBox heading="Did you remove your headphones at any point during the experiment?">
            <CriterionToggle
              id="didRemoveHeadphones"
              value={answers.didRemoveHeadphones}
              onChange={answerQuestion}
            />
          </QuestionBox>
        )}

        {answers.didRemoveHeadphones && (
          <QuestionBox>
            <LabeledPickerField
              label="At what point did you remove your headphones?"
              placeholder="Pick an option..."
              options={headphoneOptions}
              value={answers.headphonesRemovalReason}
              onChange={(value) =>
                answerQuestion('headphonesRemovalReason', value)
              }
            />
          </QuestionBox>
        )}

        {questions.didPayAttention && (
          <QuestionBox heading="Were you paying attention throughout the task where you were rating images?">
            <CriterionToggle
              id="didPayAttention"
              value={answers.didPayAttention}
              onChange={answerQuestion}
            />
          </QuestionBox>
        )}

        {questions.taskEnvironment && (
          <QuestionBox heading="Where did you do the task?">
            <CriterionToggle
              id="taskEnvironment"
              value={answers.taskEnvironment}
              onChange={answerQuestion}
              leftButton={{
                label: 'In Private',
                value: 'private',
              }}
              rightButton={{
                label: 'In Public',
                value: 'public',
              }}
            />
          </QuestionBox>
        )}

        {questions.wasQuiet && (
          <QuestionBox heading="Was the place where you did the task quiet?">
            <CriterionToggle
              id="wasQuiet"
              value={answers.wasQuiet}
              onChange={answerQuestion}
            />
          </QuestionBox>
        )}

        {questions.wasAlone && (
          <QuestionBox heading="Were there any other people in the room (or passing by) while you were doing the task?">
            <CriterionToggle
              id="wasAlone"
              value={answers.wasAlone}
              onChange={answerQuestion}
            />
          </QuestionBox>
        )}

        {questions.wasInterrupted && (
          <QuestionBox heading="Were you interrupted during the task?">
            <CriterionToggle
              id="wasInterrupted"
              value={answers.wasInterrupted}
              onChange={answerQuestion}
            />
          </QuestionBox>
        )}
      </Box>

      <Box mt={4} px={6} pb={6}>
        <Button
          variant="primary"
          label="Continue"
          disabled={!canContinue}
          opacity={canContinue ? 1 : 0.4}
          onPress={onContinue}
        />
      </Box>
    </ScrollView>
  )
}

const QuestionBox = ({ heading, children }) => (
  <Box>
    <Box mt={4} px={6} pb={4}>
      {!!heading && (
        <Text variant="heading3" mb={5}>
          {heading}
        </Text>
      )}

      {children}
      <Box opacity={0.1} borderTopColor="darkGrey" borderTopWidth={2} mt={8} />
    </Box>
  </Box>
)
