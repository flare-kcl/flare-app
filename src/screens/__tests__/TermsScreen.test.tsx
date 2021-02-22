import { render, fireEvent } from '@testing-library/react-native'
import { TermsScreen } from '@screens'
import { exampleTermsDefinition } from '@utils/exampleExperiment'
import { TestProvider } from '@utils/TestProvider'

test('Text Renders Correctly', () => {
  const tree = render(
    <TestProvider>
      <TermsScreen {...exampleTermsDefinition} />
    </TestProvider>,
  ).toJSON()

  expect(tree).toMatchSnapshot()
})

test('Calls Props on button press', () => {
  // Setup mock functions
  const onAccept = jest.fn()
  const onExit = jest.fn()

  // Render screen
  const { queryByTestId } = render(
    <TestProvider>
      <TermsScreen
        {...exampleTermsDefinition}
        onAccept={onAccept}
        onExit={onExit}
      />
    </TestProvider>,
  )

  // Capture all elements
  const acceptButton = queryByTestId('AcceptButton')
  const exitButton = queryByTestId('ExitButton')

  // Check functions
  fireEvent.press(acceptButton)
  fireEvent.press(exitButton)
  expect(onAccept).toBeCalledTimes(1)
  expect(onExit).toBeCalledTimes(1)
})
