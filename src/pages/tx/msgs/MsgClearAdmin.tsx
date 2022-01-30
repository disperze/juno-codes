import { MsgClearAdmin as IMsgClearAdmin  } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import React, { Fragment } from "react";

import { AccountLink } from "../../../components/AccountLink";
import { ContractLink } from "../../../components/ContractLink";

interface Props {
  readonly msg: IMsgClearAdmin;
}

export function MsgClearAdmin({ msg }: Props): JSX.Element {
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
    </Fragment>
  );
}
