import { ArmsLengthBody } from './types'

export interface armsLengthBodyApi {

    getArmsLengthBodies(): Promise <ArmsLengthBody[]>
    updateArmsLengthBody(data:any): Promise<ArmsLengthBody[]>
   
}