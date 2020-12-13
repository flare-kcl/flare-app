import { Experiment } from '../containers/ExperimentContainer'

// Example Terms and Conditions, Well be swapped out eventually!
const exampleTerms = `
# Terms & Conditions

Welcome to [Some Link](http://www.lorem-ipsum.info). This site is provided as a service to our visitors and may be used for informational purposes only. Because the Terms and Conditions contain legal obligations, please read them carefully.

1. YOUR AGREEMENT
By using this Site, you agree to be bound by, and to comply with, these Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use this site.
PLEASE NOTE: We reserve the right, at our sole discretion, to change, modify or otherwise alter these Terms and Conditions at any time. Unless otherwise indicated, amendments will become effective immediately. Please review these Terms and Conditions periodically. Your continued use of the Site following the posting of changes and/or modifications will constitute your acceptance of the revised Terms and Conditions and the reasonableness of these standards for notice of changes. For your information, this page was last updated as of the date at the top of these terms and conditions.

2. PRIVACY
Please review our Privacy Policy, which also governs your visit to this Site, to understand our practices.

3. LINKED SITES
This Site may contain links to other independent third-party Web sites ("Linked Sites”). These Linked Sites are provided solely as a convenience to our visitors. Such Linked Sites are not under our control, and we are not responsible for and does not endorse the content of such Linked Sites, including any information or materials contained on such Linked Sites. You will need to make your own independent judgment regarding your interaction with these Linked Sites.

4. FORWARD LOOKING STATEMENTS
All materials reproduced on this site speak as of the original date of publication or filing. The fact that a document is available on this site does not mean that the information contained in such document has not been modified or superseded by events or by a subsequent document or filing. We have no duty or policy to update any information or statements contained on this site and, therefore, such information or statements should not be relied upon as being current as of the date you access this site.

5. DISCLAIMER OF WARRANTIES AND LIMITATION OF LIABILITY
A. THIS SITE MAY CONTAIN INACCURACIES AND TYPOGRAPHICAL ERRORS. WE DOES NOT WARRANT THE ACCURACY OR COMPLETENESS OF THE MATERIALS OR THE RELIABILITY OF ANY ADVICE, OPINION, STATEMENT OR OTHER INFORMATION DISPLAYED OR DISTRIBUTED THROUGH THE SITE. YOU EXPRESSLY UNDERSTAND AND AGREE THAT: (i) YOUR USE OF THE SITE, INCLUDING ANY RELIANCE ON ANY SUCH OPINION, ADVICE, STATEMENT, MEMORANDUM, OR INFORMATION CONTAINED HEREIN, SHALL BE AT YOUR SOLE RISK; (ii) THE SITE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS; (iii) EXCEPT AS EXPRESSLY PROVIDED HEREIN WE DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, WORKMANLIKE EFFORT, TITLE AND NON-INFRINGEMENT; (iv) WE MAKE NO WARRANTY WITH RESPECT TO THE RESULTS THAT MAY BE OBTAINED FROM THIS SITE, THE PRODUCTS OR SERVICES ADVERTISED OR OFFERED OR MERCHANTS INVOLVED; (v) ANY MATERIAL DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF THE SITE IS DONE AT YOUR OWN DISCRETION AND RISK; and (vi) YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR COMPUTER SYSTEM OR FOR ANY LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF ANY SUCH MATERIAL.

B. YOU UNDERSTAND AND AGREE THAT UNDER NO CIRCUMSTANCES, INCLUDING, BUT NOT LIMITED TO, NEGLIGENCE, SHALL WE BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, PUNITIVE OR CONSEQUENTIAL DAMAGES THAT RESULT FROM THE USE OF, OR THE INABILITY TO USE, ANY OF OUR SITES OR MATERIALS OR FUNCTIONS ON ANY SUCH SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. THE FOREGOING LIMITATIONS SHALL APPLY NOTWITHSTANDING ANY FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY.

6. EXCLUSIONS AND LIMITATIONS
SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, OUR LIABILITY IN SUCH JURISDICTION SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.

7. OUR PROPRIETARY RIGHTS
This Site and all its Contents are intended solely for personal, non-commercial use. Except as expressly provided, nothing within the Site shall be construed as conferring any license under our or any third party's intellectual property rights, whether by estoppel, implication, waiver, or otherwise. Without limiting the generality of the foregoing, you acknowledge and agree that all content available through and used to operate the Site and its services is protected by copyright, trademark, patent, or other proprietary rights. You agree not to: (a) modify, alter, or deface any of the trademarks, service marks, trade dress (collectively "Trademarks") or other intellectual property made available by us in connection with the Site; (b) hold yourself out as in any way sponsored by, affiliated with, or endorsed by us, or any of our affiliates or service providers; (c) use any of the Trademarks or other content accessible through the Site for any purpose other than the purpose for which we have made it available to you; (d) defame or disparage us, our Trademarks, or any aspect of the Site; and (e) adapt, translate, modify, decompile, disassemble, or reverse engineer the Site or any software or programs used in connection with it or its products and services.

The framing, mirroring, scraping or data mining of the Site or any of its content in any form and by any method is expressly prohibited.

8. INDEMNITY
By using the Site web sites you agree to indemnify us and affiliated entities (collectively "Indemnities") and hold them harmless from any and all claims and expenses, including (without limitation) attorney's fees, arising from your use of the Site web sites, your use of the Products and Services, or your submission of ideas and/or related materials to us or from any person's use of any ID, membership or password you maintain with any portion of the Site, regardless of whether such use is authorized by you.

9. COPYRIGHT AND TRADEMARK NOTICE
Except our generated dummy copy, which is free to use for private and commercial use, all other text is copyrighted. generator.lorem-ipsum.info © 2013, all rights reserved

10. INTELLECTUAL PROPERTY INFRINGEMENT CLAIMS
It is our policy to respond expeditiously to claims of intellectual property infringement. We will promptly process and investigate notices of alleged infringement and will take appropriate actions under the Digital Millennium Copyright Act ("DMCA") and other applicable intellectual property laws. Notices of claimed infringement should be directed to:

generator.lorem-ipsum.info
`

export const exampleTermsDefinition = {
  terms: exampleTerms,
}

export const exampleCriteriaDefinition = {
  description: `# What is this experiment? \n Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ac magna ut neque auctor varius et eu lectus. Proin eget fringilla lectus. Donec feugiat, turpis sed blandit lacinia, dolor nulla pretium quam, quis cursus neque lorem et ipsum. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus aliquam tortor at rhoncus condimentum. Maecenas gravida nibh et gravida pretium. Morbi quam nisl, tempor et auctor sit amet, convallis et dui. Duis luctus mollis dolor vitae rutrum. Cras dapibus congue neque sed sodales.`,
  criteria: [
    {
      name: 'heart-criteria',
      description: `### 1. Do you have a pre-existing heart condition?`,
      value: null,
      requiredValue: false,
    },
    {
      name: 'ptsd-criteria',
      description: `### 2. Do you suffer from PTSD?`,
      value: null,
      requiredValue: false,
    },
    {
      name: 'anxiety-criteria',
      description: `### 3. Do you have a diagnosed anxiety condtion?  \n Mauris ut urna nunc. Proin luctus, odio cursus ornare sodales, sapien metus ultrices nisl, at pulvinar dui ipsum et lacus. Cras sodales faucibus est vel volutpat. Pellentesque lacinia suscipit mi ut euismod. Donec ut viverra ante. Morbi bibendum vulputate neque vitae viverra. Mauris egestas vehicula tortor. Aenean ornare euismod massa, at cursus urna sodales nec.`,
      value: null,
    },
  ],
  continueMessage: `### Ready to continue? \n Please make sure all of the above criteria are answered correctly. This is essential to the integreity of the your data.
  `,
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
  intervalTimeBounds: {
    min: 500,
    max: 1500,
  },
  modules: [
    {
      id: '154654',
      moduleType: 'TERMS',
      definition: exampleTermsDefinition,
    },
    {
      id: '451651',
      moduleType: 'BASIC_INFO',
      definition: {
        genders: [
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
          { label: 'Other', value: 'other' },
        ],
      },
    },
    {
      id: '387484',
      moduleType: 'INSTRUCTIONS',
      definition: {
        renderIntroTask: true,
        renderTrialTask: true,
        advancedVolumeCalibration: true,
      },
    },
    {
      id: '548944',
      moduleType: 'CRITERIA',
      definition: exampleCriteriaDefinition,
    },
    {
      id: '848948',
      moduleType: 'FEAR_CONDITIONING',
      definition: {
        phase: 'acquisition',
        trialsPerStimulus: 3,
        reinforcementRate: 3,
        contextImage: require('../assets/images/example-context.jpg'),
        stimuli: [
          { label: 'CSA', image: require('../assets/images/small.png') },
          { label: 'CSB', image: require('../assets/images/large.png') },
        ],
      },
    },
    {
      id: '564651',
      moduleType: 'EXTERNAL_LINK',
      definition: {
        title: 'FLARe Questionnaire',
        description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc in dui quis odio volutpat pulvinar eu id eros. In ut ipsum ac ipsum varius scelerisque. Pellentesque nec neque vel odio tempor aliquam. Aliquam rutrum vestibulum ligula, eget viverra mauris porta id.`,
        link: 'https://kclbs.eu.qualtrics.com/jfe/form/SV_802kLj0WlUSVByd',
      },
    },
  ],
}
