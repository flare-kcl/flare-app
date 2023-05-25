import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { AudioSensorViewProps } from './AudioSensor.types';

const NativeView: React.ComponentType<AudioSensorViewProps> =
  requireNativeViewManager('AudioSensor');

export default function AudioSensorView(props: AudioSensorViewProps) {
  return <NativeView {...props} />;
}
