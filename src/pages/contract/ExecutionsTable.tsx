import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import React from "react";

import { AccountLink } from "../../components/AccountLink";
import { TransactionLink } from "../../components/TransactionLink";
import { parseMsgContract } from "../../ui-utils";
import { findEventAttributes, findEventType, parseContractEvent, TxLog } from "../../ui-utils/txs";

export interface Execution {
  readonly key: string;
  readonly height: number;
  readonly transactionId: string;
  readonly msg: MsgExecuteContract;
  readonly log: TxLog;
}

interface Props {
  readonly executions: readonly Execution[];
  readonly contract: string;
}

export function ExecutionsTable({ executions, contract }: Props): JSX.Element {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Height</th>
          <th scope="col">Action</th>
          <th scope="col">Transaction ID</th>
          <th scope="col">Sender</th>
        </tr>
      </thead>
      <tbody>
        {executions.map((execution, _) => {
          let action;
          if (execution.msg.contract === contract) {
            action = Object.keys(parseMsgContract(execution.msg.msg))[0]
          } else {
            action = getAction(execution, contract);
          }

          if (!action) {
            return <></>
          }

          return (
            <tr key={execution.key}>
              <td>{execution.height}</td>
              <td>{action}</td>
              <td>
                <TransactionLink transactionId={execution.transactionId} />
              </td>
              <td>
                <AccountLink address={execution.msg.sender} />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

function getAction(execution:Execution, contract: string): string|undefined {
  const event = findEventType(execution.log.events, "wasm")!;
  const ctrEvt = parseContractEvent(event.attributes);
  const evt = ctrEvt.find(e => e.contract === contract);

  // No contract in msg
  if (!evt) {
    return undefined;
  }

  const attrs = findEventAttributes(evt.attributes, "action");
  return attrs.length > 0 ? attrs[0].value : "unknown";
}
