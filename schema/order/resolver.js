import {ApolloError} from "apollo-server-express";
import dateTime from "../../helpers/DateTimefunctions";
import {getBalance, getTransactionReceipt, signAndSendTransaction, toEth, toWei} from "../../helpers/Web3Wrapper";
import {Master} from "../../models";
import {walletObject} from "../../helpers/Walletfunctions";
import {ORDERSPATH} from "../../config";

const {SmartContract, User, Order} = require('../../models');


let fetchData = () => {
    return SmartContract.find().populate('publisher').populate('verifiedBy');
}

const resolvers = {
    Query: {
        verifyOrder: async (_, {id}) => {
            let order = await Order.findById(id);
            let receipt = await getTransactionReceipt(order.transactionHash);

            return !!receipt.status;

        },

    },
    Mutation: {
        placeOrder: async (_, {newOrder}, {Order, user}) => {
            if (newOrder.productType === "SMARTCONTRACT") {
                console.log("newOrder:", newOrder)
                let smartContract = await SmartContract.findById(newOrder.smartContract);
                let price;
                if (newOrder.licenseType === "SINGLELICENSE") {
                    price = smartContract.singleLicensePrice;
                } else if (newOrder.licenseType === "UNLIMITEDLICENSE") {
                    price = smartContract.unlimitedLicensePrice;
                } else {

                }
                //todo verify user account
                let balance = await getBalance(user.address)
                console.log("total Price:", (parseFloat(price) + parseFloat(toEth(newOrder.fee))))
                if (toEth(balance) >= (parseFloat(price) + parseFloat(toEth(newOrder.fee)))) {
                    // todo create address
                    let master = await Master.findOne({})
                    let wallet = walletObject.hdwallet.derivePath(ORDERSPATH + master.orderCount).getWallet();
                    let address = wallet.getAddressString();
                    master.orderCount = (parseInt(master.orderCount) + 1).toString();
                    // * changed from id top master.id
                    const response = await Master.findByIdAndUpdate(master.id, master, {new: true});

                    try {
                        let tx
                        console.log("towei:", toEth(newOrder.fee))

                        tx = await signAndSendTransaction(address, price, newOrder.fee, user.wallet.privateKey)
                        console.log("transactions", tx)

                        let order = Order({
                            ...newOrder,
                            user: user.id,
                            price: price,
                            fee: newOrder.fee.toString(),
                            dateTime: dateTime(),
                            address: address,
                            transactionHash: tx.receipt.transactionHash,
                            wallet: {
                                privateKey: wallet.getPrivateKeyString(),
                                publicKey: wallet.getPublicKeyString(),
                            }
                        });
                        let orderResponse = await order.save();
                        console.log("order:", order);
                        return orderResponse
                    } catch (err) {
                        console.log(err)
                        console.log("error", err)
                        throw new ApolloError(err.message);
                    }
                } else {
                    //todo return low balance error
                    throw new ApolloError("Low Balance");
                }

            }

        },

    }
}

module.exports = resolvers;
