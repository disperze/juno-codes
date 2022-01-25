import { MsgExecuteContract as IMsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { ContractLink } from "../../../components/ContractLink";
import { JsonView } from "../../../components/JsonView";
import { parseMsgContract, printableBalance } from "../../../ui-utils";
import { findEventAttributes, findEventType,parseContractEvent, TxLog, TxAttribute } from "../../../ui-utils/txs";

interface Props {
  readonly msg: IMsgExecuteContract;
  readonly log: TxLog;
}

export function MsgExecuteContract({ msg, log }: Props): JSX.Element {
  const event = findEventType(log.events, "wasm")!;
  const evt = parseContractEvent(event.attributes);
  const interal = evt.filter(e => e.contract !== msg.contract && e.attributes.find(a => a.key === "action"));
  const instEvent = findEventType(log.events, "instantiate");
  let instContracts: TxAttribute[] = [];
  if (instEvent) {
    instContracts = findEventAttributes(instEvent.attributes, "_contract_address");
  }

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
      {interal.length > 0 && (
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
              {interal.map((e, index) => (
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
