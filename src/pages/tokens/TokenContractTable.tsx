import "./../contract/ContractTable.css";

import React from "react"
import { ContractLink } from "../../components/ContractLink"
import { AccountLink } from "../../components/AccountLink";
import { Token } from "../../types/token";

interface Props {
    readonly tokens: Token[],
}

export default function TokenContractTable({ tokens }: Props): JSX.Element {

    return (
      <table className="table">
          <thead>
              <tr>
                  <th scope="col" >Name</th>
                  <th scope="col" >Symbol</th>
                  <th scope="col">Address</th>
                  <th scope="col">Creator</th>
                  <th scope="col">Txs</th>
              </tr>
          </thead>
          <tbody>
              {tokens.map((token) => (
                  <tr key={token.contract.address}>
                      <td>
                        <span className="name-column" title={token.name}>{token.name}</span>
                      </td>
                      <td>{token.symbol}</td>
                      <td><ContractLink address={token.contract.address} maxLength={25} /> </td>
                      <td><AccountLink address={token.contract.creator} maxLength={20} /></td>
                      <td>{token.contract.tx}</td>
                  </tr>
              ))}
          </tbody>
      </table>
    )
}
