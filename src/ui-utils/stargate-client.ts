import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";

export class CustomStargateClient extends CosmWasmClient {
  static connectWithTm(tmClient: Tendermint34Client): CustomStargateClient {
    return new CosmWasmClient(tmClient);
  }
}
