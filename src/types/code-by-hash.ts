export interface CodeByHashRespone {
  codes: Code[]
}

export interface Code {
  code_id: number
  version?: string
  contracts_aggregate: ContractsAggregate
}

export interface ContractsAggregate {
  aggregate: Aggregate
}

export interface Aggregate {
  count: number
}
