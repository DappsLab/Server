import {test_deploy} from "../../helpers/TestWeb3Wrapper";
import {AuthenticationError, ApolloError} from "apollo-server-express"
import {User} from "../../models";
import {find} from "lodash";
import {argumentsValidator, argumentsConvertor} from "../../helpers/ArgumentsValidator"

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
                let returnedArguments;
                if(!newDeploy.argumentsArray){}else{
                    let validation = await argumentsValidator(newDeploy.argumentsArray)
                    if(!validation){
                        return new ApolloError("Arguments Are Invalid", 400)
                    }else{
                        returnedArguments = await argumentsConvertor(newDeploy.argumentsArray)
                    }
                }
                let compiledContract = await TestCompiledContract.findById(newDeploy.testCompiledContractId);
                let response = await User.findById(user.id)
                if(!response){
                    return new ApolloError("User Not Found", '404')
                }
                let testAddress = find(response.testAddress, {'id': newDeploy.testAddressId});
                if(!compiledContract){
                    return new ApolloError("Test Compiled Contract Not Found",404)
                }
                if(compiledContract.user.equals(user.id.toString())){
                    let abi, bytecode;
                    try {
                        const sourceFile = path.resolve('./', 'contracts/compiledContracts/', compiledContract.compiledFile);
                        let sourceCode = JSON.parse(await fs.readFileSync(sourceFile, 'utf8'));
                        let contractsFile = Object.keys(sourceCode.contracts)
                        let contract = Object.keys(sourceCode.contracts[contractsFile[0]])
                        abi = sourceCode.contracts[contractsFile[0]][contract[0]].abi
                    } catch (err) {
                        return new ApolloError("Reading File Failed", 500)
                    }
                    try{
                        const sourceFile = path.resolve('./', 'contracts/compiledContracts/', compiledContract.compiledFile);
                        let sourceCode = JSON.parse(await fs.readFileSync(sourceFile, 'utf8'));
                        let contractsFile = Object.keys(sourceCode.contracts)
                        let contract = Object.keys(sourceCode.contracts[contractsFile[0]])
                        bytecode = sourceCode.contracts[contractsFile[0]][contract[0]].evm.bytecode.object
                    } catch (err) {
                        return new ApolloError("Reading File Failed", 500)
                    }
                    try{
                        let deployData = await test_deploy(abi, bytecode, testAddress.address ,testAddress.wallet.privateKey, returnedArguments);
                        let deployedContract = TestDeployedContract({
                            ...newDeploy,
                            user:user,
                            ownerAddress:testAddress.address,
                            smartContract:compiledContract.smartContract,
                            contractAddress:deployData.contractAddress,
                            transactionAddress:deployData.transactionHash,
                        });
                        await TestCompiledContract.findByIdAndUpdate(compiledContract.id, {$push: {testDeployments: deployedContract.id}},{new:true});
                        if(newDeploy.unlimitedCustomization===false){
                            await TestCompiledContract.findByIdAndUpdate(compiledContract.id, {used: true},{new:true});
                        }
                        return deployedContract.save();
                    }catch (err) {
                        return new ApolloError("Deploying Failed", 500)
                    }
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
