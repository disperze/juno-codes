import React from "react";
import JSONInput from "react-json-editor-ajrm";
import { Coin } from "@cosmjs/stargate";
import { jsonInputStyle } from "../ui-utils/jsonInput";

interface Props {
  readonly denom: string;
  readonly onChange: (coins: Coin[]) => void;
}

export default function CoinsTransfer({ denom, onChange }: Props): JSX.Element {
  const [isInputCoin, setIsInputCoin] = React.useState<boolean>(true);
  const coinsPlaceholder = [{ denom, amount: "1" }];
  const [amount, setAmount] = React.useState<string>();

  const updateTokens = () => {
    if (!amount || isNaN(Number(amount))) {
      onChange([]);
      return;
    }

    const parseAmount = (Number(amount) * 10 ** 6).toFixed(0);
    const coins = [{ denom, amount: parseAmount }];
    onChange(coins);
  };

  const toggleOption = (option: boolean) => {
    setIsInputCoin(option);
    onChange([]);
  };

  return (
    <>
      <li className="list-group-item d-flex align-items-baseline">
        <span title="The contract query input">Coins to transfer:</span>
        <div className="btn-group" role="group" style={{ position: "absolute", right: 0, marginRight: "20px" }}>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => toggleOption(true)}>Input</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => toggleOption(false)}>Raw</button>
        </div>
      </li>
      {isInputCoin ? (
        <li className="list-group-item d-flex align-items-baseline">
          <div className="input-group mb-3">
            <input type="text" className="form-control"
              onChange={(event) => setAmount(event.target.value)}
              onBlur={updateTokens}
            />
            <div className="input-group-append">
              <span className="input-group-text">{denom.slice(1).toUpperCase()}</span>
            </div>
          </div>
        </li>
      ) : (
        <li className="list-group-item d-flex align-items-baseline">
          <JSONInput
            width="100%"
            height="120px"
            placeholder={coinsPlaceholder}
            confirmGood={false}
            style={jsonInputStyle}
            onChange={({ jsObject }: any) => onChange(jsObject)}
          />
        </li>
      )}
    </>
  )
}
