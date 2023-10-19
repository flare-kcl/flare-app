import { VolumeManager } from 'react-native-volume-manager'
import DeviceInfo from 'react-native-device-info'
import { NativeEventEmitter, NativeModules } from 'react-native'

const deviceInfoEmitter = new NativeEventEmitter(NativeModules.RNDeviceInfo)

/**
 * AudioSensor
 *
 * This class used to be a wrapper around our custom native AudioSensor module.
 *
 * The custom native module was removed in favor of using the react-native-volume-manager
 * and react-native-device-info modules.
 */
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

  /**
   * @deprecated
   *
   * This method used to ensure that AVAudioSession is active on iOS.
   *
   * It is unclear why this was needed, but now that the custom native module
   * is removed, this method is no longer needed.
   */
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
