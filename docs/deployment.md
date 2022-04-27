# Deployment

Deployment is completely handled by GitHub actions.

## Deploying test builds

When you merge to the `develop` branch, CI will automatically:

1. Bump the version code of the app (e.g. "177" -> "178") for both iOS and Android
1. Build the iOS and Android apps
1. Upload and publish them on Google Play and App Store for internal testing

That is all you need to do to deploy test builds.

## Deploying production builds

To deploy to production:

- Steps unclear :)
