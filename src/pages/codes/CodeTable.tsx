import "./Code.css";

import React from "react";
import { Link } from "react-router-dom";
import { ellideMiddle } from "../../ui-utils";
import { Code } from "../../types/code";

interface Props {
  readonly codes: Code[],
}

export function CodeTable({ codes }: Props): JSX.Element {
  return (
    <div className="d-lg-flex flex-wrap">
      {codes.map((code, index) => {
        const version = parseVersion(code.version);
        return (
          <div key={code.code_id} className={"flex-element-two-two mb-3" + (index % 2 ? " pl-lg-2" : " pr-lg-2")}>
            <Link to={`/codes/${code.code_id}`} className="code-content">
              <div className="id">#{code.code_id}</div>
              <div className="details">
                Creator: {ellideMiddle(code.creator, 30)}
                <br />
                Checksum: {code.hash.slice(0, 10)}
                <br />
                Contracts: {code.contracts_aggregate.aggregate.count}
                <br />
                Size: {(code.size / 1024).toFixed(2)} KB
                {version.version && (
                  <>
                     <br />
                    Package: {" "}
                    <span className="code-package">{version.contract}</span>
                    <br />
                    Version: {version.version}
                  </>
                )}
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  );
}

function parseVersion(version?: string): any {
  if (!version) return {};

  if (version === "none") {
    return {
      version: "-",
      contract: "unknown",
    }
  }

  try {
    return JSON.parse(version);
  } catch {
    return {};
  }
}
