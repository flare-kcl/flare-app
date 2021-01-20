import { Platform } from 'react-native'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import PushNotification from 'react-native-push-notification'
import { store } from '@redux/store'

export type NotificationType =
  | 'BREAK_OVER'
  | 'BREAK_OVER_APPROACHING'
  | 'SYNC_REQUIRED'

export const registerNotifications = () => {
  PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },

    onRegistrationError: function (err) {
      console.error(err.message, err)
    },

    // Should the initial notification be popped automatically
    popInitialNotification: true,
    requestPermissions: false,
  })

  // Create the channel for Android
  PushNotification.createChannel(
    {
      channelId: 'flare',
      channelName: 'FLARe Research',
      channelDescription: 'A channel to categorise your notifications',
      playSound: true,
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    () => null,
  )
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  // We don't need to ask on Android
  if (Platform.OS == 'android') {
    return Promise.resolve(true)
  }

  try {
    const permissions = await PushNotification.requestPermissions()
    if (permissions.alert === true) {
      return Promise.resolve(true)
    }
  } catch {}

  // Call revoke so we can call this method again
  PushNotification.abandonPermissions()

  return Promise.resolve(false)
}

export const cancelAllNotifications = (type?: NotificationType) => {
  PushNotification.getScheduledLocalNotifications((notifications) => {
    // Filter notifications to find ones matching type
    // We can't match by type so we use title instead
    let matchingNotifications =
      type !== undefined
        ? notifications.filter(
            (n) => n.title === notificationContent[type].title,
          )
        : notifications

    // Delete each matching notifications
    matchingNotifications.map((n) =>
      PushNotification.cancelLocalNotifications({
        id: n.id,
      }),
    )
  })
}

const notificationContent = {
  BREAK_OVER: {
    title: 'Your experiment break is over.',
    message:
      'Please return to the same place you completed the first part of the experiment',
  },
  BREAK_OVER_APPROACHING: {
    title: 'Your experiment break is nearly over.',
    message:
      '2 Hours until your break is over. Please make sure you will be able to to return to the same place that you completed the first part of the experiment when the break is over.',
  },
  SYNC_REQUIRED: {
    title: 'You haven’t submitted your experiment data.',
    message: 'Please click this notification to submit your experiment data.',
  },
}

export const scheduleNotification = (
  notificationType: NotificationType,
  date: Date,
) => {
  if (store.getState().experiment.notificationsEnabled) {
    PushNotification.localNotificationSchedule({
      date,
      ...notificationContent[notificationType],
      allowWhileIdle: true,
      ignoreInForeground: true,
      channelId: 'flare',
    })
  }
}
