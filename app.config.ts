import withRemoveiOSNotificationEntitlement from './config-plugins/withRemoveiOSNotificationEntitlement.ts'

module.exports = ({ config }) => ({
  ...config,
  plugins: [...(config.plugins ?? []), [withRemoveiOSNotificationEntitlement]],
})
