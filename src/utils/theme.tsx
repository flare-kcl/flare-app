import { ThemeProvider, createTheme } from '@shopify/restyle'

export const palette = {
  purple: '#726DA8',
  purpleLight: '#a537fd',
  greenLight: '#B2DBBF',

  greenPrimary: '#70C1B3',
  greenDark: '#0A906E',
  greenCorrect: '#2ed573',
  coral: '#F07167',
  red: '#ff4757',
  yellow: '#FFBF46',
  darkGrey: '#212529',
  lightGrey: '#bdc3c7',
  black: '#0B0B0B',
  white: '#F0F2F3',
}

export const theme = createTheme({
  colors: {
    ...palette,
    mainBackground: palette.white,
    cardPrimaryBackground: palette.purple,
  },
  spacing: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    8: 32,
    10: 40,
    12: 48,
    14: 60,
  },
  borderRadii: {
    s: 4,
    m: 8,
    round: 1000000,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    // Both used on the login scren
    heading: {
      fontFamily: 'Inter-Light',
      fontSize: 45,
      color: 'black',
      opacity: 0.7,
      alignSelf: 'center',
    },
    heading3: {
      fontFamily: 'Inter',
      fontSize: 20,
      fontWeight: '700',
    },
    caption: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 20,
      color: 'black',
      opacity: 0.7,
      alignSelf: 'center',
    },
    caption2: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 15,
      color: 'black',
      opacity: 0.7,
      alignSelf: 'center',
    },
    buttonLabel: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 20,
      color: 'white',
    },
  },
  buttonVariants: {
    primary: {
      backgroundColor: 'purple',
      width: 300,
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'm',
      alignSelf: 'flex-end',
    },
  },

  inputVariants: {
    login: {
      height: 50,
      width: 320,
      backgroundColor: 'white',
      borderColor: 'purple',
      borderWidth: 2,
      borderRadius: 'm',
      paddingLeft: 10,
    },
  },
})

// Utility HOC for use in App and Tests
export const FlareThemeProvider = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export type Theme = typeof theme
export default theme
