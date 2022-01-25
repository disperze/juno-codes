import { settings } from "../settings";

export default class ContractService {
    getContracts = async (pageSize: number = 10, offset: number = 0) => {
        const response = await fetch(`${settings.backend?.contractsUrl}/contracts/${pageSize}/${offset}`);
        const contracts = await response.json()
        return contracts;
    }
    getTokens = async (pageSize: number = 10, offset: number = 0) => {
      const response = await fetch(`${settings.backend?.contractsUrl}/tokens/${pageSize}/${offset}`);
      const contracts = await response.json()
      return contracts;
  }
}

