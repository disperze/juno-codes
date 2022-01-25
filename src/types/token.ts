export interface TokenResponse {
  tokens: Token[]
  tokens_aggregate: TokensAggregate
}

export interface Token {
  name: string
  supply: string
  symbol: string
  contract: Contract
}

export interface Contract {
  address: string
  creator: string
  tx: number
}

export interface TokensAggregate {
  aggregate: Aggregate
}

export interface Aggregate {
  count: number
}
