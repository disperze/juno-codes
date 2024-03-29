import {
  MsgExecuteContract,
  MsgInstantiateContract,
  MsgStoreCode,
  MsgMigrateContract,
  MsgUpdateAdmin,
  MsgClearAdmin,
} from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { Registry } from "@cosmjs/proto-signing";
import React from "react";
import { Redirect, Route, Switch } from "react-router";

import { ClientContext, ClientContextValue } from "../contexts/ClientContext";
import { AccountPage } from "../pages/account/AccountPage";
import { CodePage } from "../pages/code/CodePage";
import { NewCodePage } from "../pages/code/NewCodePage";
import { ContractPage } from "../pages/contract/ContractPage";
import { TxPage } from "../pages/tx/TxPage";
import { settings } from "../settings";
import { StargateClient, StargateSigningClient } from "../ui-utils/clients";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
import { HttpBatchClient } from "@cosmjs/tendermint-rpc/build/rpcclients";
import {
  msgExecuteContractTypeUrl,
  msgInstantiateContractTypeUrl,
  msgStoreCodeTypeUrl,
  msgMigrateContractTypeUrl,
  msgMsgUpdateAdminTypeUrl,
  msgMsgClearAdminTypeUrl,
  msgAckTypeUrl,
  msgReceiveTypeUrl,
  msgTimeoutTypeUrl,
} from "../ui-utils/txs";
import { FlexibleRouter } from "./FlexibleRouter";
import { DashboardPage } from "../pages/contract/DashboardPage";
import { TokenPage } from "../pages/tokens/TokenPage";
import { CodeDashboardPage } from "../pages/codes/CodeDashboard";
import { CodesPage } from "../pages/codes/CodesPage";
import { MsgAcknowledgement, MsgRecvPacket, MsgTimeout } from "cosmjs-types/ibc/core/channel/v1/tx";
import { ToolsPage } from "../pages/contract/ToolsPage";

const { nodeUrls, contractsUrl } = settings.backend;
const typeRegistry = new Registry([
  [msgStoreCodeTypeUrl, MsgStoreCode],
  [msgInstantiateContractTypeUrl, MsgInstantiateContract],
  [msgExecuteContractTypeUrl, MsgExecuteContract],
  [msgMigrateContractTypeUrl, MsgMigrateContract],
  [msgMsgUpdateAdminTypeUrl, MsgUpdateAdmin],
  [msgMsgClearAdminTypeUrl, MsgClearAdmin],
  [msgAckTypeUrl, MsgAcknowledgement],
  [msgReceiveTypeUrl, MsgRecvPacket],
  [msgTimeoutTypeUrl, MsgTimeout],
]);

export function App(): JSX.Element {
  const rndUrl = Math.floor(Math.random()*nodeUrls.length)
  const [nodeUrl, setNodeUrl] = React.useState(nodeUrls[rndUrl]);
  const [userAddress, setUserAddress] = React.useState<string>();
  const [signingClient, setSigningClient] = React.useState<StargateSigningClient>();
  const [contextValue, setContextValue] = React.useState<ClientContextValue>({
    nodeUrl: nodeUrl,
    client: null,
    typeRegistry: typeRegistry,
    resetClient: setNodeUrl,
    userAddress: userAddress,
    setUserAddress: setUserAddress,
    signingClient: signingClient,
    setSigningClient: setSigningClient,
  });

  React.useEffect(() => {
    (async function updateContextValue() {
      const tmClient =  await Tendermint34Client.create(new HttpBatchClient(nodeUrl, {
        batchSizeLimit: 20,
        dispatchInterval: 50,
      }));
      const client = StargateClient.connectWithTm(tmClient);
      setContextValue((prevContextValue) => ({ ...prevContextValue, nodeUrl: nodeUrl, client: client }));
    })();
  }, [nodeUrl]);

  React.useEffect(() => {
    setContextValue((prevContextValue) => ({ ...prevContextValue, signingClient: signingClient }));
  }, [signingClient]);

  React.useEffect(() => {
    setContextValue((prevContextValue) => ({ ...prevContextValue, userAddress: userAddress }));
  }, [userAddress]);

  return (
    <ClientContext.Provider value={contextValue}>
      <FlexibleRouter type={settings.deployment.routerType}>
        {contractsUrl ? (
          <Switch>
            <Route exact path="/codes" component={CodeDashboardPage} />
            <Route exact path="/tokens" component={TokenPage} />
            <Route path="/codes/new" component={NewCodePage} />
            <Route path="/codes/:codeId" component={CodePage} />
            <Route path="/contract/tools" component={ToolsPage} />
            <Route path="/contracts/:contractAddress" component={ContractPage} />
            <Route path="/transactions/:txId" component={TxPage} />
            <Route path="/accounts/:address" component={AccountPage} />
            <Route component={DashboardPage} />
          </Switch>
        ): (
          <Switch>
            <Route exact path="/codes" component={CodesPage} />
            <Route path="/codes/new" component={NewCodePage} />
            <Route path="/codes/:codeId" component={CodePage} />
            <Route path="/contract/tools" component={ToolsPage} />
            <Route path="/contracts/:contractAddress" component={ContractPage} />
            <Route path="/transactions/:txId" component={TxPage} />
            <Route path="/accounts/:address" component={AccountPage} />
            <Route component={() => <Redirect to="/codes" />} />
          </Switch>
        )}
      </FlexibleRouter>
    </ClientContext.Provider>
  );
}
