import * as React from 'react';

import { AudioSensorViewProps } from './AudioSensor.types';

export default function AudioSensorView(props: AudioSensorViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
