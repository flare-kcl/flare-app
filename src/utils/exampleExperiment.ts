import { Experiment } from '../containers/ExperimentContainer'

export const exampleTermsDefinition = {
  terms: undefined,
}

export const exampleCriteriaDefinition = {
  introText: `# What is this experiment?`,
  outroText: `### Ready to continue? \n Please make sure all of the above criteria are answered correctly. This is essential to the integreity of the your data.`,
  questions: [
    {
      id: 8798,
      questionText: `1. Do you have a pre-existing heart condition?`,
      helpText: `This question is required and must be 'No'.`,
      correctAnswer: false,
      required: true,
    },
    {
      id: 4511,
      questionText: `2. Do you suffer from PTSD?`,
      helpText: `This question is not required and any response is valid.`,
      correctAnswer: null,
      required: false,
    },
    {
      id: 9813,
      questionText: `3. Do you have a diagnosed anxiety condtion?`,
      helpText: `This question is not required but a 'Yes' response screens out the user.`,
      correctAnswer: false,
      required: false,
    },
  ],
}

// Example data that mocks what portal will return
export const exampleExperimentData: Experiment = {
  id: 0,
  name: 'Example Experiment',
  description: `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in dui quis odio volutpat pulvinar eu id eros. In ut ipsum ac ipsum varius scelerisque.
    Pellentesque nec neque vel odio tempor aliquam. Aliquam rutrum vestibulum ligula, eget viverra mauris porta id.
    In elit est, aliquet et aliquet eu, blandit vitae erat. Curabitur finibus dapibus tellus, et scelerisque sem dictum quis.
    Praesent pellentesque rutrum libero, a ultrices ante molestie id. Etiam semper hendrerit feugiat.
  `,
  contactEmail: 'mailto:flare@email.com',
  ratingDelay: 2000,
  trialLength: 8000,
  ratingScaleAnchorLabelLeft: 'Certain no scream',
  ratingScaleAnchorLabelCenter: 'Uncertain',
  ratingScaleAnchorLabelRight: 'Certain scream',
  minimumVolume: 0.5,
  intervalTimeBounds: {
    min: 1,
    max: 3,
  },
  reimbursements: false,
  unconditionalStimulus: require('../assets/sounds/ding.wav'),
  contextStimuli: {
    A: require('../assets/images/example-context.png'),
  },
  conditionalStimuli: {
    'cs+': { label: 'csa', image: require('../assets/images/CSA.png') },
    'cs-': { label: 'csb', image: require('../assets/images/CSB.png') },
  },
  generalisationStimuli: [
    { label: 'gsa', image: require('../assets/images/GSA.png') },
    { label: 'gsb', image: require('../assets/images/GSB.png') },
    { label: 'gsc', image: require('../assets/images/GSC.png') },
    { label: 'gsd', image: require('../assets/images/GSD.png') },
  ],
  modules: [
    {
      id: '451651',
      moduleType: 'BASIC_INFO',
      definition: {
        collectDateOfBirth: true,
        collectGender: true,
        collectHeadphoneMake: true,
        collectHeadphoneModel: true,
        collectHeadphoneLabel: true,
      },
    },
    {
      id: '387484',
      moduleType: 'INSTRUCTIONS',
      definition: {
        includeVolumeCalibration: false,
        endScreenTitle: 'Time to start the experiment.',
        endScreenBody: "Press 'Next' to start the experiment.",
        screens: [
          {
            title: 'Check your surroundings',
            body:
              'Before you begin the experiment, make sure you are alone, in a quiet room, where you will not be disturbed.',
            actionLabel: "Please select 'next' to confirm.",
          },
          {
            title: 'Check your phone battery',
            body:
              'Make sure your device is fully charged, or is plugged in, and you have enough time to complete the whole experiment.',
            actionLabel: "Please select 'next' to confirm.",
          },
          {
            title: 'Check your Wifi',
            body:
              'Make sure you are connected to the internet using wifi and you have airplane mode turned on (you may need to turn wifi on after you have selected airplane mode).\r\n\r\nIgnore any messages, calls, or notifications you may receive during this time.',
            actionLabel: "Please select 'next' to confirm.",
          },
        ],
      },
    },
    {
      id: '87979',
      moduleType: 'TASK_INSTRUCTIONS',
      definition: {
        // Screen 1
        introHeading: 'Practice Time',
        introBody:
          'Before you begin the experiment, we need to practice using the rating interface.',
        // Screen 2
        ratingExplanationHeading:
          'A few seconds after each circle appears, this scale will appear at the bottom of the screen.',
        ratingExplanationBody:
          'Each time the scale appears, press the corresponding number on the screen to rate how much you expect to hear a scream.',
        // Screen 3
        ratingPracticeHeading:
          'Press any number to practice making a rating with the scale below.',
        // Screen 4
        intervalExplanationBody:
          'Before each circle is presented, you will see a white screen with a cross in the middle like the one shown above. It is important that you keep looking at the cross and wait for the next circle to appear.',
        // Screen 5
        outroHeading: 'Instructions Complete',
        outroBody: `The experiment will now begin.\n\nYou may occasionally hear a scream.\n\nRemember to rate how much you expect to hear a scream by pressing a number every time the scale appears.`,
      },
    },
    {
      id: '548944',
      moduleType: 'CRITERION',
      definition: exampleCriteriaDefinition,
    },
    {
      id: '56516',
      moduleType: 'AFFECTIVE_RATING',
      definition: {
        question: 'Have you seen this circle before?',
        ratingScaleAnchorLabelLeft: 'Definitely never seen it before',
        ratingScaleAnchorLabelCenter: 'Not sure',
        ratingScaleAnchorLabelRight: 'Definitely seen it before',
        generalisationStimuliEnabled: true,
      },
    },
    {
      id: '848948',
      moduleType: 'FEAR_CONDITIONING',
      definition: {
        phase: 'acquisition',
        trialsPerStimulus: 3,
        reinforcementRate: 3,
        context: 'A',
      },
    },
    {
      id: '213265',
      moduleType: 'CONTINGENCY_AWARENESS',
      definition: {
        awarenessQuestion:
          'Did you happen to notice whether you heard the scream after seeing a certain circle?',
        confirmationQuestion: 'Which circle did you associate with the scream?',
      },
    },
    {
      id: '34684',
      moduleType: 'BREAK_START',
      definition: {
        startTitle: 'Break Time',
        startBody:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dictum massa blandit nisi auctor placerat. Suspendisse fermentum enim non hendrerit elementum. In condimentum pharetra imperdiet. Fusce auctor eros eu finibus aliquam. Donec vel tortor tempus, condimentum augue ornare, molestie tortor.',
        duration: 60,
        endModule: 234,
      },
    },
    {
      id: '564651',
      moduleType: 'WEB',
      definition: {
        heading: 'FLARe Questionnaire',
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in dui quis odio volutpat pulvinar eu id eros. In ut ipsum ac ipsum varius scelerisque. Pellentesque nec neque vel odio tempor aliquam. Aliquam rutrum vestibulum ligula, eget viverra mauris porta id.`,
        url: 'https://google.com',
      },
    },
    {
      id: '34687',
      moduleType: 'BREAK_END',
      definition: {
        startModule: 123,
        endTitle: 'End of Break',
        endBody:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum dictum massa blandit nisi auctor placerat. Suspendisse fermentum enim non hendrerit elementum. In condimentum pharetra imperdiet. Fusce auctor eros eu finibus aliquam. Donec vel tortor tempus, condimentum augue ornare, molestie tortor.',
      },
    },
    {
      id: '346618',
      moduleType: 'US_UNPLESENTNESS',
      definition: {
        question: 'How unpleasant did you find the scream?',
      },
    },
    {
      id: '346612',
      moduleType: 'POST_EXPERIMENT_QUESTIONS',
      definition: {
        heading: 'Review Questions',
        questions: {
          experimentUnpleasantRating: true,
          didFollowInstructions: true,
          didRemoveHeadphones: true,
          didPayAttention: true,
          taskEnvironment: true,
          wasQuiet: true,
          wasAlone: true,
          wasInterrupted: true,
        },
      },
    },
  ],
}
