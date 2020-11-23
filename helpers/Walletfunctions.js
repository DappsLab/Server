const {MNEMONIC,USERSPATH} =require('../config');
let {hdkey} = require('ethereumjs-wallet');
let bip39 = require("bip39");
let Master = require('../models/master.js')


console.log("MNEMONIC:",MNEMONIC)
let hdwallet=hdkey.fromMasterSeed(bip39.mnemonicToSeedSync(MNEMONIC)); // ! ROOT
console.log("HDwallet:",hdwallet)
let masterPrivateKey=hdwallet._hdkey._privateKey.toString('hex'); //! MASTER PRIVATE KEY
console.log("Master Private Key:",masterPrivateKey)



let walletObject={
    hdwallet:hdwallet,
    masterPrivateKey:masterPrivateKey,
}

// for (let i = 0; i < 5; i++) {
//     let wallet = hdwallet.derivePath(USERSPATH + 0).getWallet();
//     let address = wallet.getAddressString('hex');
//     console.log("public key:",wallet.privateKey.toString('hex'));
//     console.log("wallet2:",wallet);
//     console.log('address-' + 0 + ': ' + address);
// }




module.exports ={walletObject}
