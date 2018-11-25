const { Kayn, REGIONS } = require('kayn')
import { KaynConfig } from 'kayn';

const kaynConfig: KaynConfig = {
    region: REGIONS.BRAZIL,
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 3000,
    }
}

export const kayn = Kayn('RGAPI-4bb19c2c-207d-4b54-9a34-1eb5e2a395dd')(kaynConfig)
