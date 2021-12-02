export interface AbstractContract {
    readonly count: number;
    readonly sum: Sum;
}

export interface Sum {
    readonly gas: number;
    readonly fees: number;
    readonly tx: number;
}
