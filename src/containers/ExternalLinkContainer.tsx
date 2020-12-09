import { ExperimentModule } from './ExperimentContainer'
import { ExternalLinkScreen, TextInstructionScreen } from '@screens'

type ExternalLinkModuleState = {
  link: string
  title: string
  description: string
  closeDetectionMatch?: string
  introShown?: boolean
}

export const ExternalLinkContainer: ExperimentModule<ExternalLinkModuleState> = ({
  module: mod,
  updateModule,
  onModuleComplete,
}) => {
  return !mod.introShown ? (
    <TextInstructionScreen
      heading={mod.title}
      description={mod.description}
      color="tealLight"
      backgroundColor="purple"
      textColor="white"
      linkColor="purple"
      textAlign="left"
      onNext={() => {
        updateModule({
          introShown: true,
        })
      }}
    />
  ) : (
    <ExternalLinkScreen
      link={mod.link}
      title={mod.title}
      closeDetectionMatch={mod.closeDetectionMatch}
      onNext={onModuleComplete}
    />
  )
}
