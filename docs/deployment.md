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

# Deployment internals

The following section describes what happens in CI during a deployment.

## 1. Bump version

The human-readable version and the version code (android)/build number (ios) is
updated. The human-readable version can be the same for many distinct builds,
but every build must have its own version code/build number.

An example of a human-readable version is "1.5.0". An example of a version
code/build number is "190".

## 2. Update environment variables

The contents of the `.env` file is updated. This file is used on build to set
constants such as the URL of the backend server, API token, Sentry DTN, etc. in
the native application.

## 3. Install credentials

Credentials required for signing and uploading to the respective app stores are
installed.

For iOS, this uses a combination of GitHub secrets and fastlane match.

For Android, the credentials are stored in GitHub secrets.

## 4. Build and sign

The native apps are built and signed. The build process is managed through
fastlane.

## 5. Publishing

The resulting builds are uploaded to their respective app stores. This is
managed through fastlane as well.

## 5. Git housekeeping

- A new release is added on GitHub
- Version numbers are committed to the repo
