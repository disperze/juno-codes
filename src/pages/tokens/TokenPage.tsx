import React from "react";
import CardInfo from "../../components/CardInfo";
import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import Pagination from "../../components/Pagination";
import { contractService } from "../../services/index"
import { isErrorState, isLoadingState, ErrorState, errorState, LoadingState, loadingState } from "../../ui-utils/states";
import { TokenResponse } from "../../types/token";
import TokenContractTable from "./TokenContractTable";

const PAGE_SIZE = 15;

export function TokenPage(): JSX.Element {
  const [contract, setContract] = React.useState<TokenResponse | ErrorState | LoadingState>(loadingState);

  const loadContracts = React.useCallback(async (offset: number) => {
    try {
      const contracts = await contractService.getTokens(PAGE_SIZE, offset);
      setContract(contracts);
    } catch {
      setContract(errorState);
    }
  }, []);

  React.useEffect(() => {
    loadContracts(0)
  }, [loadContracts]);

  const handlePage = async (page: number) => {
    const offset = (page - 1) * PAGE_SIZE;
    await loadContracts(offset)
  }

  return (
    <div className="page">
      <Header />
      <div className="container mt-3 contract-container">
        <div className="container-fluid">
          {isLoadingState(contract) ? (
            <p>Loading …</p>
          ) : isErrorState(contract) ? (
            <p>An Error occurred when loading contracts</p>
          ) : contract.tokens_aggregate ? (
            <div className="row">
              <CardInfo title="Total Tokens"
                iconName="calendar"
                color="primary"
                value={`${contract.tokens_aggregate.aggregate.count}`} />

            </div>
          ) : (
            <p>Abstract contracts is empty</p>
          )}
          <div className="row">
            <div className="card shadow mb-4 w-100">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary" title="JUNO Tokens by gas used">JUNO Tokens Ranking</h6>
              </div>
              <div className="card-body">
                <div className="table-responsive w-100">
                  {isLoadingState(contract) ? (
                    <p>Loading …</p>
                  ) : isErrorState(contract) ? (
                    <p>An Error occurred when loading contracts</p>
                  ) : contract.tokens.length !== 0 ? (
                    <div>
                      <TokenContractTable tokens={contract.tokens} />
                      <Pagination totalItems={contract.tokens_aggregate.aggregate.count} step={PAGE_SIZE} onChangePage={handlePage} />
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
