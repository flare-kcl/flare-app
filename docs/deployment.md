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

CI takes care of the rest.
