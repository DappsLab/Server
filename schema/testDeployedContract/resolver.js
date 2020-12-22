import {deploy} from "../../helpers/Web3Wrapper";
import {AuthenticationError, ApolloError} from "apollo-server-express"

const {SmartContract, TestCompiledContract, TestDeployedContract} = require('../../models');
const path = require('path');
const fs = require('fs');
const sol=require("solc");

let fetchData = () => {
    return TestDeployedContract.find();
}

const resolvers = {
    TestDeployedContract:{
        testCompiledContract:async (parent)=>{
            return TestCompiledContract.findOne({"_id":parent.testCompiledContract})
        },
        smartContract:async(parent)=>{
            return SmartContract.findOne({"_id": parent.smartContract})
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
            if(!user){
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try{
                let compiledContract = await TestCompiledContract.findById(compiledContractId);
                if(!compiledContract){
                    return new ApolloError("Test Compiled Contract Not Found",'404')
                }
                if(compiledContract.user === user.id){
                    let deployData = await deploy();
                }else{
                    return new AuthenticationError("UnAuthorized", '401')
                }
            }catch (err) {
                throw new ApolloError("Internal Server Error", '500')
            }

        },
    }
}

module.exports = resolvers;
