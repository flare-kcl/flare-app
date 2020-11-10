import { render, fireEvent } from '@testing-library/react-native'
import { FlareThemeProvider } from '@utils/theme'
import { CriteriaScreen } from '@screens'

test('Text Renders Correctly', () => {
  const tree = render(
    <FlareThemeProvider>
      <CriteriaScreen route={{ params: {} }} />
    </FlareThemeProvider>,
  ).toJSON()

  expect(tree).toMatchSnapshot()
})

test('Calls Props on button press', () => {
  // Setup mock functions
  const onPass = jest.fn()
  const onFail = jest.fn()
  const onExit = jest.fn()

  // Render screen
  const { queryByTestId, queryAllByA11yLabel } = render(
    <FlareThemeProvider>
      <CriteriaScreen
        route={{
          params: {
            onPassCriteria: onPass,
            onFailCriteria: onFail,
            onExit: onExit,
          },
        }}
      />
    </FlareThemeProvider>,
  )

  // Capture all elements
  const continueButton = queryByTestId('ContinueButton')
  const exitButton = queryByTestId('ExitButton')
  const noToggleButtons = queryAllByA11yLabel('No')
  const yesToggleButtons = queryAllByA11yLabel('Yes')

  // Check Exit button
  fireEvent.press(exitButton)
  expect(onExit).toBeCalledTimes(1)

  // Check Criteria Validation when no flags
  noToggleButtons.forEach((button) => {
    fireEvent.press(button)
  })
  fireEvent.press(continueButton)
  expect(onPass).toBeCalledTimes(1)

  // Answer all crireria as yes
  yesToggleButtons.forEach((button) => {
    fireEvent.press(button)
  })

  // Check if parcipant discarding works
  fireEvent.press(continueButton)
  expect(onFail).toBeCalledTimes(1)
})
