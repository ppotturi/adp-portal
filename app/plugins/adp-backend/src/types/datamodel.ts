export type ArmsLengthBody = {
    creator_username: string;
    creator_email: string;
    owner_username: string;
    owner_email: string;
    creator_same_as_owner: boolean;
    name: string;
    short_name?: string;
    description?: string;
    id: string;
    timestamp: number;
}
