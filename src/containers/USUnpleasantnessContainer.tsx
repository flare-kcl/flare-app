import { ExperimentModule } from './ExperimentContainer'
import { RatingScreen } from '@screens'

export type USUnpleasantnessModuleDefinition = {
  question: string
}

export type USUnpleasantnessModuleState = USUnpleasantnessModuleDefinition & {
  rating: number
}

export const USUnpleasantnessContainer: ExperimentModule<USUnpleasantnessModuleState> = ({
  module: mod,
  updateModule,
  onModuleComplete,
}) => {
  return (
    <RatingScreen
      heading={mod.question}
      value={mod.rating}
      anchorLabels={{
        anchorLabelLeft: 'Not unpleasent at all',
        anchorLabelCenter: '',
        anchorLabelRight: 'Very Unpleasent',
      }}
      onChange={(rating) => updateModule({ rating })}
      onNext={() => onModuleComplete()}
    />
  )
}
