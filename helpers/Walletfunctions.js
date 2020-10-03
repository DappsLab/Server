const {MNEMONIC,PATH} =require('../config');
let {hdkey} = require('ethereumjs-wallet');
let bip39 = require("bip39");


console.log("MNEMONIC:",MNEMONIC)
let hdwallet=hdkey.fromMasterSeed(bip39.mnemonicToSeedSync(MNEMONIC)); // ! ROOT
console.log("HDwallet:",hdwallet)
let masterPrivateKey=hdwallet._hdkey._privateKey.toString('hex'); //! MASTER PRIVATE KEY
console.log("Master Private Key:",masterPrivateKey)


let walletObject={
    hdwallet:hdwallet,
    masterPrivateKey:masterPrivateKey,
}
let wallet = hdwallet.derivePath(PATH + '1').getWallet();
let address = wallet.getAddressString();
console.log("address:",address);


module.exports ={walletObject}