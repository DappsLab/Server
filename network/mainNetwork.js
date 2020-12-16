import {MAIN_NET_PORT, TEST_MAIN_ADDRESS, MNEMONIC} from "../config"
import ganache from "ganache-cli"

const accounts = [{
    balance:"0x2710",
    secretKey:TEST_MAIN_ADDRESS //* private key
}]
const options = {
    accounts:accounts,
    "default_balance_ether":10000,
    "total_accounts":1,
    "network_id":13936,
    "db_path":"./database/main",
    "port":MAIN_NET_PORT,
    "mnemonic":MNEMONIC,
    "account_keys_path":"./keys/main.key",
}
const server = ganache.server(options);
server.listen(MAIN_NET_PORT, function(err, blockchain) {
    console.log("Blockchain:",blockchain)
});
