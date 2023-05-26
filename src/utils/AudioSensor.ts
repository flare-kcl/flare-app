// Exposed class used by application code
export default class AudioSensor {
  private static currentVolume: number
  private static headphoneConnected: boolean

  static async getCurrentVolume(): Promise<number> {
    return await new Promise((resolve, reject) => {
      resolve(0.5)
    })
  }

  static async isHeadphonesConnected(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(false)
    })
    // return await Sensor.isHeadphonesConnected()
  }

  static async focus(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true)
    })
  }

  static addVolumeListener(cb: (volume: number) => void) {
    return false
  }

  static addHeadphonesListener(cb: (connected: boolean) => void) {
    return false
  }
}
