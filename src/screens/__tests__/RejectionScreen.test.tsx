import { render, fireEvent } from '@testing-library/react-native'
import { TestProvider } from '@utils/TestProvider'
import { RejectionScreen } from '@screens'

test('Text Renders Correctly', () => {
  const tree = render(
    <TestProvider>
      <RejectionScreen />
    </TestProvider>,
  ).toJSON()

  expect(tree).toMatchSnapshot()
})

test('Calls Props on button press', () => {
  // Setup mock functions
  const onExit = jest.fn()

  // Render screen
  const { queryByTestId } = render(
    <TestProvider>
      <RejectionScreen contactLink="mailt:flare@internet.com" onExit={onExit} />
    </TestProvider>,
  )

  // Capture all elements
  const exitButton = queryByTestId('ExitButton')

  // Check functions
  fireEvent.press(exitButton)
  expect(onExit).toBeCalledTimes(1)
})
