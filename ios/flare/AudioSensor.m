#import <React/RCTBridgeModule.h>
#import "AudioSensor-Bridging-Header.h"

@interface RCT_EXTERN_MODULE(AudioSensor, NSObject)

// Expose volume method
RCT_EXTERN_METHOD(
  getCurrentVolume: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

// Expose headphones method
RCT_EXTERN_METHOD(
  isHeadphonesConnected: (RCTPromiseResolveBlock)resolve
  rejecter: (RCTPromiseRejectBlock)reject
)

@end
