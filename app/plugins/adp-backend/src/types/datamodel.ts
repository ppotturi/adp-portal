export type ArmsLengthBody = {
    creatorUsername: string;
    creatorEmail: string;
    ownerUsername: string;
    ownerEmail: string;
    creatorSameAsOwner: boolean;
    name: string;
    shortName?: string;
    description?: string;
    id: string;
    timestamp: number;
}
