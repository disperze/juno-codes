
export interface Contract {
    readonly address: string;
    readonly code_id: number;
    readonly fees: number;
    readonly gas: number;
    readonly label: string;
    readonly creator: string;
    readonly tx: number;
    readonly creation_time: string;
    readonly height: number;
}

