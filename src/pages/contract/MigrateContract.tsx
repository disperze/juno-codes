import { ExecuteResult } from "@cosmjs/cosmwasm-stargate";
import React from "react";
import JSONInput from "react-json-editor-ajrm";
import { JsonView } from "../../components/JsonView";

import { ClientContext } from "../../contexts/ClientContext";
import { jsonInputStyle } from "../../ui-utils/jsonInput";
import { Result } from "./ContractPage";

const migratePlaceholder = {
  payout: "juno14vhcdsyf83ngsrrqc92kmw8q9xakqjm0ff2dpn",
};

interface Props {
  readonly contractAddress: string;
}

export function MigrateContract({ contractAddress }: Props): JSX.Element {
  const { userAddress, signingClient } = React.useContext(ClientContext);

  const [executing, setExecuting] = React.useState(false);
  const [error, setError] = React.useState<string>();

  const [msgObject, setMsgObject] = React.useState<Result<Record<string, any>>>();
  const [codeId, setCodeId] = React.useState<string>();

  const [executeResponse, setExecuteResponse] = React.useState<Result<ExecuteResult>>();

  React.useEffect(() => {
    setMsgObject({ result: migratePlaceholder });
  }, []);

  React.useEffect(() => {
    if (msgObject?.error) {
      setError(msgObject.error);
      return;
    }

    if (executeResponse?.error) {
      setError(executeResponse.error);
      return;
    }

    setError(undefined);
  }, [executeResponse, msgObject]);

  async function executeContract(): Promise<void> {
    if (!msgObject?.result || !codeId || !userAddress || !signingClient) return;

    const newCodeId = parseInt(codeId);
    if (isNaN(newCodeId)) {
      setExecuteResponse({ error: `Invalid Code ID: ${codeId}` });
      return;
    }

    setExecuting(true);

    try {
      const executeResponseResult: ExecuteResult = await signingClient.migrate(
        userAddress,
        contractAddress,
        newCodeId,
        msgObject.result,
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
          <span title="The contract query input">Migrate Message:</span>
        </li>
        <li className="list-group-item d-flex align-items-baseline">
          <JSONInput
            width="100%"
            height="200px"
            placeholder={migratePlaceholder}
            confirmGood={false}
            style={jsonInputStyle}
            onChange={({ jsObject }: any) => setMsgObject({ result: jsObject })}
          />
        </li>
        <li className="list-group-item d-flex align-items-baseline">
          <div className="form-group row flex-grow-1">
            <label className="col-sm-4 col-form-label">New Code ID:</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                value={codeId}
                onChange={(event) => setCodeId(event.target.value)}
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
              disabled={!msgObject?.result || !signingClient}
            >
              Migrate contract
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
