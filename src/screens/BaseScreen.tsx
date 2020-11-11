import { NavigationProp } from '@react-navigation/native'
import { palette } from '@utils/theme'

/*
  The 2 below types allows us to staticly type the ID of a screen (used by the navigator) and the paramaters that
  should be passed to screen using .navigate method (See react-navigation).
 */
type ModuleScreenProps<Params, Props> = Props & {
  route?: {
    key?: string
    name?: string
    params: Params
  }
}

export type ModuleScreen<
  Params = undefined,
  Props = {}
> = React.FunctionComponent<ModuleScreenProps<Params, Props>> & {
  screenID?: string
}

const headerStyling = {
  headerTintColor: palette.darkGrey,
  headerTitleStyle: {
    fontSize: 18,
  },
  headerStyle: {
    backgroundColor: palette.greenLight,
  },
}

export function renderModuleScreen(
  component: ModuleScreen<any>,
  navigationLabel: string,
  customOptions?: object,
) {
  return {
    component,
    name: component.screenID,
    options: {
      headerLeft: null,
      headerTitle: navigationLabel,
      ...headerStyling,
      ...customOptions,
    },
  }
}
