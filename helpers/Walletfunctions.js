const {MNEMONIC} =require('../config');
let {hdkey} = require('ethereumjs-wallet');
let bip39 = require("bip39");
import {Master} from '../models'


let hdwallet=hdkey.fromMasterSeed(bip39.mnemonicToSeedSync(MNEMONIC)); // ! ROOT
let masterPrivateKey=hdwallet._hdkey._privateKey.toString('hex'); //! MASTER PRIVATE KEY


let walletObject = {
    hdwallet:hdwallet,
    masterPrivateKey:masterPrivateKey,
}
const checkMaster = async () => {
    try {
        let response = await Master.findOne({});
        if(!response){
            let master = Master({
                mnemonic:MNEMONIC,
                hdwallet:walletObject,
                walletCount:"1",
                orderCount:"1",
                testCount:"1",
                testOrderCount:"1"
            });
            await master.save();
            console.log("Master Created:", master.walletCount,"\norderCount: ",master.orderCount,"\ntestCount: ",master.testCount,"\ntestOrderCount:",master.testOrderCount)
        }else if(isNaN(response.walletCount)||response.walletCount===null){
            let master = {
                mnemonic:MNEMONIC,
                hdwallet:walletObject,
                walletCount:"1",
                orderCount:"1",
                testCount:"1",
                testOrderCount:"1"
            }
            response = await Master.findByIdAndUpdate(response.id,master,{new:true});
            console.log("Master Created:",response.walletCount,"\norderCount: ",response.orderCount,"\ntestCount: ",response.testCount,"\ntestOrderCount:",response.testOrderCount)
        }else{
            console.log("Master Loaded:", response.walletCount,"\norderCount: ",response.orderCount,"\ntestCount: ",response.testCount,"\ntestOrderCount:",response.testOrderCount)
        }
    }catch(e) {
        console.log('error:',e);
    }
}



module.exports ={walletObject, checkMaster}
