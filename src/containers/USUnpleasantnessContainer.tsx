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
        anchorLabelLeft: 'Not unpleasant at all',
        anchorLabelCenter: '',
        anchorLabelRight: 'Very unpleasant',
      }}
      onChange={(rating) => updateModule({ rating })}
      onNext={() => onModuleComplete()}
    />
  )
}
