import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to AudioSensor.web.ts
// and on native platforms to AudioSensor.ts
import AudioSensorModule from './src/AudioSensorModule';
import AudioSensorView from './src/AudioSensorView';
import { ChangeEventPayload, AudioSensorViewProps } from './src/AudioSensor.types';

// Get the native constant value.
export const PI = AudioSensorModule.PI;

export function hello(): string {
  return AudioSensorModule.hello();
}

export async function setValueAsync(value: string) {
  return await AudioSensorModule.setValueAsync(value);
}

const emitter = new EventEmitter(AudioSensorModule ?? NativeModulesProxy.AudioSensor);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}

export { AudioSensorView, AudioSensorViewProps, ChangeEventPayload };
