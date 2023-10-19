# Testing on device

Testing on device gives the most accurate representation of how the app will
function once its in user's hands. There are some things that just don't work on
the simulator.

A bit of setup work is required to get this going.

**Connecting the app to your local FLARe Portal server**

You need to point the app to your local dev server so that it connects to that
instead of staging or production. To do this, edit the `.env` file and make sure
to set both `BASE_API_URL` and `BASE_MEDIA_URL` to match your computer's local
network IP address.

If you are using our default Docker setup to run the FLARe Portal server, the
server should already be accessible in your local network. To test, open up
Safari on your device and go to `http://<your-computer-ip>:8000`. If you see the
FLARe portal login screen, you know that your phone can successfully access
FLARe portal.

## Android

**Android Studio and adb**

Install Android Studio and make sure `adb` is in your `PATH`. Android Studio
installs it here:

```
/Users/<username>/Library/Android/sdk/platform-tools/adb
```

Plug in your Android device. Make sure USB Debugging is enabled.

To check that everything is hooked up correctly, run `adb devices`. You should
see your device appear on the list.

**Build and install the app**

Next, run `npm run android`. This will build and install the app on your phone.

You can only have one version of the app installed at a time. You cannot install
the dev build while you have the production version installed, so make sure
FLARe production is not installed on your device.

## iOS

**Ensure you're using the most up-to-date software**

Make sure that you are using an Xcode version that is compatible with your
iPhone's iOS version. See [Minimum requirements and supported
SDKs](https://developer.apple.com/support/xcode/) to see if the version of Xcode
you're using is compatible with your iOS version. If it isn't, update to the
latest version of Xcode using the macOS App Store and/or update your iPhone to
the latest iOS version.

**Get your device ready for testing**

1. Open up Xcode and go to Window > Devices and Simulators.
2. Plug in your iPhone to your computer.

You should see a message saying "Preparing device for development". Once your
device is ready, there should be no more warning messages on this window.

If you run into issues, here are some things to check:

- Ensure your Xcode version and iOS version are compatible, as above.
- Restart your iPhone and computer. (This actually helps sometimes.)
- Try a different lightning cable/port.

**Update signing configuration**

The app needs to be signed to run on a real device (even in development).

1. Open the `FLARe.xcworkspace` in Xcode
2. In the Project Navigator, select "FLARe"
3. Under Targets select FLARe
4. Under Signing & Capabilities, click "Debug"
5. Make sure Automatically manage signing is checked
6. For Team, select the team you want to use. If you are in the FLARe project
   team, select "Your Name (Personal Team)".
7. You also need to update the bundle identifier so that it doesn't clash with
   the original bundle identifier. e.g. `yourname.uk.ac.kcl.ioppn.flare`

At this point, you should not see any errors inside the "iOS" box on the Signing
& Capabilities tab.

**Build and install the app**

You're now ready to build and install the app on your iPhone. On the status bar,
make sure FLARe > <Device name> points to your device name. Click the "Start
the active scheme" button (looks like a play button).

The app is now installed on your iPhone and connected to your local development
server. You will need to re-do these steps whenever you run `expo prebuild --clean`
as this will reset the iOS project to its default settings.

Happy testing.
