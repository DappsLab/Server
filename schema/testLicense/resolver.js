import {ApolloError} from "apollo-server-express";
import dateTime from "../../helpers/DateTimefunctions";


const {SmartContract, User, TestOrder, TestPurchasedContract, TestCompiledContract, TestLicense} = require('../../models');


let fetchData = () => {
    return TestLicense.find();
}

const resolvers = {
    TestLicense:{
        testCompilations:async(parent)=>{
            return await TestCompiledContract.find({"id":parent.testCompilations})
        },
        testOrder:async(parent)=>{
            return TestOrder.findOne({"_id": parent.testOrder})
        },
        testPurchasedContract:async(parent)=>{
            return TestPurchasedContract.findOne({"_id": parent.testPurchasedContract})
        },
    },
    Query: {
        testLicenses:async(_)=>{
            return fetchData();
        },
        testLicenseById: async (_, {id}) => {
            return TestLicense.findOne({"_id":id})
        },

    },

}

module.exports = resolvers;
