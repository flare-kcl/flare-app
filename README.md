# FLARe Native App

### What is FLARe?

FLARe is a native mobile app that allows researchers to deliver fear conditioning tasks to participants and review the
experiment data in a custom built web portal.

## 💻 Setup development enviroment

- Clone the project: `git clone https://github.com/flare-kcl/flare-app`
- Install NPM deps: `npm i`
- Check native dependencies: `npx @react-native-community/cli doctor`
- Install CocoaPods for iOS build: `cd ios && pod install`

## 📱 Running app using simulator

- For Android: `npm run android`
- For iOS: `npm run ios`

## Authentication

To login and thefore start an experiment you will also need to have the [FLARe Portal running](https://github.com/flare-kcl/flare-portal). To avoid this you can also use the Participant ID `local.demo` to load the hardcoded example experiment.

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
