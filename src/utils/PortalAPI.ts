import Config from 'react-native-config'

export class PortalAPI {
  private static async executeAPIRequest(
    endpointExtension: string,
    body: string,
  ) {
    return await fetch(`${Config.BASE_API_URL}/${endpointExtension}/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': Config.API_AUTH_TOKEN,
      },
      body: body,
    })
  }

  static async submitTrialRating(ratingResponse: PortalTrialRatingSubmission) {
    // Convert object to string
    const jsonData = JSON.stringify(ratingResponse)
    const response = await PortalAPI.executeAPIRequest(
      'fear-conditioning-data',
      jsonData,
    )

    // If validation error
    if (response.status === 400) {
      console.warn('Trial submission could not be processed.')
    }
  }

  static async submitBasicInfo(basicInfoResponse: PortalBasicInfoSubmission) {
    // Convert object to string
    const jsonData = JSON.stringify(basicInfoResponse)
    const response = await PortalAPI.executeAPIRequest(
      'basic-info-data',
      jsonData,
    )

    // If validation error
    if (response.status === 400) {
      console.log(await response.json())
      console.warn('Could not upload basic info data')
    }
  }

  static async submitCriterionAnswer(
    criterionAnswer: PortalCriterionSubmission,
  ) {
    // Convert object to string
    const jsonData = JSON.stringify(criterionAnswer)
    const response = await PortalAPI.executeAPIRequest(
      'criterion-data',
      jsonData,
    )

    // If validation error
    if (response.status === 400) {
      console.warn('Criterion answer could not be processed.')
    }
  }
}

type PortalTrialRatingSubmission = {
  module: string
  participant: string
  trial: number
  rating: number
  conditional_stimulus: string
  unconditional_stimulus: boolean
  trial_started_at: string
  response_recorded_at: string
  volume_level: string
  calibrated_volume_level: string
  headphones: boolean
}

type PortalBasicInfoSubmission = {
  participant: string
  module: string
  date_of_birth: string
  gender: string
  headphone_type: string
  headphone_make: string
  headphone_model: string
  headphone_label: string
  device_make: string
  device_model: string
  os_name: string
  os_version: string
}

type PortalCriterionSubmission = {
  participant: string
  module: string
  question: number
  answer: boolean
}
