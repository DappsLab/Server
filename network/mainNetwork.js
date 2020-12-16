import {MAIN_NET_PORT, TEST_MAIN_ADDRESS} from "../config"
import ganache from "ganache-cli"

const accounts = [{
    balance:"0x2710",
    secretKey:TEST_MAIN_ADDRESS //* private key
    //! what are the other keys here!
    //! Can i get same address with same private key, because when ever i run, i pass same private key
    //! but the generated address is different. I want it same. Is that possible?
}]
const options = {
    accounts:accounts,
    "default_balance_ether":10000,
    "total_accounts":1,
    "network_id":13936,
    "db_path":"./database/main",
    "port":MAIN_NET_PORT,
    "mnemonic":"garden betray unhappy wine stomach narrow horse save token dial portion okay tree saddle apart",
    "account_keys_path":"./keys/main.key",
}
const server = ganache.server(options);
server.listen(MAIN_NET_PORT, function(err, blockchain) {
    console.log("Blockchain:",blockchain)
});
