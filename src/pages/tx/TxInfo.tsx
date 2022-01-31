import { Tx } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { IndexedTx } from "@cosmjs/stargate";
import React from "react";

import { printableBalance } from "../../ui-utils";

interface Props {
  readonly tx: IndexedTx;
}

export function TxInfo({ tx }: Props): JSX.Element {
  const txb = Tx.decode(tx.tx);
  return (
    <div className="card mb-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <span className="font-weight-bold">Memo:</span> {txb.body?.memo || "–"}
        </li>
        <li className="list-group-item">
          <span className="font-weight-bold">Fee:</span> {printableBalance(txb.authInfo?.fee?.amount ?? [])}
        </li>
        <li className="list-group-item">
          <span className="font-weight-bold">Gas:</span> {tx.gasUsed} / {tx.gasWanted} ({(tx.gasUsed/tx.gasWanted*100).toFixed(2)}%)
        </li>
        <li className="list-group-item">
          <span className="font-weight-bold">Signatures:</span> {txb.signatures?.length ?? 0}
        </li>
      </ul>
    </div>
  );
}
