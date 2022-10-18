import React from "react";

import { ClientContext } from "../contexts/ClientContext";
import { settings } from "../settings";
import {
  getAddressAndStargateSigningClient,
  loadCosmostationWallet,
  loadKeplrWallet,
  loadLedgerWallet,
  WalletLoaderDirect,
  webUsbMissing,
} from "../ui-utils/clients";

export function Login(): JSX.Element {
  const { userAddress, setUserAddress, setSigningClient, client } = React.useContext(ClientContext);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>();

  async function loginStargate(loadWallet: WalletLoaderDirect): Promise<void> {
    setLoading(true);
    setError(undefined);

    try {
      const [userAddress, signingClient] = await getAddressAndStargateSigningClient(loadWallet);
      setUserAddress(userAddress);
      setSigningClient(signingClient);
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  }

  function logout(): void {
    setError(undefined);
    setUserAddress(undefined);
    setSigningClient(undefined);
  }

  function renderLoginButton(): JSX.Element {
    const { keplrChainInfo, cosmostationInfo } = settings.backend;

    let keplrButton, cosmostationButton;
    if (keplrChainInfo && client) {
      keplrButton = (
        <button
          className="dropdown-item"
          onClick={async () => loginStargate(loadKeplrWallet(client, keplrChainInfo))}
        >
          Keplr wallet
        </button>
      );
    }

    if (cosmostationInfo) {
      cosmostationButton = (
        <button
          className="dropdown-item"
          onClick={async () => loginStargate(loadCosmostationWallet(cosmostationInfo))}
        >
          Cosmostation
        </button>
      );
    }

    return loading ? (
      <button className="btn btn-primary" type="button" disabled>
        <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
        Loading...
      </button>
    ) : (
      <>
        <button
          type="button"
          className="btn btn-primary dropdown-toggle"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Login
        </button>
        <div className="dropdown-menu">
          <h6 className="dropdown-header">with</h6>
          {keplrButton}
          {cosmostationButton}
          <button
            className="dropdown-item"
            onClick={() => loginStargate(loadLedgerWallet)}
            disabled={webUsbMissing()}
          >
            Ledger wallet
          </button>
        </div>
      </>
    );
  }

  function renderLogoutButton(): JSX.Element {
    return (
      <button className="btn btn-primary" onClick={logout}>
        Logout
      </button>
    );
  }

  const isUserLoggedIn = !!userAddress;

  return (
    <div className="d-flex align-items-center justify-content-end">
      {error ? <div className="mr-3 p-2 rounded bg-white text-danger">{error}</div> : null}
      {isUserLoggedIn ? renderLogoutButton() : renderLoginButton()}
    </div>
  );
}
