import { useEffect } from 'react'
import { useNetInfo } from '@react-native-community/netinfo'
import { LoadingScreen, RejectionScreen } from '@screens'
import { ReimbursementScreen } from '@screens/ReimbursementScreen'
import { PortalAPI } from '@utils/PortalAPI'
import { ExperimentModule } from './ExperimentContainer'

export type ReimbursmentModuleState = {
  body?: string
  voucherCode?: string
  errorOccured?: boolean
}

export const ReimbursmentContainer: ExperimentModule<ReimbursmentModuleState> = ({ experiment, module: mod, updateExperiment, updateModule, onModuleComplete }) => {
  const netInfo = useNetInfo()

  useEffect(() => {
    if (netInfo.isInternetReachable) {
      // Setting 'breakEndDate' to null will cause infinite break period
      updateExperiment({
        breakEndDate: null
      })

      // Request voucher code from Portal API
      if (mod.voucherCode === undefined) {
        PortalAPI
          .getVoucherCode(experiment.participantID)
          .then(response => {
            if (response.voucher) {
              updateModule({
                body: response.body,
                voucherCode: response.voucher,
                errorOccured: false
              })
            }

            if (response.error_code) {
              updateModule({
                errorOccured: true
              })
            }
          })
          .catch(() => updateModule({
            errorOccured: true
          }))
      }
    }
  }, [ netInfo.isInternetReachable ])

  return (
    <>
      {mod.errorOccured !== true && mod.voucherCode && (
        // If we have valid voucher response
        <ReimbursementScreen body={mod.body} code={mod.voucherCode} onExit={() => onModuleComplete()} />
      )}

      {mod.errorOccured !== true && mod.voucherCode === undefined && (
        // If no response yet
        <LoadingScreen networkError={!netInfo.isInternetReachable} />
      )}

      {mod.errorOccured === true && (
        // If we enountered an error...
        <RejectionScreen
          heading='Thank you for being a participant in our study!'
          reason='VOUCHER_ERROR'
          contactLink={experiment.contactEmail}
        />
      )}
    </>
  )
}
