export interface CodesResponse {
  codes: Code[]
  codes_aggregate: CodesAggregate
}

export interface Code {
  code_id: number
  creation_time: string
  creator: string
  hash: string
  size: number
  verified: boolean
  version?: string
  contracts_aggregate: ContractsAggregate
}

export interface ContractsAggregate {
  aggregate: Aggregate
}

export interface Aggregate {
  count: number
}

export interface CodesAggregate {
  aggregate: Aggregate2
}

export interface Aggregate2 {
  count: number
}
