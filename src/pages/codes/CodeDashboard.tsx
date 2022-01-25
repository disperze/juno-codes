import React from "react";
import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import Pagination from "../../components/Pagination";
import { contractService } from "../../services/index"
import { isErrorState, isLoadingState, ErrorState, errorState, LoadingState, loadingState } from "../../ui-utils/states";
import { CodesResponse } from "../../types/code";
import { CodeTable } from "./CodeTable";

const PAGE_SIZE = 30;

export function CodeDashboardPage(): JSX.Element {
  const [codes, setCodes] = React.useState<CodesResponse | ErrorState | LoadingState>(loadingState);

  const loadCodes = React.useCallback(async (offset: number) => {
    try {
      const codes = await contractService.getCodes(PAGE_SIZE, offset);
      setCodes(codes);
    } catch {
      setCodes(errorState);
    }
  }, []);

  React.useEffect(() => {
    loadCodes(0)
  }, [loadCodes]);

  const handlePage = async (page: number) => {
    const offset = (page - 1) * PAGE_SIZE;
    await loadCodes(offset)
  }

  return (
    <div className="page">
      <Header />
      <div className="container mt-3 contract-container">
        <div className="row white-row white-row-first">
          <div className="col">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">
                  Codes
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row white-row white-row-last">
          <div className="col">
            {isLoadingState(codes) ? (
              <p>Loading …</p>
            ) : isErrorState(codes) ? (
              <p>An Error occurred when loading codes</p>
            ) : codes.codes.length !== 0 ? (
              <div>
                <CodeTable codes={codes.codes} />
                <Pagination totalItems={codes.codes_aggregate.aggregate.count} step={PAGE_SIZE} onChangePage={handlePage} />
              </div>
            ) : (
              <p>Codes not found</p>
            )}
          </div>
        </div>
        <FooterRow />
      </div>
    </div>
  );
}
