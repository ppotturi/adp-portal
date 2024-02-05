export type ArmsLengthBody = {
    id: string;
    timestamp: Date;
    creator: string;
    owner: string;
    name: string;
    short_name?: string;
    description: string;
    readonly title?: string;
}