import "./NewCodePage.css";

import { calculateFee } from "@cosmjs/stargate";
import * as logs from "@cosmjs/stargate/build/logs";
import React from "react";
import { Link } from "react-router-dom";

import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import { ClientContext } from "../../contexts/ClientContext";
import { Result } from "../contract/ContractPage";
import { CodeLink } from "../../components/CodeLink";
import { TransactionLink } from "../../components/TransactionLink";
import { settings } from "../../settings";
import { sha256 } from "../../ui-utils";
import { contractService } from "../../services/index"
import { CodeByHashRespone, Code } from "../../types/code-by-hash";
import { MsgStoreCode } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { AccessType } from "cosmjs-types/cosmwasm/wasm/v1/types";
import pako from "pako";

interface UploadResult {
  readonly codeId: number,
  readonly transactionHash: string,
}

export function NewCodePage(): JSX.Element {
  const { userAddress, signingClient } = React.useContext(ClientContext);
  const [wasm, setWasm] = React.useState<File | null>();
  const [accessType, setAccessType] = React.useState<string>();
  const [accessAddress, setAccessAddress] = React.useState<string>();

  const [executing, setExecuting] = React.useState(false);
  const [executeResponse, setExecuteResponse] = React.useState<Result<UploadResult>>();
  const [error, setError] = React.useState<string>();
  const [matchCodes, setMatchCodes] = React.useState<Code[]>();

  React.useEffect(() => {
    if (executeResponse?.error) {
      setError(executeResponse.error);
      return;
    }

    setError(undefined);
  }, [executeResponse]);

  async function uploadCode(): Promise<void> {
    if (!userAddress || !wasm || !signingClient) return;

    if (accessType === "2" && !accessAddress) {
      alert('Access address is required');
      return;
    }

    setExecuting(true);
    setMatchCodes(undefined);
    const wasmBytes = new Uint8Array(await wasm.arrayBuffer());

    try {
      const permissionType = accessType ? parseInt(accessType): AccessType.ACCESS_TYPE_UNSPECIFIED;
      const compressed = pako.gzip(wasmBytes, { level: 9 });
      const storeCodeMsg = {
        typeUrl: "/cosmwasm.wasm.v1.MsgStoreCode",
        value: MsgStoreCode.fromPartial({
          sender: userAddress,
          wasmByteCode: compressed,
          instantiatePermission: permissionType > 0 ? {
            address: accessAddress,
            permission: permissionType
          }: undefined,
        }),
      };

      const result = await signingClient.signAndBroadcast(
        userAddress,
        [storeCodeMsg],
        calculateFee(30000000, settings.backend.gasPrice),
      );
      const parsedLogs = logs.parseRawLog(result.rawLog);
      const codeIdAttr = logs.findAttribute(parsedLogs, "store_code", "code_id");
      setExecuteResponse({ result: {
        codeId: Number.parseInt(codeIdAttr.value, 10),
        transactionHash: result.transactionHash,
      } });
    } catch (error) {
      setExecuteResponse({ error: `Execute error: ${(error as any).message}` });
    }

    setExecuting(false);
  }

  const onChangeWasmCode =  async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setWasm(file);
    if (!file) {
      return;
    }

    if (!settings.backend.contractsUrl) return;

    try {
      const wasmBytes = new Uint8Array(await file.arrayBuffer());
      const hash = await sha256(wasmBytes);
      const result: CodeByHashRespone = await contractService.getCodeByHash(hash.toUpperCase());

      setMatchCodes(result.codes);
    } catch {
      setMatchCodes(undefined);
    }
  };
  return (
    <div className="page">
      <Header />
      <div className="container mt-3">
        <div className="row white-row white-row-first">
          <div className="col">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/codes">Codes</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  New Code
                </li>
              </ol>
            </nav>
          </div>
        </div>
        <div className="row white-row white-row-last">
          <div className="col">
            <div className="card mb-3">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex align-items-baseline">
                  <span>New Wasm Code</span>
                </li>
                <li className="list-group-item d-flex align-items-baseline">
                  <span title="The wasm code">Wasm:</span>
                  <div className="file btn btn-secondary">
                    {wasm?.name ?? "Select file"}
                    <input
                      type="file"
                      accept=".wasm"
                      className="ml-3 flex-grow-1 form-control-file"
                      onChange={async (e) => await onChangeWasmCode(e)}
                    />
                  </div>
                </li>
                <li className="list-group-item d-flex align-items-baseline">
                  <div className="row" style={{width: "100%"}}>
                    <div className="col-6">
                      <label title="The Permission">Permission:</label>
                      <select
                        className="flex-grow-1 form-control"
                        onChange={(event) => setAccessType(event.target.value)}
                        >
                        <option>Unspecified</option>
                        <option value={1}>Everybody</option>
                        <option value={2}>Only Address</option>
                        <option value={3}>Nobody</option>
                      </select>
                    </div>
                    {accessType === "2" && (<div className="col-6">
                      <label title="The address">Address:</label>
                      <input
                        className="flex-grow-1 form-control"
                        onChange={(event) => setAccessAddress(event.target.value)}
                      />
                    </div>)}
                  </div>
                </li>
                <div className="list-group-item btn-group">
                  {executing ? (
                    <button className="btn btn-primary" type="button" disabled>
                      <span
                        className="spinner-border spinner-border-sm mr-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Executing...
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={uploadCode} disabled={!signingClient}>
                      Upload
                    </button>
                  )}
                </div>
                {matchCodes && matchCodes.length > 0 && (
                  <>
                    <li className="list-group-item">
                      <span className="font-weight-bold">Wasm code already stored</span>
                    </li>
                    {matchCodes
                      // order by desc
                      .sort((a,b) => b.contracts_aggregate.aggregate.count - a.contracts_aggregate.aggregate.count)
                      .map(matchCode => (
                      <>
                        <li className="list-group-item">
                          <div className="row mb-3">
                            <div className="col-md-2">
                              <span>Code ID:</span>
                            </div>
                            <div className="col-md-10">
                              <CodeLink codeId={matchCode.code_id} text={"#" + matchCode.code_id} />
                            </div>
                          </div>
                          <div className="row mb-3">
                            <div className="col-md-2">
                              <span>Package:</span>
                            </div>
                            <div className="col-md-10">
                              <span>{matchCode.version ?? "-"}</span>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-2">
                              <span>Contracts:</span>
                            </div>
                            <div className="col-md-10">
                              <span>{matchCode.contracts_aggregate.aggregate.count}</span>
                            </div>
                          </div>
                        </li>
                      </>
                    ))}
                  </>

                )}
                {executeResponse?.result ? (
                  <>
                    <li className="list-group-item">
                      <span className="font-weight-bold">Response:</span>
                    </li>
                    <li className="list-group-item">
                      <div className="row mb-3">
                        <div className="col-md-2">
                          <span>Code ID:</span>
                        </div>
                        <div className="col-md-10">
                          <CodeLink codeId={executeResponse.result.codeId} text={"#" + executeResponse.result.codeId} />
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-2">
                          <span>Transaction:</span>
                        </div>
                        <div className="col-md-10">
                          <TransactionLink transactionId={executeResponse.result.transactionHash} maxLength={99} />
                        </div>
                      </div>
                    </li>
                  </>
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
          </div>
        </div>
        <FooterRow />
      </div>
    </div>
  );
}
