import { MsgInstantiateContract as IMsgInstantiateContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { CodeLink } from "../../../components/CodeLink";
import { ContractLink } from "../../../components/ContractLink";
import { JsonView } from "../../../components/JsonView";
import { parseMsgContract, printableBalance } from "../../../ui-utils";
import { findEventAttributes, findEventType, TxLog } from "../../../ui-utils/txs";

interface Props {
  readonly msg: IMsgInstantiateContract;
  readonly log: TxLog;
}

export function MsgInstantiateContract({ msg, log }: Props): JSX.Element {
  const instEvent = findEventType(log.events, "instantiate")!;
  let instContracts = findEventAttributes(instEvent.attributes, "_contract_address");

  return (
    <Fragment>
      <li className="list-group-item">
        <span className="font-weight-bold">Sender:</span>{" "}
        <AccountLink address={msg.sender || "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Code ID:</span>{" "}
        <CodeLink codeId={msg.codeId?.toNumber() ?? 0} text={msg.codeId?.toString() ?? "-"} />
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Label:</span> {msg.label}
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Init funds:</span> {printableBalance(msg.funds)}
      </li>
      <li className="list-group-item">
        <span title="The contract level message" className="font-weight-bold">
          Init message
        </span>
        :
        <JsonView src={parseMsgContract(msg.msg)} strLength={100} />
      </li>
      {instContracts.length > 1 && (
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
      {instContracts.length === 1 && (
          <li className="list-group-item">
            <span className="font-weight-bold">Contract:</span>{" "}
            <ContractLink address={instContracts[0].value} maxLength={null} />
          </li>
      )}
    </Fragment>
  );
}


