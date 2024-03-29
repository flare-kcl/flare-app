import isEqual from 'lodash/isEqual'
import * as Sentry from '@sentry/react-native'

import Config from '@utils/Config'

// Handled errors
const EXPERIMENT_FINISHED = {
  participant: 'This participant has already finished the experiment',
}

const TRIAL_ALREADY_SUBMITTED = {
  non_field_errors: [
    'The fields trial, module, participant must make a unique set.',
  ],
}

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

  static async reportValidationError(submissionData, rawResponse: Response) {
    // Decode response to JSON, and if not encodeable text
    let responseData = null
    try {
      responseData = await rawResponse.json()

      if (isEqual(responseData, EXPERIMENT_FINISHED)) {
        console.warn('Participant already submitted')
        return
      }

      if (isEqual(responseData, TRIAL_ALREADY_SUBMITTED)) {
        console.warn('Trial already submitted')
        return
      }
    } catch {
      responseData = await rawResponse.text()
    }

    // Report issue via Sentry
    const errMessage = 'Portal API sync validation issue'
    Sentry.captureMessage(errMessage, {
      contexts: {
        request: {
          url: rawResponse.url,
        },
        response: responseData,
        submissionData,
      },
    })

    // Raise error to stop module sync flag being incorrect
    console.error(JSON.stringify(responseData))
    throw new Error(responseData)
  }

  static async submitProgress(trackingSubmission: PortalTrackingSubmission) {
    // Convert object to string
    const jsonData = JSON.stringify(trackingSubmission)
    const response = await PortalAPI.executeAPIRequest('tracking', jsonData)

    // If validation error
    if (response.status === 400) {
      PortalAPI.reportValidationError(jsonData, response)
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
      PortalAPI.reportValidationError(jsonData, response)
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
      PortalAPI.reportValidationError(jsonData, response)
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
      PortalAPI.reportValidationError(jsonData, response)
    }
  }

  static async submitTermsAgree(submission: PortalTermsSubmission) {
    const jsonData = JSON.stringify(submission)
    const response = await PortalAPI.executeAPIRequest(
      'terms-and-conditions',
      jsonData,
    )

    // If validation error
    if (response.status === 400) {
      PortalAPI.reportValidationError(jsonData, response)
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
      PortalAPI.reportValidationError(jsonData, response)
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
      PortalAPI.reportValidationError(jsonData, response)
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
      PortalAPI.reportValidationError(jsonData, response)
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
      PortalAPI.reportValidationError(jsonData, response)
    }
  }

  static async submitExperimentEnd(participantID: string) {
    // Convert object to string
    const jsonData = JSON.stringify({ participant: participantID })
    const response = await PortalAPI.executeAPIRequest('submission', jsonData)

    // If validation error
    if (response.status === 400) {
      PortalAPI.reportValidationError(jsonData, response)
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
      PortalAPI.reportValidationError(jsonData, response)
    }
  }

  static async getVoucherCode(participantID: string): Promise<VoucherResponse> {
    // Convert object to string
    const jsonData = JSON.stringify({ participant: participantID })
    const response = await PortalAPI.executeAPIRequest('vouchers', jsonData)

    // If validation error
    if (response.status === 400) {
      PortalAPI.reportValidationError(jsonData, response)
    }

    return await response.json()
  }
}

type PortalTermsSubmission = {
  participant: string
  agreed: boolean
}

type PortalTrackingSubmission = {
  module: number | undefined
  participant: string
  trial_index: number | undefined
  lock_reason: string | undefined
}

type PortalTrialRatingSubmission = {
  module: number
  participant: string
  trial: number
  trial_by_stimulus: number
  rating: number
  stimulus: string
  normalised_stimulus: string
  reinforced_stimulus: string
  unconditional_stimulus: boolean
  trial_started_at: string
  response_recorded_at: string
  volume_level: string
  calibrated_volume_level: string
  headphones: boolean
  did_leave_iti: boolean
  did_leave_trial: boolean
}

type PortalBasicInfoSubmission = {
  participant: string
  module: number
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
  module: number
  question: number
  answer: boolean
}

type AffectiveRatingSubmission = {
  participant: string
  module: number
  rating: number
  stimulus: string
  normalised_stimulus: string
}

type CalibratedVolumeSubmission = {
  participant: string
  module: number
  rating: number
  calibrated_volume_level: number
}

type ContingencyAwarenessSubmission = {
  participant: string
  module: number
  awareness_answer: boolean
  confirmation_answer: string
  is_aware: boolean
}

type USUnpleasantnessSubmission = {
  participant: string
  module: number
  rating: number
}

type PostExperimentQuestionSubmission = {
  participant: string
  module: number
  experiment_unpleasant_rating?: number
  did_follow_instructions?: boolean
  did_remove_headphones?: boolean
  headphones_removal_point?: string
  did_pay_attention?: boolean
  task_environment?: boolean
  was_quiet?: boolean
  was_not_alone?: boolean
  was_interrupted?: boolean
}

type VoucherResponse = {
  status: string
  voucher?: string
  error_code?: string
  error_message?: string
  success_message?: string
}
