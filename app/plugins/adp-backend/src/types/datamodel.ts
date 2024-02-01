export type ArmsLengthBody = {
    id: string;
    timestamp: Date;
    creator: string;
    owner: string;
    name: string;
    short_name?: string;
    description: string;
    url?: string;
    readonly title: string
}
