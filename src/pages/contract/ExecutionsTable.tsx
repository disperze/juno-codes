import React from "react";

import { AccountLink } from "../../components/AccountLink";
import { TransactionLink } from "../../components/TransactionLink";
import { parseMsgContract } from "../../ui-utils";
import { findEventAttributes, findEventType, parseContractEvent } from "../../ui-utils/txs";
import { Log } from "@cosmjs/stargate/build/logs";

export interface Execution {
  readonly key: string;
  readonly height: number;
  readonly transactionId: string;
  readonly msg: any;
  readonly log: Log;
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
          const { action, sender, relay } = getExecutionParams(execution, contract);
          const ibcBadge = relay ? (<span className="badge badge-pill badge-info">relayer</span>): <></>;

          if (!action) {
            return <></>
          }

          return (
            <tr key={execution.key}>
              <td>{execution.height}</td>
              <td>{action} {ibcBadge}</td>
              <td>
                <TransactionLink transactionId={execution.transactionId} />
              </td>
              <td>
                <AccountLink address={sender} />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  );
}

function getAction(execution: Execution, contract: string): string|undefined {
  const event = findEventType(execution.log.events, "wasm");
  if (!event) {
    return undefined;
  }
  const ctrEvt = parseContractEvent(event.attributes);
  const evt = ctrEvt.find(e => e.contract === contract);

  // No contract in msg
  if (!evt) {
    return undefined;
  }

  let attrs = findEventAttributes(evt.attributes, "action");
  if (attrs.length > 0) {
    return attrs[0].value;
  }
  attrs = findEventAttributes(evt.attributes, "method");
  return attrs.length > 0 ? attrs[0].value : "unknown";
}

function getExecutionParams(execution: Execution, contract: string) {
  let action;
  let sender;
  let relay = false;
  if ("contract" in execution.msg) {
    sender = execution.msg.sender;
    if (execution.msg.contract === contract) {
      action = Object.keys(parseMsgContract(execution.msg.msg))[0];
    } else {
      action = getAction(execution, contract);
    }
  } else if ("packet" in execution.msg) {
    const timeoutEvent = findEventType(execution.log.events, "timeout_packet");
    action = timeoutEvent ? "timeout" : getAction(execution, contract);
    sender = execution.msg.signer;
    relay = true;
  }

  return {
    action,
    sender,
    relay,
  }
}
