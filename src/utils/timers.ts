export class PauseableTimer {
  timer = null
  callback: () => void
  timeRemaining: number
  lastUpdated: number

  constructor(callback: () => void, delay: number) {
    // Create new timer
    this.callback = callback
    this.timeRemaining = delay
    this.resume()
  }

  pause() {
    if (this.timer != null) {
      clearTimeout(this.timer)
      this.timer = null
      this.timeRemaining = this.timeRemaining - (Date.now() - this.lastUpdated)
      this.lastUpdated = Date.now()
    }
  }

  resume() {
    if (this.timeRemaining >= 0 && this.timer === null) {
      this.timer = setTimeout(this.callback, this.timeRemaining)
      this.lastUpdated = Date.now()
    }
  }

  destroy() {
    clearTimeout(this.timer)
    this.timer = null
    this.timeRemaining = -1
  }
}
