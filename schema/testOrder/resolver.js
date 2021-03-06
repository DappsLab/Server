import {ApolloError, AuthenticationError} from "apollo-server-express";
import dateTime from "../../helpers/DateTimefunctions";
import {
    test_getBalance,
    test_getTransactionReceipt,
    test_Request5DAppCoin,
    test_signAndSendTransaction,
    test_toEth
} from "../../helpers/TestWeb3Wrapper";
import {Master} from "../../models";
import {walletObject} from "../../helpers/Walletfunctions";
import {TESTORDERSPATH} from "../../config";
import {find} from "lodash";
import {toWei} from "../../helpers/Web3Wrapper";
import {getKeys} from "../../helpers/KeysGetter";

const {SmartContract, User, TestOrder} = require('../../models');


let fetchData = () => {
    return TestOrder.find();
}

const resolvers = {
    TestOrder: {
        user: async (parent) => {
            return User.findOne({"_id": parent.user})
        },
        smartContract: async (parent) => {
            return SmartContract.findOne({"_id": parent.smartContract})
        },
        testAddress: async (parent) => {
            let response = await User.findById(parent.user)
            let testAddress = find(response.testAddress, {'_id': parent.testAddress});
            return testAddress;
        },
    },
    Query: {
        testOrders: async (_) => {
            return fetchData();
        },
        testOrderById: async (_, {id}) => {
            return await TestOrder.findById(id);
        },
        verifyTestOrder: async (_, {id}, {user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                let order = await TestOrder.findById(id);
                if (!order) {
                    return new ApolloError("Order Not Found", 404)
                }

                let receipt = await test_getTransactionReceipt(order.transactionHash);
                if (receipt.status) {
                    console.log("inside:",receipt.status)
                    let balance = await test_getBalance(order.address) // returns in wei
                    if (balance > (42000000000000)) {
                        let mainAccountWallet = await getKeys('test.key')
                        let balanceToMain = parseFloat(balance) - 42000000000000;
                        let publisherReceipt = await test_signAndSendTransaction(mainAccountWallet.accounts[0].address, balanceToMain.toString(), '21000', order.wallet.privateKey)
                        order.transactionToPublisher = publisherReceipt.receipt.transactionHash;
                        order.save();
                    }
                    return !!receipt.status;
                } else {
                    return false;
                }
            } catch (err) {
                throw new ApolloError("Internal Server Error", 500)
            }
        },

    },
    Mutation: {
        placeTestOrder: async (_, {newOrder}, {TestOrder, user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            if (newOrder.productType === "SMARTCONTRACT") {
                let smartContract = await SmartContract.findById(newOrder.smartContract);
                if (!smartContract) {
                    return new ApolloError("SmartContract Not Found", 404)
                }
                let price;
                if (newOrder.licenseType === "SINGLELICENSE") {
                    price = smartContract.singleLicensePrice;
                } else if (newOrder.licenseType === "UNLIMITEDLICENSE") {
                    price = smartContract.unlimitedLicensePrice;
                } else {

                }
                let testAddress = find(user.testAddress, {'id': newOrder.testAddress});
                if (!testAddress) {
                    return new ApolloError("Test Address Not Found", 404)
                }
                // console.log("testAddress:", testAddress)
                let balance = await test_getBalance(testAddress.address)
                if (test_toEth(balance) >= (parseFloat(price) + parseFloat(test_toEth(newOrder.fee)))) {
                    let master = await Master.findOne({})
                    if (!master) {
                        return new ApolloError("Master Not Found", 404)
                    }
                    let wallet = walletObject.hdwallet.derivePath(TESTORDERSPATH + master.testOrderCount).getWallet();
                    let address = wallet.getAddressString();
                    master.testOrderCount = (parseInt(master.testOrderCount) + 1).toString();
                    // * changed from id top master.id
                    await Master.findByIdAndUpdate(master.id, master, {new: true});

                    try {
                        let tx = await test_signAndSendTransaction(address, toWei(parseFloat(price)).toString(), newOrder.fee, testAddress.wallet.privateKey)

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

                        let response = await User.findById(user.id);
                        response.testOrders.push(orderResponse._id);
                        response.save();
                        return orderResponse
                    } catch (err) {
                        throw new ApolloError("Internal Server Error", '500');
                    }
                } else {
                    throw new ApolloError("Low Balance");
                }

            } else {
                return new ApolloError("Product Type Should Be SmartContract Only")
            }

        },

    }
}

module.exports = resolvers;
