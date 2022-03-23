import { MsgExecuteContract as IMsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { ContractLink } from "../../../components/ContractLink";
import { JsonView } from "../../../components/JsonView";
import { parseMsgContract, printableBalance } from "../../../ui-utils";
import { findEventAttributes, findEventType,parseContractEvent, TxLog, TxAttribute, ContractEvent } from "../../../ui-utils/txs";
import { ClientContext } from "../../../contexts/ClientContext";
import { makeTags } from "../../../ui-utils/sdkhelpers";
import { ErrorState, isErrorState, isLoadingState, loadingState, LoadingState } from "../../../ui-utils/states";
import { TransactionLink } from "../../../components/TransactionLink";

interface Props {
  readonly msg: IMsgExecuteContract;
  readonly log: TxLog;
}

export function MsgExecuteContract({ msg, log }: Props): JSX.Element {
  const { client } = React.useContext(ClientContext);
  const [ackTxs, setAckTxs] = React.useState<string[] | undefined | ErrorState | LoadingState>(
    loadingState,
  );

  const event = findEventType(log.events, "wasm");
  let internal: ContractEvent[] = [];
  if (event) {
    const evt = parseContractEvent(event.attributes);
    internal = evt.filter(e => e.contract !== msg.contract && e.attributes.find(a => a.key === "action"));
  }

  const instEvent = findEventType(log.events, "instantiate");
  let instContracts: TxAttribute[] = [];
  if (instEvent) {
    instContracts = findEventAttributes(instEvent.attributes, "_contract_address");
  }

  const packetEvent = findEventType(log.events, "send_packet");

  React.useEffect(() => {
    if (!packetEvent) {
      return;
    }

    const packetInfo = {
      channel: findEventAttributes(packetEvent.attributes, "packet_src_channel")[0].value,
      port: findEventAttributes(packetEvent.attributes, "packet_src_port")[0].value,
      sequence: findEventAttributes(packetEvent.attributes, "packet_sequence")[0].value,
    };

    client
    ?.searchTx({
      tags: makeTags(`acknowledge_packet.packet_src_port=${packetInfo.port}&acknowledge_packet.packet_src_channel=${packetInfo.channel}&acknowledge_packet.packet_sequence=${packetInfo.sequence}`),
    })
    .then((results) => {
      setAckTxs(results.map(tx => tx.hash));
    });
  }, [client, packetEvent]);

  return (
    <Fragment>
      <li className="list-group-item">
        <span className="font-weight-bold">Contract:</span>{" "}
        <ContractLink address={msg.contract ?? "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Sender:</span>{" "}
        <AccountLink address={msg.sender ?? "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Sent funds:</span> {printableBalance(msg.funds)}
      </li>
      <li className="list-group-item">
        <span title="The contract level message" className="font-weight-bold">
          Handle message
        </span>
        :
        <JsonView src={parseMsgContract(msg.msg)} strLength={100} />
      </li>
      {packetEvent && (
        <li className="list-group-item">
          <span className="font-weight-bold">IBC Acknowledge Tx:</span>{" "}
          {isLoadingState(ackTxs) ? (
              <span>Loading …</span>
            ) : isErrorState(ackTxs) ? (
              <span>Error</span>
            ) : (
              <ul>
              {ackTxs?.map((hash) => (
                <li key={hash}>
                  <TransactionLink transactionId={hash} maxLength={null} />
                </li>
              ))}
              </ul>
          )}
        </li>
      )}
      {instContracts.length > 0 && (
        <li className="list-group-item">
          <span title="The contract level message" className="font-weight-bold">
            New contracts:
          </span>
          <p />
          <ul>
            {instContracts.map((e) => (
              <li key={e.value}>
                <ContractLink address={e.value} maxLength={null} />
              </li>
            ))}
          </ul>

        </li>
      )}
      {internal.length > 0 && (
        <li className="list-group-item">
          <span title="The contract level message" className="font-weight-bold">
            Internal contract calls:
          </span>
          <p />
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Action</th>
                <th>Contract</th>
              </tr>
            </thead>
            <tbody>
              {internal.map((e, index) => (
                <tr key={e.contract}>
                  <td>{index + 1}</td>
                  <td>{e.attributes.find(a => a.key === "action")?.value}</td>
                  <td>
                    <ContractLink address={e.contract} maxLength={null} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </li>
      )}
    </Fragment>
  );
}
