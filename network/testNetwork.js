import {TEST_NET_PORT, TEST_NET_ADDRESS, MNEMONIC, MAIN_NET_ADDRESS} from "../config"
import ganache from "ganache-cli"

const accounts = [{
    balance:"0x1ED09BEAD87C0378D8E6400000000",
    secretKey:MAIN_NET_ADDRESS //* private key
}]
const options = {
    accounts:accounts,
    "port":7546,
    // "default_balance_ether":10000000000000000,
    "total_accounts":1,
    "network_id":13936,
    "db_path":"./database/test",
    "mnemonic":MNEMONIC,
    "account_keys_path":"./keys/test.key",
}
const server = ganache.server(options);
server.listen(TEST_NET_PORT, function(err, blockchain) {
    console.log("Blockchain:",blockchain)
});
