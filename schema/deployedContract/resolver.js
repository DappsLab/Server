import {deploy} from "../../helpers/Web3Wrapper";

const {SmartContract, User, Order, CompiledContract,PurchasedContract, License, DeployedContract} = require('../../models');
const path = require('path');
const fs = require('fs');
const sol=require("solc");

let fetchData = () => {
    return DeployedContract.find();
}

const resolvers = {
    DeployedContract:{
        compiledContract:async (parent)=>{
            return await CompiledContract.findOne({"_id":parent.compiledContract})
        },
        smartContract:async(parent)=>{
            return await SmartContract.findOne({"_id": parent.smartContract})
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
        deployContract:async (_,{compiledContractId},{user})=>{
            let compiledContract = await CompiledContract.findById(compiledContractId);
            if(compiledContract.user === user.id){
                let deployData = await deploy();
            }else{
                //! error Unauthorized user
            }
        },
    }
}

module.exports = resolvers;
