//
//  AudioSensor.swift
//  flare
//
//  Created by Nathan Horrigan on 17/11/2020.
//

import AVFoundation

@objc(AudioSensor)
class AudioSensor: RCTEventEmitter {
  var hasListeners: Bool = false
  var volumeObservation: NSKeyValueObservation?
  let audioSession = AVAudioSession.sharedInstance()

  override init() {
    super.init()

    // Listen to volume/output changes
    do {
      // Tell OS that we want to focus on audio
      try self.audioSession.setActive(true)
      // Look for any changes in self.audioSession.outputVolume
      self.volumeObservation = self.audioSession.observe( \.outputVolume ) { (av, change) in
        if self.hasListeners && self.bridge != nil {
          // Send data to JS via EventEmitter
          self.sendEvent(withName: "VolumeChange", body: av.outputVolume)
        }
      }

      // Subscribe to audio route changes
      NotificationCenter.default.addObserver(self, selector: #selector(onAudioOutputChange), name: AVAudioSession.routeChangeNotification, object: nil)
    } catch {
      print(error)
    }
  }

  @objc func onAudioOutputChange() {
    if self.hasListeners && self.bridge != nil {
      // Send data to JS via EventEmitter
      self.sendEvent(withName: "OutputChange", body: self.isHeadphonesConnected())
    }
  }

  /// Get the current volume and return it (Exposed to JS using Promises)
  @objc func getCurrentVolume(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) -> Void  {
    resolve(self.audioSession.outputVolume)
  }

  /// Check if headphones are the primary audio output (Exposed to JS using Promises)
  @objc func isHeadphonesConnected(
    _ resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) -> Void  {
    resolve(self.isHeadphonesConnected())
  }

  /// Check if headphones are the primary audio output (Internal Only)
  private func isHeadphonesConnected() -> Bool {
    return self.audioSession.currentRoute.outputs[0].portType != .builtInSpeaker
  }

  /// All the event types that this module supports
  override func supportedEvents() -> [String]! {
    return ["onSessionConnect", "VolumeChange", "OutputChange"]
  }

  /// Detect if a listener has attached and we should send them events
  override func startObserving() {
    self.hasListeners = true
  }

  /// Detect if all listeners has dettached  and we stop sending any events
  override func stopObserving() {
    self.hasListeners = false
  }

  override static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
