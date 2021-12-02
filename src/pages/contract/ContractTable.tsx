import React from "react"
import { ContractLink } from "../../components/ContractLink"
import {  ContractElement } from "../../types/contract"
import { ellideMiddle, printableBalance } from "../../ui-utils"
import { settings } from "../../settings";

interface Props {
    readonly contracts: ContractElement[],
    readonly maxLength?: number | null;
}

export default function ContractTable({ contracts, maxLength = 20 }: Props): JSX.Element {

    return (
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">Name</th>
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
                        <td>{label}</td>

                        <td><ContractLink address={address} /> </td>
                        <td>{ellideMiddle(creator, maxLength || 99999)}</td>
                        <td>{tx}</td>
                        <td>{gas}</td>
                        <td>{printableBalance([{amount: fees.toString(), denom: settings.backend.denominations[0]}])}</td>
                    </tr>
                ))}
            </tbody>
        </table>)
}
