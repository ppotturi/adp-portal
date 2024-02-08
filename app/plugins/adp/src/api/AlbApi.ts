import { ArmsLengthBody } from '@internal/plugin-adp-common'

export interface armsLengthBodyApi {

    getArmsLengthBodies(): Promise <ArmsLengthBody[]>
    updateArmsLengthBody(data:any): Promise<ArmsLengthBody[]>
   
}