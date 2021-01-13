import {deploy} from "../../helpers/Web3Wrapper";
import {AuthenticationError, ApolloError} from "apollo-server-express"
import {User} from "../../models";
import {find} from "lodash";
import {argumentsValidator, argumentsConvertor} from "../../helpers/ArgumentsValidator"

const {SmartContract, CompiledContract, DeployedContract} = require('../../models');
const path = require('path');
const fs = require('fs');
const sol=require("solc");

let fetchData = () => {
    return DeployedContract.find();
}

const resolvers = {
    DeployedContract:{
        compiledContract:async (parent)=>{
            return CompiledContract.findOne({"_id":parent.compiledContract})
        },
        smartContract:async(parent)=>{
            return SmartContract.findOne({"_id": parent.smartContract})
        },
    },
    Query: {
        deployedContracts:async (_)=>{
            return await fetchData();
        },
        deployedContractById:async(_,{id})=>{
            return await DeployedContract.findById(id);
        },
    },
    Mutation: {
        deployContract:async (_,{newDeploy},{user})=>{
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
                let compiledContract = await CompiledContract.findById(newDeploy.compiledContractId);
                let response = await User.findById(user.id)
                if(!response){
                    return new ApolloError("User Not Found", '404')
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
                        let deployData = await deploy(abi, bytecode, user.address ,user.wallet.privateKey, returnedArguments);
                        let deployedContract = DeployedContract({
                            ...newDeploy,
                            user:user,
                            ownerAddress:user.address,
                            ownerPrivateKey:user.wallet.privateKey,
                            smartContract:compiledContract.smartContract,
                            contractAddress:deployData.contractAddress,
                            transactionAddress:deployData.transactionHash,
                        });
                        await CompiledContract.findByIdAndUpdate(compiledContract.id, {$push: {deployments: deployedContract.id}},{new:true});
                        if(newDeploy.unlimitedCustomization===false){
                            await CompiledContract.findByIdAndUpdate(compiledContract.id, {used: true},{new:true});
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
