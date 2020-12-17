import { ResponsiveValue, ThemeProvider, createTheme } from '@shopify/restyle'

export const palette = {
  purple: '#5E44AE',
  purpleLight: '#EAE3FF',
  greenLight: '#B2DBBF',
  teal: '#008080',
  tealLight: '#88CDC5',

  greenPrimary: '#70C1B3',
  greenDark: '#0A906E',
  greenCorrect: '#2ed573',
  coral: '#F07167',
  red: '#ff4757',
  yellow: '#FFBF46',
  darkGrey: '#212529',
  lightGrey: '#e4e9ed',
  black: '#0B0B0B',
  white: '#F0F2F3',
  pureWhite: '#FFFF',
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
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 44,
    13: 48,
    14: 52,
    15: 56,
    16: 60,
    24: 96,
    25: 100,
    26: 104,
  },
  borderRadii: {
    s: 4,
    m: 8,
    l: 12,
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
      fontSize: 30,
      fontWeight: 'bold',
      color: 'darkGrey',
      alignSelf: 'flex-start',
      marginBottom: 3,
    },
    heading2: {
      fontFamily: 'Inter',
      fontSize: 22,
      fontWeight: '600',
      color: 'darkGrey',
      marginBottom: 2,
    },
    heading3: {
      fontFamily: 'Inter',
      fontSize: 16,
      fontWeight: '500',
      color: 'darkGrey',
      marginBottom: 2,
    },
    loginHeading: {
      fontFamily: 'Inter-Light',
      fontSize: 45,
      color: 'black',
      opacity: 0.7,
      alignSelf: 'center',
      marginBottom: 3,
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
    instructionHeading: {
      fontFamily: 'Inter',
      fontWeight: '700',
      fontSize: 25,
      color: 'darkGrey',
      textAlign: 'center',
    },
    instructionDescription: {
      fontFamily: 'Inter',
      fontWeight: '500',
      fontSize: 18,
      color: 'darkGrey',
      textAlign: 'left',
    },
    instructionActionLabel: {
      fontFamily: 'Inter',
      fontWeight: '300',
      fontSize: 15,
      color: 'darkGrey',
      textAlign: 'center',
    },
  },
  buttonVariants: {
    primary: {
      backgroundColor: 'purple',
      mt: 2,
      py: 4,
      height: 60,
      borderRadius: 'm',
      textProps: {
        color: 'white',
      },
    },
    exit: {
      mt: 2,
      py: 4,
      backgroundColor: 'red',
      borderRadius: 'm',
      textProps: {
        color: 'white',
      },
    },
  },

  inputVariants: {
    login: {
      height: 50,
      width: '100%',
      backgroundColor: 'white',
      borderColor: 'purple',
      borderWidth: 2,
      borderRadius: 'm',
      paddingLeft: 4,
    },
  },
})

// Utility HOC for use in App and Tests
export const FlareThemeProvider = ({ children }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

export type Theme = typeof theme
export default theme

// Export color props for types
export type ThemeColors = ResponsiveValue<keyof Theme['colors'], Theme>
