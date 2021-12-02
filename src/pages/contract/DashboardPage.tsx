import React from "react";
import CardInfo from "../../components/CardInfo";
import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import Pagination from "../../components/Pagination";
import { contractService } from "../../services/index"
import { Contract } from "../../types/contract";
import { ErrorState, errorState, isErrorState, isLoadingState } from "../../ui-utils/states";
import ContractTable from "./ContractTable";

export function DashboardPage(): JSX.Element {
  const [contract, setContract] = React.useState<Contract | ErrorState>({
    contracts: [],
    contracts_aggregate: {
      aggregate: {
        count: 0,
        sum: {
          gas: 0,
          fees: 0,
          tx: 0
        }
      },
    }
  })

  React.useEffect(() => {
    contractService
      .getContracts()
      .then(setContract)
      .catch(() => setContract(errorState));
  }, [contractService]);

  return (
    <div className="page">
      <Header />
      <div className="container mt-3 contract-container">
        <div className="container-fluid">
          {isLoadingState(contract) ? (
            <p>Loading …</p>
          ) : isErrorState(contract) ? (
            <p>An Error occurred when loading contracts</p>
          ) : contract.contracts_aggregate ? (
            <div className="row">
              <CardInfo title="Contracts"
                iconName="calendar"
                color="primary"
                value={`${contract.contracts_aggregate.aggregate.count}`} />

              <CardInfo title="Fees used"
                iconName="calendar"
                color="success"
                value={`${contract.contracts_aggregate.aggregate.sum.fees}`} />

              <CardInfo title="Gas used"
                iconName="clipboard"
                color="info"
                value={`${contract.contracts_aggregate.aggregate.sum.gas}`} />

              <CardInfo title="Total txs"
                iconName="comments"
                color="warning"
                value={`${contract.contracts_aggregate.aggregate.sum.tx}`} />
            </div>
          ) : (
            <p>Abstract contracts is empty</p>
          )}
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
                  ) : contract.contracts.length !== 0 ? (
                    <div>
                      <ContractTable contracts={contract.contracts} />
                      <Pagination totalItems={contract.contracts_aggregate.aggregate.count} pageSize={10} />
                    </div>
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
