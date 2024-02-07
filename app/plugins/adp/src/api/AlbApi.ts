import { ArmsLengthBody } from '../../../adp-common/src/types'

export interface armsLengthBodyApi {

    getArmsLengthBodies(): Promise <ArmsLengthBody[]>
    updateArmsLengthBody(data:any): Promise<ArmsLengthBody[]>
   
}