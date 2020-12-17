import {deploy} from "../../helpers/Web3Wrapper";

const {SmartContract, User, TestOrder, TestCompiledContract,TestPurchasedContract, TestLicense, TestDeployedContract} = require('../../models');
const path = require('path');
const fs = require('fs');
const sol=require("solc");

let fetchData = () => {
    return TestDeployedContract.find();
}

const resolvers = {
    TestDeployedContract:{
        testCompiledContract:async (parent)=>{
            return await TestCompiledContract.findOne({"_id":parent.testCompiledContract})
        },
        smartContract:async(parent)=>{
            return await SmartContract.findOne({"_id": parent.smartContract})
        },
    },
    Query: {
        testDeployedContracts:async (_)=>{
            return await fetchData();
        },
        testDeployedContractById:async(_,{id})=>{

            return await TestDeployedContract.findById(id);
        },
    },
    Mutation: {
        testDeployContract:async (_,{compiledContractId},{user})=>{
            let compiledContract = await TestCompiledContract.findById(compiledContractId);
            if(compiledContract.user === user.id){
                let deployData = await deploy();
            }else{
                //! error Unauthorized user
            }
        },
    }
}

module.exports = resolvers;
