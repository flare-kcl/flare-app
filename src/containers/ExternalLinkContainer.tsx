import { ExperimentModule } from './ExperimentContainer'
import { ExternalLinkScreen, TextInstructionScreen } from '@screens'
import { ScrollView } from '@components'

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
      return mod.url + experiment.participantID
    }

    return mod.url
  }

  return !mod.introShown ? (
    <ScrollView backgroundColor="purple">
      <TextInstructionScreen
        heading={mod.heading}
        description={mod.description}
        backgroundColor="purple"
        color="tealLight"
        textColor="white"
        linkColor="purple"
        textAlign="left"
        onNext={() => {
          updateModule({
            introShown: true,
          })
        }}
      />
    </ScrollView>
  ) : (
    <ExternalLinkScreen
      link={getFormattedURL()}
      title={mod.heading}
      closeDetectionMatch={mod.autoCloseUrl}
      onNext={onModuleComplete}
    />
  )
}
