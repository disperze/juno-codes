import "./ContractPage.css";

import { Contract, ContractCodeHistoryEntry } from "@cosmjs/cosmwasm-stargate";
import { toHex } from "@cosmjs/encoding";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { Registry, } from "@cosmjs/proto-signing";
import { Coin } from "@cosmjs/stargate";
import { IndexedTx } from "@cosmjs/stargate";
import { Coin as ICoin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Any } from "cosmjs-types/google/protobuf/any";
import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { CodeLink } from "../../components/CodeLink";
import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import { ClientContext } from "../../contexts/ClientContext";
import { settings } from "../../settings";
import { ellideMiddle, printableBalance } from "../../ui-utils";
import { StargateClient } from "../../ui-utils/clients";
import { makeTags } from "../../ui-utils/sdkhelpers";
import {
  ErrorState,
  errorState,
  isErrorState,
  isLoadingState,
  LoadingState,
  loadingState,
} from "../../ui-utils/states";
import { ExecuteContract } from "./ExecuteContract";
import { Execution, ExecutionsTable } from "./ExecutionsTable";
import { HistoryInfo } from "./HistoryInfo";
import { InitializationInfo } from "./InitializationInfo";
import { QueryContract } from "./QueryContract";
import { GetTxLogByIndex } from "../../ui-utils/txs";
import { MigrateContract } from "./MigrateContract";
import { UpdateContractAdmin } from "./UpdateContractAdmin";
import { ClearContractAdmin } from "./ClearContractAdmin";

type IAnyMsgExecuteContract = {
  readonly typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract";
  readonly value: Uint8Array;
};

export type Result<T> = { readonly result?: T; readonly error?: string };

function isStargateMsgExecuteContract(msg: Any): msg is IAnyMsgExecuteContract {
  return (msg.typeUrl === "/cosmwasm.wasm.v1.MsgExecuteContract"
  || msg.typeUrl === "/ibc.core.channel.v1.MsgRecvPacket"
  || msg.typeUrl === "/ibc.core.channel.v1.MsgTimeout") && !!msg.value;
}

const getAndSetDetails = (
  client: StargateClient,
  contractAddress: string,
  setDetails: (details: Contract | ErrorState | LoadingState) => void,
): void => {
  client
    .getContract(contractAddress)
    .then(setDetails)
    .catch(() => setDetails(errorState));
};

const getAndSetContractCodeHistory = (
  client: StargateClient,
  contractAddress: string,
  setContractCodeHistory: (contractCodeHistory: readonly ContractCodeHistoryEntry[]) => void,
): void => {
  client
    .getContractCodeHistory(contractAddress)
    .then(setContractCodeHistory)
    .catch((error) => {
      console.error(error);
    });
};

const getAndSetInstantiationTxHash = (
  client: StargateClient,
  contractAddress: string,
  setInstantiationTxHash: (instantiationTxHash: string | undefined | ErrorState | LoadingState) => void,
): void => {
  (client.searchTx({
    tags: makeTags(
      `message.module=wasm&instantiate._contract_address=${contractAddress}`,
    ),
  }) as Promise<ReadonlyArray<{ readonly hash: string }>>)
    .then((results) => {
      const first = results.find(() => true);
      setInstantiationTxHash(first?.hash);
    })
    .catch(() => setInstantiationTxHash(errorState));
};

function getExecutionFromStargateMsgExecuteContract(typeRegistry: Registry, tx: IndexedTx) {
  return (msg: Any, i: number) => {
    const decodedMsg = typeRegistry.decode({ typeUrl: msg.typeUrl, value: msg.value });
    const log = GetTxLogByIndex(tx.rawLog, i);

    return {
      key: `${tx.hash}_${i}`,
      height: tx.height,
      transactionId: tx.hash,
      msg: decodedMsg,
      log: log,
    };
  };
}

const stargateEffect = (
  tmClient: Tendermint34Client,
  client: StargateClient,
  contractAddress: string,
  typeRegistry: Registry,
  setBalance: (balance: readonly ICoin[] | ErrorState | LoadingState) => void,
  setContractCodeHistory: (contractCodeHistory: readonly ContractCodeHistoryEntry[]) => void,
  setDetails: (details: Contract | ErrorState | LoadingState) => void,
  setExecutions: (executions: readonly Execution[] | ErrorState | LoadingState) => void,
  setInstantiationTxHash: (instantiationTxHash: string | undefined | ErrorState | LoadingState) => void,
) => () => {
  getAndSetContractCodeHistory(client, contractAddress, setContractCodeHistory);
  getAndSetDetails(client, contractAddress, setDetails);
  getAndSetInstantiationTxHash(client, contractAddress, setInstantiationTxHash);

  Promise.all(settings.backend.denominations.map((denom) => client.getBalance(contractAddress, denom)))
    .then((balances) => {
      const filteredBalances = balances.filter((balance): balance is Coin => balance !== null);
      setBalance(filteredBalances);
    })
    .catch(() => setBalance(errorState));

    tmClient.txSearch({
      query: `wasm._contract_address='${contractAddress}'`,
      page: 1,
      per_page: 20,
      order_by: "desc",
      prove: true
    })
    .then((results) => {
      const txs = results.txs.map(tx => ({
          height: tx.height,
          hash: toHex(tx.hash).toUpperCase(),
          code: tx.result.code,
          rawLog: tx.result.log || "",
          tx: tx.tx,
          gasUsed: tx.result.gasUsed,
          gasWanted: tx.result.gasWanted,
      }));

      const out = txs.reduce((executions: readonly Execution[], tx: IndexedTx): readonly Execution[] => {
        const decodedTx = Tx.decode(tx.tx);
        const txExecutions = (decodedTx?.body?.messages ?? [])
          .filter(isStargateMsgExecuteContract)
          .map(getExecutionFromStargateMsgExecuteContract(typeRegistry, tx));
        return [...executions, ...txExecutions];
      }, []);
      setExecutions(out);
    })
    .catch(() => setExecutions(errorState));
};

export function ContractPage(): JSX.Element {
  const { client, typeRegistry, nodeUrl } = React.useContext(ClientContext);
  const { contractAddress: contractAddressParam } = useParams<{ readonly contractAddress: string }>();
  const contractAddress = contractAddressParam || "";

  const [details, setDetails] = React.useState<Contract | ErrorState | LoadingState>(loadingState);
  const [balance, setBalance] = React.useState<readonly ICoin[] | ErrorState | LoadingState>(loadingState);
  const [instantiationTxHash, setInstantiationTxHash] = React.useState<
    string | undefined | ErrorState | LoadingState
  >(loadingState);
  const [contractCodeHistory, setContractCodeHistory] = React.useState<readonly ContractCodeHistoryEntry[]>(
    [],
  );
  const [executions, setExecutions] = React.useState<readonly Execution[] | ErrorState | LoadingState>(
    loadingState,
  );
  const [tmClient, setTmclient] = useState<Tendermint34Client>();

  React.useEffect(() => {
    (async function updateContextValue() {
      if (!tmClient) {
        const rpc =  await Tendermint34Client.connect(nodeUrl);
        setTmclient(rpc);
      }
    })();
  }, [tmClient, nodeUrl]);

  React.useEffect(
    client !== null && tmClient
      ? stargateEffect(
          tmClient,
          client,
          contractAddress,
          typeRegistry,
          setBalance,
          setContractCodeHistory,
          setDetails,
          setExecutions,
          setInstantiationTxHash,
        )
      : () => {},
    [client, tmClient, contractAddress, typeRegistry],
  );

  const pageTitle = <span title={contractAddress}>Contract {ellideMiddle(contractAddress, 15)}</span>;

  return (
    <div className="page">
      <Header />
      <div className="container mt-3 contract-container">
        <div className="row white-row white-row-first">
          <div className="col">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/codes">Codes</Link>
                </li>
                <li className="breadcrumb-item">
                  {isLoadingState(details) ? (
                    <span>Loading …</span>
                  ) : isErrorState(details) ? (
                    <span>Error</span>
                  ) : (
                    <CodeLink codeId={details.codeId} />
                  )}
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  {pageTitle}
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row white-row">
          <div className="col-12 col-md-6">
            <h1>{pageTitle}</h1>
            <ul className="list-group list-group-horizontal mb-3">
              <li className="list-group-item" title="Bank tokens owned by this contract">
                Balance:{" "}
                {isLoadingState(balance)
                  ? "Loading …"
                  : isErrorState(balance)
                  ? "Error"
                  : printableBalance(balance)}
              </li>
            </ul>
          </div>
          <div className="col-12 col-md-6">
            {isLoadingState(details) ? (
              <p>Loading …</p>
            ) : isErrorState(details) ? (
              <p>An Error occurred when loading contract</p>
            ) : (
              <>
                <InitializationInfo contract={details} instantiationTxHash={instantiationTxHash} />
                <HistoryInfo contractCodeHistory={contractCodeHistory} />
                <div className="accordion" id="accordionContract">
                  <div className="card">
                    <div className="card-header" id="headingOne">
                      <h2 className="mb-0">
                        <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false" aria-controls="collapseOne">
                          Read Contract
                        </button>
                      </h2>
                    </div>

                    <div id="collapseOne" className="collapse" aria-labelledby="headingOne" data-parent="#accordionContract">
                      <div className="card-body">
                        <QueryContract contractAddress={contractAddress} />
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <div className="card-header" id="headingTwo">
                      <h2 className="mb-0">
                        <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                          Write Contract
                        </button>
                      </h2>
                    </div>

                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionContract">
                      <div className="card-body">
                        <ExecuteContract contractAddress={contractAddress} />
                      </div>
                    </div>
                  </div>
                  {!isLoadingState(details) && !isErrorState(details) && details.admin && (
                    <div className="card">
                      <div className="card-header" id="heading3">
                        <h2 className="mb-0">
                          <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse3" aria-expanded="false" aria-controls="collapse3">
                            Admin
                          </button>
                        </h2>
                      </div>

                      <div id="collapse3" className="collapse" aria-labelledby="heading3" data-parent="#accordionContract">
                        <div className="card-body">
                          <div className="accordion" id="accordionAdmin">
                            <div className="card">
                              <div className="card-header">
                                <h2 className="mb-0">
                                  <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseMigrate" aria-expanded="false" aria-controls="collapseMigrate">
                                    Migrate Contract
                                  </button>
                                </h2>
                              </div>

                              <div id="collapseMigrate" className="collapse" data-parent="#accordionAdmin">
                                <div className="card-body">
                                  <MigrateContract contractAddress={contractAddress} />
                                </div>
                              </div>
                            </div>
                            <div className="card">
                              <div className="card-header">
                                <h2 className="mb-0">
                                  <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseUpdateAdmin" aria-expanded="false" aria-controls="collapseUpdateAdmin">
                                    Update Admin
                                  </button>
                                </h2>
                              </div>

                              <div id="collapseUpdateAdmin" className="collapse" data-parent="#accordionAdmin">
                                <div className="card-body">
                                  <UpdateContractAdmin contractAddress={contractAddress} />
                                </div>
                              </div>
                            </div>
                            <div className="card">
                              <div className="card-header">
                                <h2 className="mb-0">
                                  <button className="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapseClearAdmin" aria-expanded="false" aria-controls="collapseClearAdmin">
                                    Clear Admin
                                  </button>
                                </h2>
                              </div>

                              <div id="collapseClearAdmin" className="collapse" data-parent="#accordionAdmin">
                                <div className="card-body">
                                  <ClearContractAdmin contractAddress={contractAddress} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="row white-row white-row-last">
          <div className="col">
            <h2>Executions</h2>
            {isLoadingState(executions) ? (
              <p>Loading …</p>
            ) : isErrorState(executions) ? (
              <p>An Error occurred when loading transactions</p>
            ) : executions.length !== 0 ? (
              <ExecutionsTable executions={executions} contract={contractAddress} />
            ) : (
              <p>Contract was not yet executed</p>
            )}
          </div>
        </div>

        <FooterRow />
      </div>
    </div>
  );
}
