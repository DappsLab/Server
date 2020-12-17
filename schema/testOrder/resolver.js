import {ApolloError} from "apollo-server-express";
import dateTime from "../../helpers/DateTimefunctions";
import {test_getBalance, test_getTransactionReceipt, test_signAndSendTransaction, test_toEth} from "../../helpers/TestWeb3Wrapper";
import {Master} from "../../models";
import {walletObject} from "../../helpers/Walletfunctions";
import {TESTORDERSPATH} from "../../config";
import {find} from "lodash";

const {SmartContract, User, TestOrder} = require('../../models');


let fetchData = () => {
    return TestOrder.find();
}

const resolvers = {
    TestOrder: {
        user: async (parent) => {
            return await User.findOne({"_id": parent.user})
        },
        smartContract: async (parent) => {
            return await SmartContract.findOne({"_id": parent.smartContract})
        },
    },
    Query: {
        testOrders: async (_) => {
            return fetchData();
        },
        verifyTestOrder: async (_, {id}) => {
            let order = await TestOrder.findById(id);
            let receipt = await test_getTransactionReceipt(order.transactionHash);

            return !!receipt.status;

        },
        testOrderById: async (_, {id}) => {
            return await TestOrder.findById(id);
        },

    },
    Mutation: {
        placeTestOrder: async (_, {newOrder}, {TestOrder, user}) => {
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
                let testAddress = find(user.testAddress, { 'id': newOrder.testAddressId});
                console.log("testAddress:",testAddress)

                let balance = await test_getBalance(testAddress.address)
                console.log("total Price:", (parseFloat(price) + parseFloat(test_toEth(newOrder.fee))))
                if (test_toEth(balance) >= (parseFloat(price) + parseFloat(test_toEth(newOrder.fee)))) {
                    // todo create address
                    let master = await Master.findOne({})
                    let wallet = walletObject.hdwallet.derivePath(TESTORDERSPATH + master.testOrderCount).getWallet();
                    let address = wallet.getAddressString();
                    master.testOrderCount = (parseInt(master.testOrderCount) + 1).toString();
                    // * changed from id top master.id
                    const response = await Master.findByIdAndUpdate(master.id, master, {new: true});

                    try {
                        let tx
                        console.log("towei:", test_toEth(newOrder.fee))

                        tx = await test_signAndSendTransaction(address, price, newOrder.fee, testAddress.wallet.privateKey)
                        console.log("transactions", tx)

                        let order = TestOrder({
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

                        try {
                            let response = await User.findById(user.id);
                            response.testOrders.push(orderResponse._id);
                            response.save();
                            // console.log("hello to response:",response);
                        } catch (e) {
                            console.log("error:", e)
                        }

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

            } else {

            }

        },

    }
}

module.exports = resolvers;
