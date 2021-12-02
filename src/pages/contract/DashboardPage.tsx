import React from "react";
import CardInfo from "../../components/CardInfo";
import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";

import { contractService } from "../../services/index"
import { AbstractContract } from "../../types/abstract-contract";
import { Contract } from "../../types/contract";
import { ErrorState, errorState, isErrorState, isLoadingState } from "../../ui-utils/states";
import ContractTable from "./ContractTable";

export function DashboardPage(): JSX.Element {
  const [contract, setContract] = React.useState<readonly Contract[] | ErrorState>([]);
  const [, setAbstractContract] = React.useState<AbstractContract | ErrorState>();

  const [count, setCount] = React.useState(0);
  const [gas, setGas] = React.useState(0);
  const [fees, setFees] = React.useState(0);
  const [tx, setTx] = React.useState(0);

  React.useEffect(() => {
    contractService
      .getContracts()
      .then(setContract)
      .catch(() => setContract(errorState));

    contractService
      .getAbstractContracts()
      .then(abstract => {
        setCount(abstract.count);
        setGas(abstract.sum.gas);
        setFees(abstract.sum.fees);
        setTx(abstract.sum.tx);
      })
      .catch(() => setAbstractContract(errorState));

  }, [contractService]);

  return (
    <div className="page">
      <Header />
      <div className="container mt-3 contract-container">
        <div className="container-fluid">
          <div className="row">
            <CardInfo title="Contracts"
              iconName="calendar"
              color="primary"
              value={`${count}`} />

            <CardInfo title="Fees used"
              iconName="calendar"
              color="success"
              value={`${fees}`} />

            <CardInfo title="Gas used"
              iconName="clipboard"
              color="info"
              value={`${gas}`} />

            <CardInfo title="Total txs"
              iconName="comments"
              color="warning"
              value={`${tx}`} />
          </div>
          <div className="row">

            <div className="card shadow mb-4 w-100">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Top JUNO Contracts</h6>
              </div>
              <div className="card-body">
                <div className="table-responsive w-100">
                  {isLoadingState(contract) ? (
                    <p>Loading …</p>
                  ) : isErrorState(contract) ? (
                    <p>An Error occurred when loading contracts</p>
                  ) : contract.length !== 0 ? (
                    <ContractTable contracts={contract} />
                  ) : (
                    <p>Contracts not found</p>
                  )}
                </div>
              </div>
            </div>





          </div>
        </div>
        <FooterRow />
      </div>
    </div>
  );
}
