import { Contract } from "../types/contract";

export default class ContractService {
    contract: Contract;
    constructor() {
        this.contract = {
            "contracts": [
                { "address": "juno1sr06m8yqg0wzqqyqvzvp5t07dj4nevx9u8qc7j4qa72qu8e3ct8qm0adwt", "code_id": 6, "fees": 30495000, "gas": 1826334447, "label": "hello!", "creator": "juno1m7a7nva00p82xr0tssye052r8sxsxvcy2v5qz6", "tx": 16961, "creation_time": "2021-11-02T21:36:33Z", "height": 269577 },
                { "address": "juno1muhpwhn3usuhp3qrqu2l2sxuh0xpu8rs5mck8kxzg00vzy7cq0kq0kapl5", "code_id": 82, "fees": 35403758, "gas": 1093297317, "label": "doctor contract", "creator": "juno13e9se47wg8h5ksf72wy8qmaqmnyctenevp6yw7", "tx": 408, "creation_time": "2021-11-18T01:43:14Z", "height": 464816 },
                { "address": "juno12pdkmn8qf09rn5yuf6lpreml8ypf45uzkvwyeztaqpjncpfwk0kqp3mrpr", "code_id": 183, "fees": 640000, "gas": 17395265, "label": "WYND Invest", "creator": "juno1pxa9trxza5e2w7sdk2a0xng86y4fnena4e0pka", "tx": 6, "creation_time": "2021-11-24T20:58:46Z", "height": 564589 },
                { "address": "juno1fyr2mptjswz4w6xmgnpgm93x0q4s4wdl6srv3rtz3utc4f6fmxeql2yarc", "code_id": 6, "fees": 0, "gas": 3003675, "label": "🦄!", "creator": "juno1m7a7nva00p82xr0tssye052r8sxsxvcy2v5qz6", "tx": 29, "creation_time": "2021-11-02T21:36:10Z", "height": 269574 },
                { "address": "juno167kdr740axqh5ugprave863v0lhfvet2w7c04atycrkdg9k6gf4sttwehk", "code_id": 74, "fees": 132500, "gas": 2367609, "label": "Passage", "creator": "juno1lkddxuwvpr5eqavzxju25sqtgdu8gzel2txmdt", "tx": 16, "creation_time": "2021-11-17T17:20:55Z", "height": 459837 },
                { "address": "juno1skuakpnx8gec0avqdr00nl5339k5nc6rplsnr4gtv3ge3q8e2l2qwayda3", "code_id": 179, "fees": 60000, "gas": 1690247, "label": "v0.5", "creator": "juno1754qkhjmpx79swk445zgg5vge2sh33ejzgc28z", "tx": 10, "creation_time": "2021-11-24T10:27:17Z", "height": 558140 },
                { "address": "juno1suhgf5svhu4usrurvxzlgn54ksxmn8gljarjtxqnapv8kjnp4nrsf8smqw", "code_id": 1, "fees": 94749, "gas": 1503809, "label": "NTN CW20", "creator": "juno14vhcdsyf83ngsrrqc92kmw8q9xakqjm0ff2dpn", "tx": 12, "creation_time": "2021-11-01T17:39:51Z", "height": 252900 },
                { "address": "juno1w6tvhn4gsp5wxfzqr08rgvfe29zx06rq92nep5j8scvv5dfl79ws72t4uw", "code_id": 76, "fees": 35000, "gas": 1350299, "label": "WYND Faucet", "creator": "juno1pxa9trxza5e2w7sdk2a0xng86y4fnena4e0pka", "tx": 7, "creation_time": "2021-11-17T20:10:06Z", "height": 461514 },
                { "address": "juno1wjur4gvzn0ccnffyuhvs3qxgsxn6ga86wpd2y8s2ufck4c2zmrfsyn44rq", "code_id": 75, "fees": 65000, "gas": 1348182, "label": "WYND", "creator": "juno1pxa9trxza5e2w7sdk2a0xng86y4fnena4e0pka", "tx": 7, "creation_time": "2021-11-17T18:01:32Z", "height": 460239 },
                { "address": "juno17606cjyj3sr2k9x4n05weyk8fxaa6eq4dlms6uayfex5gr97j87s4rc545", "code_id": 156, "fees": 66665, "gas": 1279855, "label": "cw-dao", "creator": "juno1xatlczsqz2vfwzxwv5try4pxprazveg48efk0k", "tx": 5, "creation_time": "2021-11-21T19:40:14Z", "height": 519595 }
            ],
            "contracts_aggregate": { "aggregate": { "count": 150, "sum": { "gas": 2959069141, "fees": 67427846, "tx": 17531 } } }
        }

    }


    getContracts = async () => {
        return Promise.resolve(this.contract);
    }

}

