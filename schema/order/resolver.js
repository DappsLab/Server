import {ApolloError} from "apollo-server-express";
import dateTime from "../../helpers/DateTimefunctions";
import {getBalance, signAndSendTransaction, toEth} from "../../helpers/Web3Wrapper";
import {Master} from "../../models";

const {SmartContract,User} = require('../../models');



let fetchData = ()=>{
    return SmartContract.find().populate('publisher').populate('verifiedBy');
}

const resolvers = {
    Query: {

    },
    Mutation:{
        placeOrder: async (_, {newOrder},{Order,user}) => {
            if(newOrder.productType==="SMARTCONTRACT"){
                let smartContract = await SmartContract.findById(newOrder.smartContract);
                let price;
                if(newOrder.licenseType==="SINGLELICENSE"){
                    price = smartContract.singleLicensePrice;
                }else if(newOrder.licenseType==="UNLIMITEDLICENSE"){
                    price= smartContract.unlimitedLicensePrice;
                }else{

                }
                //todo verify user account
                let balance = await getBalance(user.address)
                if(toEth(balance)>=(price+newOrder.fee)){

                    // todo create address
                    let master = await Master.findOne({})
                    let wallet = walletObject.hdwallet.derivePath(ORDERSPATH + master.orderCount).getWallet();
                    let address = wallet.getAddressString();
                    master.orderCount = (parseInt(master.orderCount) + 1).toString();
                    // * changed from id top master.id
                    const response = await Master.findByIdAndUpdate(master.id, master, {new: true});
                    console.log("response", response);

                    let order = Order({
                        ...newOrder,
                        user:user.id,
                        price:price,
                        dateTime:dateTime(),
                        address: address,
                        wallet:{
                            privateKey : wallet.getPrivateKeyString(),
                            publicKey :wallet.getPublicKeyString(),
                        }
                    });

                    try{
                        let tx = await signAndSendTransaction(address,price,newOrder.fee,user.wallet.privateKey)
                    }catch(err){
                        console.log(err)
                    }
                }else{
                    //todo return low balance error
                }




            }
        }
    }
}

module.exports = resolvers;
