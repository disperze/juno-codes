import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import React from "react";
import { JsonView } from "../../components/JsonView";

import { ClientContext } from "../../contexts/ClientContext";
import { Result } from "./ContractPage";

interface Props {
  readonly contractAddress: string;
}

export function UpdateContractAdmin({ contractAddress }: Props): JSX.Element {
  const { userAddress, signingClient } = React.useContext(ClientContext);

  const [executing, setExecuting] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const [admin, setAdmin] = React.useState<string>();

  const [executeResponse, setExecuteResponse] = React.useState<Result<ExecuteResult>>();

  React.useEffect(() => {
    if (executeResponse?.error) {
      setError(executeResponse.error);
      return;
    }

    setError(undefined);
  }, [executeResponse]);

  async function executeContract(): Promise<void> {
    if (!admin || !userAddress || !signingClient) return;

    setExecuting(true);

    try {
      const executeResponseResult: ExecuteResult = await signingClient.updateAdmin(
        userAddress,
        contractAddress,
        admin,
        "auto",
        undefined
      );
      setExecuteResponse({ result: executeResponseResult });
    } catch (error) {
      setExecuteResponse({ error: `Execute error: ${error.message}` });
    }

    setExecuting(false);
  }

  return (
    <div className="card mb-3">
      <ul className="list-group list-group-flush">
        <li className="list-group-item d-flex align-items-baseline">
          <div className="form-group row flex-grow-1">
            <label className="col-sm-4 col-form-label">New Admin:</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                value={admin}
                onChange={(event) => setAdmin(event.target.value)}
              />
            </div>
          </div>
        </li>
        <div className="list-group-item btn-group">
          {executing ? (
            <button className="btn btn-primary" type="button" disabled>
              <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
              Executing...
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={executeContract}
              disabled={!signingClient}
            >
              Update Admin
            </button>
          )}
        </div>
        {executeResponse?.result ? (
          <li className="list-group-item">
            <span title="The contract formatted input">Response:</span>
            <JsonView src={executeResponse.result} />
          </li>
        ) : null}
        {error ? (
          <li className="list-group-item">
            <span className="text-danger" title="The contract query error">
              {error}
            </span>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
