describe('Test Asset Cache', () => {
  const navigateToScreen = async () => {
    await element(by.id('Tests.TestCacheScreen')).tap()
    await expect(element(by.id('TestCacheScreen'))).toBeVisible()
  }

  it('Screen is visible', async () => {
    const navigateButton = element(by.id('Tests.TestCacheScreen'))
    // Test if button exists
    await expect(navigateButton).toBeVisible()
    // Navigate to screen
    await navigateToScreen()
  })

  it('Cache Works', async () => {
    // Check image hasn't loaded
    await expect(element(by.id('ImageLoadIndicator'))).not.toBeVisible()

    // Click download button
    await element(by.id('DownloadButton')).tap()

    // Check if image has loaded succesfully from cache
    await waitFor(element(by.id('ImageLoadIndicator')))
      .toBeVisible()
      .withTimeout(6000)

    // Reload the app and check again
    await device.reloadReactNative()
    await navigateToScreen()
    await expect(element(by.id('ImageLoadIndicator'))).toBeVisible()

    // Click clear button
    await element(by.id('ClearButton')).tap()

    // Check if image has been deleted
    await expect(element(by.id('ImageLoadIndicator'))).not.toBeVisible()

    // Reload the app and check again that it has been deleted
    await device.reloadReactNative()
    await navigateToScreen()
    await expect(element(by.id('ImageLoadIndicator'))).not.toBeVisible()
  })
})
