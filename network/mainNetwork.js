import {MAIN_NET_PORT, TEST_MAIN_ADDRESS} from "../config"
import ganache from "ganache-cli"

const accounts = [{
    balance:"0x2710",
    secretKey:TEST_MAIN_ADDRESS
}]
const options = {
    accounts:accounts,
    "default_balance_ether":10000,
    "total_accounts":1,
    "network_id":13936,
    // "account_keys_path":"account_keys.json",
    "port":MAIN_NET_PORT
}
const server = ganache.server(options);
server.listen(MAIN_NET_PORT, function(err, blockchain) {
    console.log("Blockchain:",blockchain)
});
