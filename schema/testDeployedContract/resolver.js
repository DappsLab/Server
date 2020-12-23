import {test_deploy} from "../../helpers/TestWeb3Wrapper";
import {AuthenticationError, ApolloError} from "apollo-server-express"
import {User} from "../../models";
import {find} from "lodash";

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
        testDeployContract:async (_,{newDeploy},{user})=>{
            if(!user){
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try{
                let compiledContract = await TestCompiledContract.findById(newDeploy.testCompiledContractId);
                let response = await User.findById(user.id)
                if(!response){
                    return new ApolloError("User Not Found", '404')
                }
                let testAddress = find(response.testAddress, {'id': newDeploy.testAddressId});
                if(!compiledContract){
                    return new ApolloError("Test Compiled Contract Not Found",'404')
                }
                if(compiledContract.user === user.id){
                    let abi, bytecode;
                    try{
                        const sourceFile = path.resolve ( './' ,'contracts/compiledContracts/',compiledContract.compiledFile);
                        let sourceCode = JSON.parse(await fs.readFileSync (sourceFile,'utf8'));
                         abi = sourceCode.interface;
                    }catch (err) {
                        return new ApolloError("Reading File Failed", 500)
                    }
                    try{
                        const sourceFile = path.resolve ( './' ,'contracts/compiledContracts/',compiledContract.compiledFile);
                        let sourceCode = JSON.parse(await fs.readFileSync (sourceFile,'utf8'));
                        bytecode = sourceCode.bytecode;
                    }catch (err) {
                        return new ApolloError("Reading File Failed", 500)
                    }
                    let deployData = await test_deploy(abi, bytecode, newDeploy.argumentsArray, testAddress.address);
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
