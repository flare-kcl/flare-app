import { VolumeManager } from 'react-native-volume-manager'
import DeviceInfo from 'react-native-device-info'
import { NativeEventEmitter, NativeModules } from 'react-native'

const deviceInfoEmitter = new NativeEventEmitter(NativeModules.RNDeviceInfo)

// Exposed class used by application code
export default class AudioSensor {
  private static currentVolume: number
  private static headphoneConnected: boolean

  static async getCurrentVolume(): Promise<number> {
    return await VolumeManager.getVolume().then(({ volume }) => {
      return volume
    })
  }

  static async isHeadphonesConnected(): Promise<boolean> {
    return DeviceInfo.isHeadphonesConnected()
  }

  static async focus(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }

  static addVolumeListener(cb: (volume: number) => void) {
    return VolumeManager.addVolumeListener((result) => {
      cb(result.volume)
    })
  }

  static addHeadphonesListener(cb: (connected: boolean) => void) {
    return deviceInfoEmitter.addListener(
      'RNDeviceInfo_headphoneConnectionDidChange',
      (result) => {
        cb(result)
      },
    )
  }
}
