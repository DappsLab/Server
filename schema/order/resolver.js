import {ApolloError, AuthenticationError} from "apollo-server-express";
import dateTime from "../../helpers/DateTimefunctions";
import {getBalance, getTransactionReceipt, signAndSendTransaction, toEth} from "../../helpers/Web3Wrapper";
import {Master} from "../../models";
import {walletObject} from "../../helpers/Walletfunctions";
import {ORDERSPATH} from "../../config";

const {SmartContract, User, Order, DApp} = require('../../models');

let fetchData = () => {
    return Order.find();
}

const resolvers = {
    Order: {
        user: async (parent) => {
            return User.findOne({"_id": parent.user})
        },
        smartContract: async (parent) => {
            return SmartContract.findOne({"_id": parent.smartContract})
        },
        dApp: async (parent) => {
            return DApp.findOne({"_id": parent.dApp})
        },
    },
    Query: {
        orders: async (_) => {
            return fetchData();
        },
        verifyOrder: async (_, {id}, {user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                let order = await Order.findById(id);
                if (!order) {
                    return new ApolloError("Order Not Found", 404)
                }
                let receipt = await getTransactionReceipt(order.transactionHash);
                return !!receipt.status;
            } catch (err) {
                throw new ApolloError("Internal Server Error", 500)
            }
        },
        orderById: async (_, {id}) => {
            return await Order.findById(id);
        },

    },
    Mutation: {
        placeOrder: async (_, {newOrder}, {Order, user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                if (newOrder.productType === "SMARTCONTRACT") {
                    let smartContract = await SmartContract.findById(newOrder.smartContract);
                    let price;
                    if (newOrder.licenseType === "SINGLELICENSE") {
                        price = smartContract.singleLicensePrice;
                    } else if (newOrder.licenseType === "UNLIMITEDLICENSE") {
                        price = smartContract.unlimitedLicensePrice;
                    } else {
                        return new ApolloError("Not Acceptable", 406)
                    }
                    /// verify user account
                    let balance = await getBalance(user.address)
                    if (toEth(balance) >= (parseFloat(price) + parseFloat(toEth(newOrder.fee)))) {
                        let master = await Master.findOne({})
                        let wallet = walletObject.hdwallet.derivePath(ORDERSPATH + master.orderCount).getWallet();
                        let address = wallet.getAddressString();
                        master.orderCount = (parseInt(master.orderCount) + 1).toString();
                        await Master.findByIdAndUpdate(master.id, master, {new: true});

                        let tx = await signAndSendTransaction(address, price, newOrder.fee, user.wallet.privateKey)
                        let order = Order({
                            ...newOrder,
                            user: user.id,
                            price: price,
                            status: tx.receipt.status,
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
                        let response = await User.findById(user.id);
                        response.orders.push(orderResponse._id);
                        response.save();
                        return orderResponse
                    } else {
                        return new ApolloError("Low Balance", 402);
                    }
                } else if (newOrder.productType === "DAPP") {
                    let dApp = await DApp.findById(newOrder.dApp);
                    if (!dApp) {
                        return new ApolloError("DApp Not Found", 404)
                    }
                    let price = dApp.singleLicensePrice;
                    let balance = await getBalance(user.address)
                    if (toEth(balance) >= (parseFloat(price) + parseFloat(toEth(newOrder.fee)))) {
                        let master = await Master.findOne({})
                        let wallet = walletObject.hdwallet.derivePath(ORDERSPATH + master.orderCount).getWallet();
                        let address = wallet.getAddressString();
                        master.orderCount = (parseInt(master.orderCount) + 1).toString();
                        await Master.findByIdAndUpdate(master.id, master, {new: true});
                        let tx = await signAndSendTransaction(address, price, newOrder.fee, user.wallet.privateKey)
                        let order = Order({
                            ...newOrder,
                            user: user.id,
                            price: price,
                            status: tx.receipt.status,
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
                        let response = await User.findById(user.id);
                        response.orders.push(orderResponse._id);
                        response.save();
                        return orderResponse
                    } else {
                        return new ApolloError("Low Balance", 402);
                    }
                } else {
                    return new ApolloError("Not Acceptable", 406)
                }
            } catch (err) {
                return new ApolloError("Internal Server Error", 500)
            }

        },

    }
}

module.exports = resolvers;
