import { GasPrice } from "@cosmjs/stargate";

export type NonEmptyArray<ElementType> = { readonly 0: ElementType } & readonly ElementType[];

export interface BackendSettings {
  readonly nodeUrls: NonEmptyArray<string>;
  readonly denominations: readonly string[];
  readonly addressPrefix: string;
  readonly gasPrice: GasPrice;
  readonly keplrChainInfo?: any;
  readonly cosmostationInfo?: any;
  readonly contractsUrl?: string;
}

const devnetStargateSettings: BackendSettings = {
  nodeUrls: ["http://localhost:26659"],
  denominations: ["ucosm", "ustake"],
  addressPrefix: "wasm",
  gasPrice: GasPrice.fromString("0.25ucosm"),
};

const uniSettings: BackendSettings = {
  nodeUrls: ["https://rpc.juno.giansalex.dev"],
  denominations: ["ujunox"],
  addressPrefix: "juno",
  gasPrice: GasPrice.fromString("0.025ujunox"),
  keplrChainInfo: {
    rpc: "https://rpc.juno.giansalex.dev:443",
    rest: "https://lcd.juno.giansalex.dev:443",
    chainId: "uni-3",
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
    features: ["ibc-transfer", "cosmwasm", "ibc-go"],
    explorerUrlToTx: "https://uni.junoscan.com/transactions/{txHash}",

  },
  cosmostationInfo: {
    chainId: "uni-3",
    chainName: "juno-uni",
    addressPrefix: "juno",
    baseDenom: "ujunox",
    displayDenom: "JUNOX",
    restURL: "https://api-office.cosmostation.io/uni-3",
    coinType: "118",
    decimals: 6,
    gasRate: {
      average: "0.05",
      low: "0.025",
      tiny: "0.025",
    },
  },
  contractsUrl: "https://graph.juno.giansalex.dev/api/rest/v2.0/"
};

const juno1Settings: BackendSettings = {
  nodeUrls: ["https://rpc-juno.itastakers.com"],
  denominations: ["ujuno"],
  addressPrefix: "juno",
  gasPrice: GasPrice.fromString("0.0025ujuno"),
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
  contractsUrl: ""
};

const knownBackends: Partial<Record<string, BackendSettings>> = {
  devnetStargate: devnetStargateSettings,
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
