import { render, fireEvent } from '@testing-library/react-native'
import { FlareThemeProvider } from '@utils/theme'
import { RejectionScreen } from '@screens'

test('Text Renders Correctly', () => {
  const tree = render(
    <FlareThemeProvider>
      <RejectionScreen />
    </FlareThemeProvider>,
  ).toJSON()

  expect(tree).toMatchSnapshot()
})

test('Calls Props on button press', () => {
  // Setup mock functions
  const onExit = jest.fn()

  // Render screen
  const { queryByTestId } = render(
    <FlareThemeProvider>
      <RejectionScreen
        contactLink='mailt:flare@internet.com'
        onExit={onExit}
      />
    </FlareThemeProvider>,
  )

  // Capture all elements
  const exitButton = queryByTestId('ExitButton')

  // Check functions
  fireEvent.press(exitButton)
  expect(onExit).toBeCalledTimes(1)
})
