
// export interface Contract {
//     readonly address: string;
//     readonly code_id: number;
//     readonly fees: number;
//     readonly gas: number;
//     readonly label: string;
//     readonly creator: string;
//     readonly tx: number;
//     readonly creation_time: string;
//     readonly height: number;
// }

export interface Contract {
    contracts:           ContractElement[];
    contracts_aggregate: ContractsAggregate;
}

export interface ContractElement {
    address:       string;
    code_id:       number;
    fees:          number;
    gas:           number;
    label:         string;
    creator:       string;
    tx:            number;
    creation_time: string;
    height:        number;
    ibc:           boolean;
}

export interface ContractsAggregate {
    aggregate: Aggregate;
}

export interface Aggregate {
    count: number;
    sum:   Sum;
}

export interface Sum {
    gas:  number;
    fees: number;
    tx:   number;
}

