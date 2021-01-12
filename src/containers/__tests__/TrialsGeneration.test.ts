import { generateTrials } from '@containers/FearConditioningContainer'
import { exampleExperimentData } from '@utils/exampleExperiment'

test('Trials generated correctly', () => {
  const testTrials = (trialsPerStimulus, reinforcementRate) => {
    // Generate a set of trials, CSA is always CS+
    const trials = generateTrials(
      trialsPerStimulus,
      reinforcementRate,
      exampleExperimentData.conditionalStimuli['cs+'],
      exampleExperimentData.conditionalStimuli['cs-'],
      exampleExperimentData.generalisationStimuli,
    )

    // Check generated expected number of trials
    const computedLength =
      trialsPerStimulus *
      (2 + exampleExperimentData.generalisationStimuli.length)
    expect(trials.length).toEqual(computedLength)

    // Check stimuli are split evenly
    const csaTrials = trials.filter((trial) => trial.label == 'csa')
    const csbTrials = trials.filter((trial) => trial.label == 'csb')
    const gsaTrials = trials.filter((trial) => trial.label.startsWith('gsa'))
    const gsbTrials = trials.filter((trial) => trial.label.startsWith('gsb'))
    const gscTrials = trials.filter((trial) => trial.label.startsWith('gsc'))
    const gsdTrials = trials.filter((trial) => trial.label.startsWith('gsd'))
    expect(csaTrials.length).toEqual(trialsPerStimulus)
    expect(csbTrials.length).toEqual(trialsPerStimulus)
    expect(gsaTrials.length).toEqual(trialsPerStimulus)
    expect(gsbTrials.length).toEqual(trialsPerStimulus)
    expect(gscTrials.length).toEqual(trialsPerStimulus)
    expect(gsdTrials.length).toEqual(trialsPerStimulus)

    // Check correct amount of trials reinforced
    const reinforcedTrials = csaTrials.filter((trial) => trial.reinforced)
    const invalidTrials = csbTrials.filter((trial) => trial.reinforced)
    expect(reinforcedTrials.length).toEqual(reinforcementRate)
    expect(invalidTrials.length).toEqual(0)
  }

  // Test trials generation for a range of values
  testTrials(10, 4)
  testTrials(1, 0)
  testTrials(1, 1)
  testTrials(2, 1)
  testTrials(3, 3)
})
