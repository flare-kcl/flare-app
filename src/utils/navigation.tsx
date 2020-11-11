import { createRef } from 'react'
import { StackActions } from '@react-navigation/routers'
import { NavigationContainerRef } from '@react-navigation/native'

// Export the ref to be used by view controllers
export const navigationRef = createRef<NavigationContainerRef>()
export const navigatorReadyRef = createRef<boolean>()

// Manually write any methods that perform on navigationRef
export function navigate(name, params) {
  navigationRef.current.dispatch(StackActions.replace(name, params))
}

// Utility function for the above but with type support
export function navigateToScreen<Params>(name: string, params: Params) {
  navigate(name, params)
}
