import { MsgMigrateContract as IMsgMigrateContract  } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { ContractLink } from "../../../components/ContractLink";
import { JsonView } from "../../../components/JsonView";
import { CodeLink } from "../../../components/CodeLink";
import { parseMsgContract } from "../../../ui-utils";

interface Props {
  readonly msg: IMsgMigrateContract;
}

export function MsgMigrateContract({ msg }: Props): JSX.Element {
  return (
    <Fragment>
      <li className="list-group-item">
        <span className="font-weight-bold">Sender:</span>{" "}
        <AccountLink address={msg.sender ?? "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">Contract:</span>{" "}
        <ContractLink address={msg.contract ?? "-"} maxLength={null} />
      </li>
      <li className="list-group-item">
        <span className="font-weight-bold">New Code ID:</span>{" "}
        <CodeLink codeId={msg.codeId?.toNumber() ?? 0} text={msg.codeId?.toString() ?? "-"} />
      </li>
      <li className="list-group-item">
        <span title="The contract level message" className="font-weight-bold">
          Migrate message
        </span>
        :
        <JsonView src={parseMsgContract(msg.msg)} strLength={100} />
      </li>
    </Fragment>
  );
}
