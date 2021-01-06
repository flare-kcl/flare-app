import {
  NativeEventEmitter,
  NativeModules,
  EmitterSubscription,
} from 'react-native'

// Connection to native code
const AudioSensorModule = NativeModules.AudioSensor

// Event source for any changes
const AudioSensorEmitter = new NativeEventEmitter(AudioSensorModule)

// Exposed class used by application code
export default class AudioSensor {
  private static currentVolume: number
  private static headphoneConnected: boolean

  static async getCurrentVolume(): Promise<number> {
    return Promise.resolve(1.0)
    return await AudioSensorModule.getCurrentVolume()
  }

  static async isHeadphonesConnected(): Promise<boolean> {
    return Promise.resolve(true)
    return await AudioSensorModule.isHeadphonesConnected()
  }

  static async focus(): Promise<boolean> {
    return await AudioSensorModule.focus()
  }

  static addVolumeListener(cb: (volume: number) => void): EmitterSubscription {
    return AudioSensorEmitter.addListener('VolumeChange', (volume) => {
      if (volume !== this.currentVolume) {
        cb(volume)

        // Update internal state
        this.currentVolume = volume
      }
    })
  }

  static addHeadphonesListener(
    cb: (connected: boolean) => void,
  ): EmitterSubscription {
    return AudioSensorEmitter.addListener('OutputChange', (connected) => {
      if (connected !== this.headphoneConnected) {
        cb(connected)

        // Update internal state
        this.headphoneConnected = connected
      }
    })
  }
}
