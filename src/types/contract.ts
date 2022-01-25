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
    code:          ContractCodeElement;
}

export interface ContractCodeElement {
  ibc: boolean;
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

