import { createRef, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native'

// Export the ref to be used by view controllers
export const navigationRef = createRef<NavigationContainerRef>()
export const navigatorReadyRef = createRef<boolean>()

// Manually write any methods that perform on navigationRef
export function navigate(name, params) {
  navigationRef.current?.navigate(name, params)
}

// Utility function for the above but with type support
export function navigateToScreen<Params>(name: string, params: Params) {
  navigate(name, params)
}
