import {ApolloError} from "apollo-server-express";
import dateTime from "../../helpers/DateTimefunctions";


const {SmartContract, User, Order, PurchasedContract, CompiledContract, License} = require('../../models');


let fetchData = () => {
    return License.find();
}

const resolvers = {
    License:{
        compilations:async(parent)=>{
            return await CompiledContract.find({"id":parent.compilations}) //! have to change compiled Contracts
        },
        order:async(parent)=>{
            return Order.findOne({"_id": parent.order})
        },
        purchasedContract:async(parent)=>{
            return PurchasedContract.findOne({"_id": parent.purchasedContract})
        },
        purchasedDApp:async(parent)=>{
            return PurchasedDApp.findOne({"_id": parent.purchasedContract})
        },
    },
    Query: {
        licenses:async(_)=>{
            return fetchData();
        },
        licenseById: async (_, {id}) => {
            return License.findOne({"_id":id})
        },

    },

}

module.exports = resolvers;
