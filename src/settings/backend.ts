import { GasPrice } from "@cosmjs/stargate";

export type NonEmptyArray<ElementType> = { readonly 0: ElementType } & readonly ElementType[];

export interface BackendSettings {
  readonly nodeUrls: NonEmptyArray<string>;
  readonly denominations: readonly string[];
  readonly addressPrefix: string;
  readonly gasPrice: GasPrice;
  readonly keplrChainInfo?: any;
  readonly contractsUrl?: string;
}

const devnetStargateSettings: BackendSettings = {
  nodeUrls: ["http://localhost:26659"],
  denominations: ["ucosm", "ustake"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const musselnetSettings: BackendSettings = {
  nodeUrls: ["https://rpc.musselnet.cosmwasm.com"],
  denominations: ["umayo", "ufrites"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const pebblenetSettings: BackendSettings = {
  nodeUrls: ["https://rpc.pebblenet.cosmwasm.com"],
  denominations: ["upebble"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
  keplrChainInfo: {
    rpc: "https://rpc.pebblenet.cosmwasm.com",
    rest: "https://lcd.pebblenet.cosmwasm.com",
    chainId: "pebblenet-1",
    chainName: "Wasm Pebblenet",
    stakeCurrency: {
      coinDenom: "PEBBLE",
      coinMinimalDenom: "upebble",
      coinDecimals: 6,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "wasm",
      bech32PrefixAccPub: "wasmpub",
      bech32PrefixValAddr: "wasmvaloper",
      bech32PrefixValPub: "wasmvaloperpub",
      bech32PrefixConsAddr: "wasmvalcons",
      bech32PrefixConsPub: "wasmvalconspub",
    },
    currencies: [
      {
        coinDenom: "PEBBLE",
        coinMinimalDenom: "upebble",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "PEBBLE",
        coinMinimalDenom: "upebble",
        coinDecimals: 6,
      },
    ],
    features: ["stargate", "ibc-transfer", "cosmwasm"],
    explorerUrlToTx: "https://block-explorer.pebblenet.cosmwasm.com/transactions/{txHash}",
  },
};

const uniSettings: BackendSettings = {
  nodeUrls: ["https://rpc.juno.giansalex.dev"],
  denominations: ["ujunox"],
  addressPrefix: "juno",
  gasPrice: GasPrice.fromString("0.025ujunox"),
  keplrChainInfo: {
    rpc: "https://rpc.juno.giansalex.dev:443",
    rest: "https://lcd.juno.giansalex.dev:443",
    chainId: "uni-1",
    chainName: "Juno Testnet",
    stakeCurrency: {
      coinDenom: "JUNOX",
      coinMinimalDenom: "ujunox",
      coinDecimals: 6,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "juno",
      bech32PrefixAccPub: "junopub",
      bech32PrefixValAddr: "junovaloper",
      bech32PrefixValPub: "junovaloperpub",
      bech32PrefixConsAddr: "junovalcons",
      bech32PrefixConsPub: "junovalconspub",
    },
    currencies: [
      {
        coinDenom: "JUNOX",
        coinMinimalDenom: "ujunox",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "JUNOX",
        coinMinimalDenom: "ujunox",
        coinDecimals: 6,
      },
    ],
    features: ["stargate", "ibc-transfer", "cosmwasm", "no-legacy-stdTx", "ibc-go"],
    explorerUrlToTx: "https://uni.junoscan.com/transactions/{txHash}",

  },
  contractsUrl: "http://165.232.154.150:8081/api/rest/v2.0/contracts"
};

const juno1Settings: BackendSettings = {
  nodeUrls: ["https://rpc-juno.itastakers.com"],
  denominations: ["ujuno"],
  addressPrefix: "juno",
  gasPrice: GasPrice.fromString("0.025ujuno"),
  keplrChainInfo: {
    rpc: "https://rpc-juno.itastakers.com:443",
    rest: "https://lcd-juno.itastakers.com:443",
    chainId: "juno-1",
    chainName: "Juno",
    stakeCurrency: {
      coinDenom: "JUNO",
      coinMinimalDenom: "ujuno",
      coinDecimals: 6,
    },
    bip44: {
      coinType: 118,
    },
    bech32Config: {
      bech32PrefixAccAddr: "juno",
      bech32PrefixAccPub: "junopub",
      bech32PrefixValAddr: "junovaloper",
      bech32PrefixValPub: "junovaloperpub",
      bech32PrefixConsAddr: "junovalcons",
      bech32PrefixConsPub: "junovalconspub",
    },
    currencies: [
      {
        coinDenom: "JUNO",
        coinMinimalDenom: "ujuno",
        coinDecimals: 6,
      },
    ],
    feeCurrencies: [
      {
        coinDenom: "JUNO",
        coinMinimalDenom: "ujuno",
        coinDecimals: 6,
      },
    ],
    features: ["stargate", "ibc-transfer", "cosmwasm", "no-legacy-stdTx", "ibc-go"],
    explorerUrlToTx: "https://mintscan.io/juno/txs/{txHash}",

  },
  contractsUrl: "https://graph.juno.giansalex.dev/api/rest/page"
};

const knownBackends: Partial<Record<string, BackendSettings>> = {
  devnetStargate: devnetStargateSettings,
  musselnet: musselnetSettings,
  pebblenet: pebblenetSettings,
  uninet: uniSettings,
  juno1: juno1Settings,
};

export function getCurrentBackend(): BackendSettings {
  const id = process.env.REACT_APP_BACKEND || "uninet";
  const backend = knownBackends[id];
  if (!backend) {
    throw new Error(`No backend found for the given ID "${id}"`);
  }
  return backend;
}
