import { MsgInstantiateContract as IMsgInstantiateContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { CodeLink } from "../../../components/CodeLink";
import { ContractLink } from "../../../components/ContractLink";
import { JsonView } from "../../../components/JsonView";
import { parseMsgContract, printableBalance } from "../../../ui-utils";

interface Props {
  readonly msg: IMsgInstantiateContract;
  readonly log: string;
}

export function MsgInstantiateContract({ msg, log }: Props): JSX.Element {
  const logs = JSON.parse(log);
  const contract = getEventAttributeValue(logs[0].events, "instantiate", "_contract_address");

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
      <li className="list-group-item">
        <span className="font-weight-bold">Output:</span>{" "}
        <ContractLink address={contract} maxLength={null} />
      </li>
    </Fragment>
  );
}

function getEventAttributeValue(events: any[], type: string, key: string): string {
  const event = events.find((e) => e.type === type);

  if (!event) {
    return "-";
  }

  const attr = event.attributes.find((a: any) => a.key === key);

  return attr.value;
}
