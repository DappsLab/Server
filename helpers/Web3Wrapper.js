import Web3 from 'web3';
import {MAIN_NET_HTTP} from "../config";
import {test_getBalance} from "./TestWeb3Wrapper";
import {getKeys} from "./KeysGetter";

export const web3 = new Web3(MAIN_NET_HTTP);

export const getBalance = async(address)=>{
    return await web3.eth.getBalance(address);
}

export const getAccounts = async()=>{
    return await web3.eth.getAccounts();
}

export const getBlockNumber = async()=>{
    return await web3.eth.getBlockNumber();
}

export const isSyncing = async()=>{
    return await web3.eth.isSyncing()
}


export const getTransactionCount = async(address)=>{
    return await web3.eth.getTransactionCount(address)

}

export const getTransaction = async(transactionHash)=>{
    return await web3.eth.getTransaction(transactionHash)

}

export const toEth= (wei)=>{
    return wei/1000000000000000000;
}
export const toWei=  (eth)=>{
    return eth*1000000000000000000;
}
export const signAndSendTransaction= async (to,amount,gas,privateKey)=>{
   const Signed = await signTransaction(to,amount,gas,privateKey);
   const receipt = await sendSignedTransaction(Signed.rawTransaction);
   const transaction = await getTransaction(receipt.transactionHash);
   return {signed:Signed,receipt:receipt,transaction:transaction}
}

export const signTransaction = async (to,amount,gas,privateKey)=>{
    // return await web3.eth.sendTransaction({from: fromAccount, to: toAmount, value:amount});
    return await web3.eth.accounts.signTransaction({
        to: to,
        value:amount,
        gas: gas
    }, privateKey);
}

export const sendSignedTransaction= async (rawTx)=>{
    return await web3.eth.sendSignedTransaction(rawTx);
}

export const getTransactionReceipt= async (transactionHash)=>{
    return await web3.eth.getTransactionReceipt(transactionHash);
}

export const deploy = async (abi, bytecode, address, privateKey, argumentsArray) => {

    let contract = await new web3.eth.Contract(abi);
    let contractTx;
    if (!argumentsArray) {
        contractTx = contract.deploy({data: '0x' + bytecode})
    } else {
        try{
            contractTx = contract.deploy({
                data: '0x' + bytecode,
                arguments:argumentsArray
            })
        }catch (err) {
            console.log(err)
        }
    }
    const createTransaction = await web3.eth.accounts.signTransaction(
        {
            from: address,
            data: contractTx.encodeABI(),
            gas: await contractTx.estimateGas(),
        },
        privateKey
    );
    const createReceipt = await web3.eth.sendSignedTransaction(
        createTransaction.rawTransaction
    );
    console.log(`Contract deployed at address ${createReceipt.contractAddress}`);
    return createReceipt;

};
export const airDrop = async (to, amount)=>{
    let currentAccount;
    console.log("inside inside")
    let wallet = await getKeys('main.key');
    for (let account of wallet.accounts) {
        if (toEth(await getBalance(account.address)) >= 1000) {
            currentAccount = account
        }
    }
    console.log(currentAccount)
    return signAndSendTransaction(to,amount,"21000",currentAccount.privateKey)
}


// export const getAccounts = async ()=>{
//     return await web3.eth.personal.getAccounts().then(console.log);
// }
(async()=>{
    // console.log("Syncing:",await isSyncing())
    // console.log("latest",await web3.eth.getBlock('latest'))
    // console.log(await getTransactionCount("0x1036970AD593e3033425153e5B3270829068946b"))
    // console.log("Transaction:",await getTransactionReceipt('0xe497f617c18cc658084a1178c0d5e7d19fe7bcfddfe553363812e884287c9a42'))
    // console.log("Balance",await getBalance("0xdf34f666d96a9d65cd201a8a95950446a5ce8af2"));
    // console.log("test results:",await signTransaction("0xb19484680E1b8B0A85Ce713A85161e514Ef5fC7C","1000000000","1000","ab0a28843ec54420f179d029ec150e48ac7f2b3296c58a7db313fd35686e111a"))
    // const  data = await signAndSendTransaction("0x144eb72270820c35c3e4c400beb4a94acbaa9fbe", toWei(5).toString(), "21000", "469e3bf658daf03f5f661db7ae7ecee8f50b9966d588a1c784b602fabea8659d")
    // console.log("transaction:",data)
    // console.log("recovered",await web3.eth.getTransactionReceipt(data.receipt.transactionHash));
    // console.log("test results:",await sendTransaction("0xb19484680E1b8B0A85Ce713A85161e514Ef5fC7C","0x32d31e8060f7a1255226988b1f522da0112ac59f","1000"))
})();
