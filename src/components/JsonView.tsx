import React from "react";
import ReactJson from "react-json-view";

interface Props {
    readonly src: object;
    readonly strLength?: number;
    readonly collapsed?: boolean;
}

export function JsonView({ src, strLength, collapsed }: Props): JSX.Element {
  return (
      <ReactJson
        src={src}
        name={false}
        displayDataTypes={false}
        displayObjectSize={false}
        collapsed={collapsed}
        collapseStringsAfterLength={strLength ?? 24}
        theme="twilight"
      />
  );
}
