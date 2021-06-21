# FLARe Native App

### What is FLARe?

FLARe is a native mobile app that allows researchers to deliver fear conditioning tasks to participants and review the experiment data in a custom built web portal.

## Prerequisites

- A MacOS development machine prepared for iOS and Android development (Guide: https://www.educative.io/edpresso/how-to-install-react-native-onmacos).
- A knowledge of React.js structure.
- Typescript familiarity would be recommended.

## 💻 Setup development enviroment

- Clone the project: `git clone https://github.com/flare-kcl/flare-app`
- Install NPM deps: `npm i`
- Check native dependencies: `npx @react-native-community/cli doctor`
- Install CocoaPods for iOS build: `cd ios && pod install`

## Connecting App to portal

- The app can connect to any FLARe portal hosted on an accesible domain. This can be done by changing the `BASE_API_URL` and `BASE_MEDIA_URL` urls
  in the `.env` file of the project. Once you make these changes you must recompile the app using XCode or Android Studio.

**_ Note: If you are hosting the portal on your local machine and testing the app on a physical device then you must make that connection accesible to the device by using a local IP address aswell as [reversing any ports](https://blog.grio.com/2015 07/android-tip-adb-reverse.html) on Android _**

## 📱 Running app using simulator

- For Android: `npm run android`
- For iOS: `npm run ios`

If the above command fails or you would like to run the app on a physical device then you need to open the app in Xcode or Android Studio
for iOS or Android respectively. You can also refer to the React Native docs: https://reactnative.dev/docs/running-on-device

To open app in XCode (from terminal): `xed ./ios`
To open app in XCode:

- Open XCode
- File > Open > `{NAVIGATE TO FLARE REPO}/ios/FLARE.xcworkspace`

To open app in Android Studio:

- Open Android Studio
- File > Open > `{NAVIGATE TO FLARE REPO}/android`

When running the app on android you will need to reverse the port number 8081 so that the app can communicate with the debugger: `adb reverse tcp:8081 tcp:8081`

## 🔑 Authentication

To login and thefore start an experiment you will also need to have the [FLARe Portal](https://github.com/flare-kcl/flare-portal) running on port 8000. To avoid this you can also use the Participant ID `local.demo` to load the hardcoded example experiment.

## 🐍 Testing

We lean heavily on tests in this project to reduce unpredicatble logic and UI bugs. If you would like to contribute
to the codebase please continue to follow this methodology. Tests are written in [Jest](https://jestjs.io/) and
[RNTL](https://github.com/callstack/react-native-testing-library). An example snapshot test can be seen here:
[Text Component Test](https://github.com/flare-kcl/flare-app/tree/main/src/components/__tests__/Text.test.tsx)

## 📝 Notes

- [Expo TypeScript guide](https://docs.expo.io/versions/latest/guides/typescript/)
- [React Native docs](https://reactnative.dev/docs/getting-started)
- [React Navigation docs](https://reactnavigation.org/docs/getting-started)
- [Redux Toolkit docs](https://redux-toolkit.js.org/)
