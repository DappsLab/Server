import Web3 from 'web3';
import {MAIN_NET_HTTP} from "../config";
import {test_getBalance} from "./TestWeb3Wrapper";
import {getKeys} from "./KeysGetter";

export const web3 = new Web3(MAIN_NET_HTTP);

export const getBalance = async (address) => {
    return await web3.eth.getBalance(address);
}

export const getAccounts = async () => {
    return await web3.eth.getAccounts();
}

export const getBlockNumber = async () => {
    return await web3.eth.getBlockNumber();
}

export const isSyncing = async () => {
    return await web3.eth.isSyncing()
}


export const getTransactionCount = async (address) => {
    return await web3.eth.getTransactionCount(address)

}

export const getTransaction = async (transactionHash) => {
    return await web3.eth.getTransaction(transactionHash)

}

export const toEth = (wei) => {
    return wei / 1000000000000000000;
}
export const toWei = (eth) => {
    return eth * 1000000000000000000;
}

//250000000000000000
//249958000000000000 -
//000042000000000000 wei per 21000 gas detection
//        2000000000 gasprice

export const signAndSendTransaction = async (to, amount, gas, privateKey) => {
    const Signed = await signTransaction(to, amount, gas, privateKey);
    const receipt = await sendSignedTransaction(Signed.rawTransaction);
    const transaction = await getTransaction(receipt.transactionHash);
    return {signed: Signed, receipt: receipt, transaction: transaction}
}

//* return of signAndSendTransaction()
/*
transaction: {
    signed: {
        messageHash: '0xd9c43c757f77f884352d707cb975d3965ccfd1f6cba40a9bcb3e88947741a44f',
            v: '0x0a95',
            r: '0x42e96976411b8f3aead3cf81d66f9ce409e640fbecdc9df3d7dab11d8863abc4',
            s: '0x4fb50f89336bbc381c74e93e374f103d1347be406e575615e82a40ee61d317bf',
            rawTransaction: '0xf86d80847735940082520894144eb72270820c35c3e4c400beb4a94acbaa9fbe880de0b6b3a764000080820a95a042e96976411b8f3aead3cf81d66f9ce409e640fbecdc9df3d7dab11d8863abc4a04fb50f89336bbc381c74e93e374f103d1347be406e575615e82a40ee61d317bf',
            transactionHash: '0x723096c396e8b18d69f24401e5e1dad67ea4f8e656e8ab2f221d6d9f4d4a9b5e'
    },
    receipt: {
        transactionHash: '0x723096c396e8b18d69f24401e5e1dad67ea4f8e656e8ab2f221d6d9f4d4a9b5e',
            transactionIndex: 0,
            blockHash: '0xaa9f6541c1fac731ff8914cbfe3d1be0b6b5efa1f67c23d5fef0b05d2dae2c70',
            blockNumber: 3,
            from: '0x6082c58424c39b9f80f6572063bcb3605bf9eed7',
            to: '0x144eb72270820c35c3e4c400beb4a94acbaa9fbe',
            gasUsed: 21000,
            cumulativeGasUsed: 21000,
            contractAddress: null,
            logs: [],
            status: true,
            logsBloom: '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    },
    transaction: {
        hash: '0x723096c396e8b18d69f24401e5e1dad67ea4f8e656e8ab2f221d6d9f4d4a9b5e',
            nonce: 0,
            blockHash: '0xaa9f6541c1fac731ff8914cbfe3d1be0b6b5efa1f67c23d5fef0b05d2dae2c70',
            blockNumber: 3,
            transactionIndex: 0,
            from: '0x6082c58424C39B9F80f6572063bCB3605Bf9EeD7',
            to: '0x144EB72270820C35C3e4C400Beb4a94acBaA9FbE',
            value: '1000000000000000000',
            gas: 21000,
            gasPrice: '2000000000',
            input: '0x',
            v: '0xa95',
            r: '0x42e96976411b8f3aead3cf81d66f9ce409e640fbecdc9df3d7dab11d8863abc4',
            s: '0x4fb50f89336bbc381c74e93e374f103d1347be406e575615e82a40ee61d317bf'
    }
}
*/

export const signTransaction = async (to, amount, gas, privateKey) => {
    return await web3.eth.accounts.signTransaction({
        to: to,
        value: amount,
        gas: gas
    }, privateKey);
}

export const sendSignedTransaction = async (rawTx) => {
    return await web3.eth.sendSignedTransaction(rawTx);
}

export const getTransactionReceipt = async (transactionHash) => {
    return await web3.eth.getTransactionReceipt(transactionHash);
}

export const deploy = async (abi, bytecode, address, privateKey, argumentsArray) => {

    let contract = await new web3.eth.Contract(abi);
    let contractTx;
    if (!argumentsArray) {
        contractTx = contract.deploy({data: '0x' + bytecode})
    } else {
        try {
            contractTx = contract.deploy({
                data: '0x' + bytecode,
                arguments: argumentsArray
            })
        } catch (err) {
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
export const airDrop = async (to, amount) => {
    let currentAccount;
    console.log("inside inside")
    let wallet = await getKeys('main.key');
    for (let account of wallet.accounts) {
        if (toEth(await getBalance(account.address)) >= 1000) {
            currentAccount = account
        }
    }
    console.log(currentAccount)
    return signAndSendTransaction(to, amount, "21000", currentAccount.privateKey)
}


// export const getAccounts = async ()=>{
//     return await web3.eth.personal.getAccounts().then(console.log);
// }
(async () => {
    // console.log("Syncing:",await isSyncing())
    // console.log("latest",await web3.eth.getBlock('latest'))
    // console.log(await getTransactionCount("0x1036970AD593e3033425153e5B3270829068946b"))
    // console.log("Transaction:",await getTransactionReceipt('0xe497f617c18cc658084a1178c0d5e7d19fe7bcfddfe553363812e884287c9a42'))
    // console.log("Balance",await getBalance("0xdf34f666d96a9d65cd201a8a95950446a5ce8af2"));
    // console.log("test results:",await signTransaction("0xb19484680E1b8B0A85Ce713A85161e514Ef5fC7C","1000000000","1000","ab0a28843ec54420f179d029ec150e48ac7f2b3296c58a7db313fd35686e111a"))
    // const  data = await signAndSendTransaction("0x144eb72270820c35c3e4c400beb4a94acbaa9fbe", toWei(1).toString(), "21000", "73aebfad9a730b2ec912a408e9deeb9bf7978bdf7af255915d36401425db8e23")
    // console.log("transaction:",data)
    // console.log("recovered",await web3.eth.getTransactionReceipt(data.receipt.transactionHash));
    // console.log("test results:",await sendTransaction("0xb19484680E1b8B0A85Ce713A85161e514Ef5fC7C","0x32d31e8060f7a1255226988b1f522da0112ac59f","1000"))
})();
