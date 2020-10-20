import { render } from '@testing-library/react-native'
import { FlareThemeProvider } from '@utils/theme'
import { Text } from '@components'

test('Text Renders Correctly', () => {
  const tree = render(
    <FlareThemeProvider>
      <Text />
    </FlareThemeProvider>,
  ).toJSON()
  expect(tree).toMatchSnapshot()
})
