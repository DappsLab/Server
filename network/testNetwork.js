import {TEST_NET_PORT, TEST_NET_ADDRESS} from "../config"
import ganache from "ganache-cli"

const accounts = [{
    balance:"0x01ed09bead87c0378d8e6400000000",
    secretKey:TEST_NET_ADDRESS
}]
const options = {
    accounts:accounts,
    "default_balance_ether":10000000000000000,
    "total_accounts":1,
    "network_id":13937,
    "port":TEST_NET_PORT
}
const server = ganache.server(options);
server.listen(TEST_NET_PORT, function(err, blockchain) {
    console.log("Blockchain:",blockchain)
});
