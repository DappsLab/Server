import Web3 from 'web3';
import {TEST_NET_HTTP} from "../config";
import {toWei} from "./Web3Wrapper";

import {getKeys} from "./KeysGetter";
let currentAccount={};

(async()=>{
    let wallet = await getKeys('test.key')
    // console.log("real Wallet:", wallet)
    for(let account of wallet.accounts){
        // console.log("Balance of loops:",await test_getBalance(account.address))
        if(await test_getBalance(account.address)>= 5){
            currentAccount = account
        }
    }
})()

export const web3 = new Web3(TEST_NET_HTTP);




export const test_isSyncing = async()=>{
    return await web3.eth.isSyncing()
}


export const test_getBlockNumber = async()=>{
    return await web3.eth.getBlockNumber();
}
export const test_getAccounts = async()=>{
    return await web3.eth.getAccounts();
}
export const test_getBalance = async(address) => {
    return await web3.eth.getBalance(address)
}

export const test_getTransactionCount = async(address)=>{
    return await web3.eth.getTransactionCount(address)

}

export const test_getTransaction = async(transactionHash)=>{
    return await web3.eth.getTransaction(transactionHash)

}

export const test_toEth= (wei)=>{
    return wei/1000000000000000000;
}
export const test_toWei=  (eth)=>{
    return eth*1000000000000000000;
}
export const test_signAndSendTransaction= async (to,amount,gas,privateKey)=>{
   const Signed = await test_signTransaction(to,amount,gas,privateKey);
   const receipt = await test_sendSignedTransaction(Signed.rawTransaction);
   const transaction = await test_getTransaction(receipt.transactionHash);
   return {signed:Signed,receipt:receipt,transaction:transaction}
}

export const test_signTransaction = async (to,amount,gas,privateKey)=>{
    // return await web3.eth.sendTransaction({from: fromAccount, to: toAmount, value:amount});
    return await web3.eth.accounts.signTransaction({
        to: to,
        value:amount,
        gas: gas
    }, privateKey);
}

export const test_sendSignedTransaction= async (rawTx)=>{
    return await web3.eth.sendSignedTransaction(rawTx);
}

export const test_getTransactionReceipt= async (transactionHash)=>{
    return await web3.eth.getTransactionReceipt(transactionHash);
}

export const test_deploy = async (abi, bytecode, argumentsArray, address)=>{
    let contract = await new web3.eth.Contract(JSON.parse(abi))
        .deploy({data:'0x'+bytecode,arguments:argumentsArray})
        .send({from:address});
    return contract;
};

 export const test_Request5DAppCoin = async(address)=>{
     // console.log("Test main Balance", await test_getBalance(currentAccount.address))
    return await test_signAndSendTransaction(address, toWei(5).toString(), "21000", currentAccount.privateKey)
}
// export const getAccounts = async ()=>{
//     return await web3.eth.personal.getAccounts().then(console.log);
// }
(async()=>{
    // console.log("Syncing:",await isSyncing())
    // console.log("latest",await web3.eth.getBlock('latest'))
    // console.log(await getTransactionCount("0x1036970AD593e3033425153e5B3270829068946b"))
    // console.log("Transaction:",await getTransactionReceipt('0xe497f617c18cc658084a1178c0d5e7d19fe7bcfddfe553363812e884287c9a42'))
    // return await test_signAndSendTransaction("0x73bd8cf6792963edefd1568f497662413744b606", toWei(5).toString(), "21000", currentAccount.privateKey)
    // console.log("Test main Balance", await test_getBalance("0xdf34f666d96a9d65cd201a8a95950446a5ce8af2"))
    // console.log("test results:",await signTransaction("0xb19484680E1b8B0A85Ce713A85161e514Ef5fC7C","1000000000","1000","ab0a28843ec54420f179d029ec150e48ac7f2b3296c58a7db313fd35686e111a"))
    // const  data = await signAndSendTransaction("0x144eb72270820c35c3e4c400beb4a94acbaa9fbe", toWei(5).toString(), "21000", "469e3bf658daf03f5f661db7ae7ecee8f50b9966d588a1c784b602fabea8659d")
    // console.log("transaction:",data)
    // console.log("recovered",await web3.eth.getTransactionReceipt(data.receipt.transactionHash));

    // console.log("test results:",await sendTransaction("0xb19484680E1b8B0A85Ce713A85161e514Ef5fC7C","0x32d31e8060f7a1255226988b1f522da0112ac59f","1000"))
})();
