import { ArmsLengthBody } from '../api/types'

export interface armsLengthBodyApi {

    getArmsLengthBodies(): Promise <ArmsLengthBody[]>
    updateArmsLengthBody(data:any): Promise<ArmsLengthBody[]>
   
}