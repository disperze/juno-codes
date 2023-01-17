import React from "react";
import { Link } from "react-router-dom";
import { fromHex, toUtf8 } from "@cosmjs/encoding";

import { FooterRow } from "../../components/FooterRow";
import { Header } from "../../components/Header";
import { instantiate2Address } from "../../ui-utils/cw-instantiate2";
import { settings } from "../../settings";


export function ToolsPage(): JSX.Element {
  const [checkSum, setChecksum] = React.useState<string>();
  const [creator, setCreator] = React.useState<string>();
  const [salt, setSalt] = React.useState<string>();
  const [msg, setMsg] = React.useState<string>();

  const [executeResponse, setExecuteResponse] = React.useState<string>();
  const [error, setError] = React.useState<string>();

  async function calculateAddress(): Promise<void> {
    if (!checkSum || !creator || !salt) return;

    const message = !msg ? null : msg;
    try {
      const address = instantiate2Address(fromHex(checkSum), creator, toUtf8(salt), message, settings.backend.addressPrefix);
      setExecuteResponse(address);
      setError(undefined);
    } catch (err) {
      setExecuteResponse(undefined);
      setError(`${(err as any).message}`);
    }
  }

  return (
    <div className="page">
      <Header />
      <div className="container mt-3">
        <div className="row white-row white-row-first">
          <div className="col">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item active" aria-current="page">
                  InstantiateContract2
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
                  <span>Calculate contract address</span>
                </li>
                <li className="list-group-item d-flex align-items-baseline">
                  <div className="row" style={{width: "100%"}}>
                    <div className="col-6">
                      <label title="Hash">Code checksum:</label>
                      <input type="text" className="form-control"
                        onChange={(event) => setChecksum(event.target.value)}
                      />
                    </div>
                  </div>
                </li>
                <li className="list-group-item d-flex align-items-baseline">
                  <div className="row" style={{width: "100%"}}>
                    <div className="col-6">
                      <label title="Creator">Creator:</label>
                      <input type="text" className="form-control"
                        onChange={(event) => setCreator(event.target.value)}
                      />
                    </div>
                  </div>
                </li>
                <li className="list-group-item d-flex align-items-baseline">
                  <div className="row" style={{width: "100%"}}>
                    <div className="col-6">
                      <label title="Message">Msg:</label>
                      <input type="text" className="form-control"
                        onChange={(event) => setMsg(event.target.value)}
                      />
                    </div>
                  </div>
                </li>
                <li className="list-group-item d-flex align-items-baseline">
                  <div className="row" style={{width: "100%"}}>
                    <div className="col-6">
                      <label title="Salt">Salt:</label>
                      <input type="text" className="form-control"
                        onChange={(event) => setSalt(event.target.value)}
                      />
                    </div>
                  </div>
                </li>
                <div className="list-group-item btn-group">
                  <button className="btn btn-primary" onClick={calculateAddress}>
                    Calculate
                  </button>
                </div>
                {executeResponse ? (
                  <>
                    <li className="list-group-item">
                      <span className="font-weight-bold">Response:</span>
                    </li>
                    <li className="list-group-item">
                      <div className="row mb-3">
                        <div className="col-md-2">
                          <span>Address:</span>
                        </div>
                        <div className="col-md-10">
                          {executeResponse}
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
