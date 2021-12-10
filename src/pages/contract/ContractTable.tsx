import "./ContractTable.css";

import React from "react"
import { ContractLink } from "../../components/ContractLink"
import { ContractElement } from "../../types/contract"
import { printableBalance } from "../../ui-utils"
import { settings } from "../../settings";
import { AccountLink } from "../../components/AccountLink";

interface Props {
    readonly contracts: ContractElement[],
}

export default function ContractTable({ contracts }: Props): JSX.Element {

    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col" >Name</th>
                    <th scope="col">Address</th>
                    <th scope="col">Owner</th>
                    <th scope="col">Txs</th>
                    <th scope="col">Gas</th>
                    <th scope="col">Fees</th>
                </tr>
            </thead>
            <tbody>
                {contracts.map(({ address, fees, gas, label, creator, tx }) => (
                    <tr key={address}>
                        <td>
                          <span className="name-column" title={label}>{label}</span>
                        </td>
                        <td><ContractLink address={address} maxLength={25} /> </td>
                        <td><AccountLink address={creator} maxLength={20} /></td>
                        <td>{tx}</td>
                        <td>{gas}</td>
                        <td>{printableBalance([{amount: fees.toString(), denom: settings.backend.denominations[0]}])}</td>
                    </tr>
                ))}
            </tbody>
        </table>)
}
