import { render, fireEvent } from '@testing-library/react-native'
import { FlareThemeProvider } from '@utils/theme'
import { TermsScreen } from '@screens'
import { acc } from 'react-native-reanimated'

test('Text Renders Correctly', () => {
  const tree = render(
    <FlareThemeProvider>
      <TermsScreen />
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
      <TermsScreen onAccept={onAccept} onExit={onExit} />
    </FlareThemeProvider>,
  )

  // Capture all elements
  const scrollButton = queryByTestId("ScrollButton")
  const acceptButton = queryByTestId("AcceptButton")
  const exitButton = queryByTestId("ExitButton")

  // Scroll to bottom of page
  fireEvent.press(scrollButton)

  // Check functions
  fireEvent.press(acceptButton)
  fireEvent.press(exitButton)
  expect(onAccept).toBeCalledTimes(1)
  expect(onExit).toBeCalledTimes(1)
})
