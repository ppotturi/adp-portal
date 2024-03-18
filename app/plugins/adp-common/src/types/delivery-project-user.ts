import { DeliveryProject } from "./delivery-project";

export type DeliveryProjectUser = {
    id: string;
    delivery_project: DeliveryProject[];
    user: User;
    is_technical: boolean;
    is_manager: boolean;
    aad_entity_id: string;
    name: string;
    github_username: string;
}

export type User ={}