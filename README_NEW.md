# FLARe app

## What is FLARe?

FLARe is a native mobile app that allows researchers to deliver fear conditioning tasks to participants and review the experiment data in a custom built web portal.

## Prerequisites

- A macOS development machine with Xcode and Android Studio
- Experience with React applications
- Familiarity with TypeScript
- An iPhone and/or an Android device

## Concepts

This is a React Native project that uses the Expo SDK in Continuous Native
Generation mode.

- React Native is a library that allows developers to build native mobile apps
  using React.
- Expo SDK is an ecosystem around React Native that provides tooling to make
  developing apps with React Native easier.
- Continuous Native Generation is the React Native workflow being used by this
  project.

A React Native application generally has three parts; the JavaScript code, the
iOS build, and the Android build. The JavaScript code typically contains the
bulk of the application code and is the meat and potatoes of the app. However,
it is sometimes necessary to "go down" to the native level (Java/Kotlin for
Android, Objective-C/Swift for iOS) when particular native functionality is
required, such as detecting when headphones are plugged-in.

In the past, this project included native code for iOS and Android to do just
that. It meant having to maintain three codebases; the React JavaScript app, the
iOS app, and the Android app.

Fortunately, those days are over. Now, the FLARe app follows a "managed" Expo
workflow. This means the iOS and Android builds are entirely managed by the
tooling, requiring no manual maintenance. iOS and Android code is still
generated and will be viewable in your local working directory, but editing
these files directly is not required/allowed.

All this means is that contributors only need to be concerned about the React
application. The tooling is responsible for dealing with the complexities of
native app builds and distribution.

## 💻 Setup development environment

- Ensure you have Xcode and Android Studio installed
- Ensure the iOS Simulator and Android Emulator are functional
- Clone the project: `git clone https://github.com/flare-kcl/flare-app`
- Install NPM dependencies `npm install`
- Generate the native code: `npx expo prebuild --clean`
- Start the Expo server: `npm run start`

## Connecting App to portal

The app fetches experiments and submits participant test data to a paired FLARe
Portal service.

The app can connect to any FLARe portal hosted on an accessible domain. This can
be done by changing the `BASE_API_URL` and `BASE_MEDIA_URL` urls in the `.env`
file of the project. Once you make these changes you must re-run `npm run ios/android` to rebuild and reinstall the app on your simulator/test device.

Note: If you are hosting the portal on your local machine and testing the app
on a physical device then you must make that connection accesible to the device
by using a local IP address aswell as [reversing any ports](https://blog.grio.com/2015 07/android-tip-adb-reverse.html) on Android

Note: It is also possible to test the app without connecting the app to a FLARe
portal. This can be done by using the `local.demo` Participant ID. This will
launch a local test experiment.

## 💻 Running app using a simulator

### iOS

You will need to have Xcode installed and a working simulator. You know you're
ready when you can launch the Simulator app and interact with a simulated
iPhone.

- Ensure the Expo build server is running: `npm run start`
- Build the iOS app: `npm run ios`

### Android

You will need to have Android Studio installed and a working emulator. You know
you're ready when you can launch and interact with an emulated Android Device.

- Ensure the Expo build server is running: `npm run start`
- Build the Android app: `npm run android`

## 📱 Running app using a real device

### iOS

TBA

### Android

TBA

## 🐍 Testing

We lean heavily on tests in this project to reduce unpredictable logic and UI
bugs. If you would like to contribute to the codebase please continue to follow
this methodology. Tests are written in [Jest](https://jestjs.io/) and
[RNTL](https://github.com/callstack/react-native-testing-library). An example snapshot test can be seen here: [Text Component Test](https://github.com/flare-kcl/flare-app/tree/main/src/components/__tests__/Text.test.tsx)

## Troubleshooting

**Working on an Apple Silicon Mac**

Make sure CocoaPods is installed with Homebrew:

```
sudo gem uninstall cocoapods
brew install cocoapods
```

This is to ensure that CocoaPods is installed with the compatible architecture.

**Blank/green screen**

The audio file might be failing to load. Run `sudo pkill -9 coreaudiod` and
restart the simulator.

**Xcode build failing on an Apple Silicon Mac**

Check that node is accessible at `/usr/local/bin/node`. For some reason, Xcode
looks for node there specifically. Ensure it's the same version you're using to
run `npm run` commands.

## 📝 Notes

- [Expo TypeScript guide](https://docs.expo.io/versions/latest/guides/typescript/)
- [React Native docs](https://reactnative.dev/docs/getting-started)
- [React Navigation docs](https://reactnavigation.org/docs/getting-started)
- [Redux Toolkit docs](https://redux-toolkit.js.org/)
