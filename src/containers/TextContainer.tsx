import { ExperimentModule } from './ExperimentContainer'
import { TextScreen } from '@screens'

export type TextModuleState = {
  heading: string
  body: string
}

export const TextContainer: ExperimentModule<TextModuleState> = ({
  module: mod,
  onModuleComplete,
}) => {
  return (
    <TextScreen
      heading={mod.heading}
      description={mod.body}
      onNext={() => onModuleComplete()}
    />
  )
}
