# Deployment

Deployment is completely handled by GitHub actions.

## Deploying test builds

Deploying test builds is fully automated. When you merge to the `develop`
branch, CI will automatically:

1. Bump the version code of the app (e.g. `177` -> `178`) for both iOS and Android
1. Build the iOS and Android apps
1. Upload and publish them on Google Play and App Store for internal testing

That is all you need to do to deploy test builds.

## Deploying production builds

Deploying to production requires some extra steps:

1. On `develop`, update `Changelog.txt` with the changelog text to use for this
   release. Commit your changes.
1. Merge `develop` to `main`
1. Tag the latest commit on `main` with a version number (e.g. `v1.4.0`)
1. Push the `main` branch

CI takes care of building and pushing it out to Google Play and App Store.

## Next version

Once a version has been released to production, you can no longer push test builds with the same version (e.g. 1.4.0). You must prepare a new version the next time you want to publish a new test release.

1. Make sure `develop` is up to date with `main`. `git checkout develop && git merge main`
1. Bump the iOS version using fastlane. `cd ios && fastlane ios bump version:1.5.0`
1. Bump the Android version using fastlane. `cd android && fastlane android bump version:1.5.0`
1. Commit your changes to develop or your feature branch.
