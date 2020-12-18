import { ExperimentModule } from './ExperimentContainer'
import { ExternalLinkScreen, TextInstructionScreen } from '@screens'

type ExternalLinkModuleState = {
  url: string
  heading: string
  description: string
  appendParticipantId: boolean
  autoCloseUrl?: string
  introShown?: boolean
}

export const ExternalLinkContainer: ExperimentModule<ExternalLinkModuleState> = ({
  module: mod,
  experiment,
  updateModule,
  onModuleComplete,
}) => {
  const getFormattedURL = () => {
    if (mod.appendParticipantId) {
      // Parse the URL
      const url = new URL(mod.url)
      // Add search param
      url.searchParams.set('participantID', experiment.participantID)
      return url.toString()
    }

    return mod.url
  }

  return !mod.introShown ? (
    <TextInstructionScreen
      heading={mod.heading}
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
      link={getFormattedURL()}
      title={mod.heading}
      closeDetectionMatch={mod.autoCloseUrl}
      onNext={onModuleComplete}
    />
  )
}
