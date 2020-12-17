import {ApolloError} from "apollo-server-express";
import dateTime from "../../helpers/DateTimefunctions";


const {SmartContract, User, TestOrder, TestPurchasedContract, TestCompiledContract, TestLicense} = require('../../models');


let fetchData = () => {
    return TestLicense.find();
}

const resolvers = {
    TestLicense:{
        testCompilations:async(parent)=>{
            return await TestCompiledContract.find({"id":parent.testCompilations}) //! have to change compiled Contracts
        },
        testOrder:async(parent)=>{
            return TestOrder.findOne({"_id": parent.testOrder})
        },
        testPurchasedContract:async(parent)=>{
            return TestPurchasedContract.findOne({"_id": parent.testPurchasedContract})
        },
    },
    Query: {
        licenses:async(_)=>{
            return fetchData();
        },
        licenseById: async (_, {id}) => {
            return TestLicense.findOne({"_id":id})
        },

    },

}

module.exports = resolvers;
