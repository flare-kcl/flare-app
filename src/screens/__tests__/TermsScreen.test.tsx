import { render, fireEvent } from '@testing-library/react-native'
import { FlareThemeProvider } from '@utils/theme'
import { TermsScreen } from '@screens'
import { exampleTermsDefinition } from '@utils/exampleExperiment'

test('Text Renders Correctly', () => {
  const tree = render(
    <FlareThemeProvider>
      <TermsScreen route={{ params: exampleTermsDefinition }} />
    </FlareThemeProvider>,
  ).toJSON()

  expect(tree).toMatchSnapshot()
})

test('Calls Props on button press', () => {
  // Setup mock functions
  const onAccept = jest.fn()
  const onExit = jest.fn()

  // Render screen
  const { queryByTestId } = render(
    <FlareThemeProvider>
      <TermsScreen
        route={{
          params: {
            ...exampleTermsDefinition,
            onAccept,
            onExit,
          },
        }}
      />
    </FlareThemeProvider>,
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
