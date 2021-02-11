import Config from 'react-native-config'
import * as Sentry from '@sentry/react-native'

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

  static async reportValidationError(rawResponse: Response) {
    // Decode response to JSON, and if not encodeable text
    let response = null
    try {
      response = await rawResponse.json()
      // Check if there is a duplication object issue
      if (
        Object.keys(response).length == 1 &&
        response['non_field_errors'] !== undefined
      ) {
        console.warn('Duplicate object exists')
        return
      }
    } catch {
      response = await rawResponse.text()
    }

    // Report issue via Sentry
    const errMessage = 'Portal API sync validation issue'
    Sentry.captureMessage(errMessage, {
      contexts: {
        response,
      },
    })

    // Raise error to stop module sync flag being incorrect
    throw new Error(errMessage)
  }

  static async submitProgress(trackingSubmission: PortalTrackingSubmission) {
    // Convert object to string
    const jsonData = JSON.stringify(trackingSubmission)
    const response = await PortalAPI.executeAPIRequest('tracking', jsonData)

    // If validation error
    if (response.status === 400) {
      PortalAPI.reportValidationError(response)
    }
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
      PortalAPI.reportValidationError(response)
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
      PortalAPI.reportValidationError(response)
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
      PortalAPI.reportValidationError(response)
    }
  }

  static async submitTermsAgree(participantID: string) {
    const jsonData = JSON.stringify({ participant: participantID })
    const response = await PortalAPI.executeAPIRequest(
      'terms-and-conditions',
      jsonData,
    )

    // If validation error
    if (response.status === 400) {
      PortalAPI.reportValidationError(response)
    }
  }

  static async submitAffectiveRating(submission: AffectiveRatingSubmission) {
    // Convert object to string
    const jsonData = JSON.stringify(submission)
    const response = await PortalAPI.executeAPIRequest(
      'affective-rating-data',
      jsonData,
    )

    // If validation error
    if (response.status === 400) {
      PortalAPI.reportValidationError(response)
    }
  }

  static async submitCalibratedVolume(submission: CalibratedVolumeSubmission) {
    // Convert object to string
    const jsonData = JSON.stringify(submission)
    const response = await PortalAPI.executeAPIRequest(
      'volume-calibration-data',
      jsonData,
    )

    // If validation error
    if (response.status === 400) {
      console.error('Calbrated volume could not be processed.')
    }
  }

  static async submitContingencyAwareness(
    submission: ContingencyAwarenessSubmission,
  ) {
    // Convert object to string
    const jsonData = JSON.stringify(submission)
    const response = await PortalAPI.executeAPIRequest(
      'contingency-awareness-data',
      jsonData,
    )

    // If validation error
    if (response.status === 400) {
      console.error('Contingency awareness data could not be processed.')
    }
  }

  static async submitUSUnpleasantness(submission: USUnpleasantnessSubmission) {
    // Convert object to string
    const jsonData = JSON.stringify(submission)
    const response = await PortalAPI.executeAPIRequest(
      'us-unpleasantness-data',
      jsonData,
    )

    // If validation error
    if (response.status === 400) {
      console.error('US rating could not be processed.')
    }
  }

  static async submitExperimentEnd(participantID: string) {
    // Convert object to string
    const jsonData = JSON.stringify({ participant: participantID })
    const response = await PortalAPI.executeAPIRequest('submission', jsonData)

    // If validation error
    if (response.status === 400) {
      PortalAPI.reportValidationError(response)
    }
  }

  static async submitPostExperimentQuestions(
    submission: PostExperimentQuestionSubmission,
  ) {
    // Convert object to string
    const jsonData = JSON.stringify(submission)
    const response = await PortalAPI.executeAPIRequest(
      'post-experiment-questions-data',
      jsonData,
    )

    // If validation error
    if (response.status === 400) {
      PortalAPI.reportValidationError(response)
    }
  }

  static async getVoucherCode(participantID: string): Promise<VoucherResponse> {
    // Convert object to string
    const jsonData = JSON.stringify({ participant: participantID })
    const response = await PortalAPI.executeAPIRequest('vouchers', jsonData)

    // If validation error
    if (response.status === 400) {
      return Promise.reject()
    }

    return await response.json()
  }
}

type PortalTrackingSubmission = {
  module: string
  participant: string
  trial_index: number | undefined
  rejection_reason: string | undefined
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

type AffectiveRatingSubmission = {
  participant: string
  module: string
  rating: number
  stimulus: string
}

type CalibratedVolumeSubmission = {
  participant: string
  module: string
  rating: number
  calibrated_volume_level: number
}

type ContingencyAwarenessSubmission = {
  participant: string
  module: string
  awareness_answer: boolean
  confirmation_answer: string
  is_aware: boolean
}

type USUnpleasantnessSubmission = {
  participant: string
  module: string
  rating: number
}

type PostExperimentQuestionSubmission = {
  participant: string
  module: string
  experiment_unpleasant_rating?: number
  did_follow_instructions?: boolean
  did_remove_headphones?: boolean
  headphones_removal_reason?: string
  did_pay_attention?: boolean
  task_environment?: boolean
  was_alone?: boolean
  was_interrupted?: boolean
}

type VoucherResponse = {
  status: string
  voucher?: string
  error_code?: string
  error_message?: string
  success_message?: string
}
