import {ApolloError} from "apollo-server-express";
import lodash from "lodash"
const path = require('path');
const fs = require('fs');
const {SmartContract,User} = require('../../models');
const dateTime = require('../../helpers/DateTimefunctions');
const {walletObject}= require('../../helpers/Walletfunctions');


let fetchData = ()=>{
    return SmartContract.find()
}

const resolvers = {
    SmartContract: {
        publisher:async (parent)=>{
            return await User.findOne({"_id":parent.publisher})
        },
        verifiedBy: async (parent)=>{
            return await User.findOne({"_id":parent.verifiedBy})
        },
    },
    Query: {
        smartContracts: () => {
            return fetchData()
        },
        verifiedSmartContracts: () => {
            return SmartContract.find({verified:"VERIFIED"});
        },
        smartContractById: async (_,args)=>{
            let smartContract= await SmartContract.findById(args.id);
            console.log("SmartContract:",smartContract);
            return smartContract;
        },
        filterSmartContract: async (_,{searchSmartContract})=>{
            // console.log("searchSmartContract:",searchSmartContract.contractName)
            let filterCategory;
            if(searchSmartContract.contractCategory!==[]&&searchSmartContract.contractCategory!==undefined&&searchSmartContract.contractCategory!==""&&searchSmartContract.contractCategory[0]!==''&&searchSmartContract.contractCategory[0]!==undefined){
                filterCategory = {
                    '$in':searchSmartContract.contractCategory
                }
            }else{
                filterCategory={$ne:null}
            }

            let filterTags;
            // console.log("tag:",searchSmartContract.contractCategory[0]);
            if(searchSmartContract.tags!==[]&&searchSmartContract.tags!==undefined&&searchSmartContract.tags!==""&&searchSmartContract.tags[0]!==''&&searchSmartContract.tags[0]!==undefined){
                filterTags = {
                    '$in':searchSmartContract.tags
                }
            }else{
                filterTags={$ne:null}
            }

            let filterName;
            if(searchSmartContract.contractName!==[]&&searchSmartContract.contractName!==undefined&&searchSmartContract.contractName!==""){
                filterName = { "$regex": searchSmartContract.contractName, "$options": "i" }
            }else{
                filterName={$ne:null}
            }

            let filter = {
                verified:"VERIFIED",
                contractName:filterName,
                contractCategory:filterCategory,
                tags: filterTags,
            };


            let SortBy;
            if(searchSmartContract.sortBy!==""&&searchSmartContract.sortBy!==undefined){
                if(searchSmartContract.sortBy==='NEWEST'){
                    SortBy={createdAt: -1}
                }else if(searchSmartContract.sortBy==='LOW_TO_HIGH'){
                    SortBy={singleLicensePrice: 1}
                }else if(searchSmartContract.sortBy==='HIGH_TO_LOW'){
                    SortBy={singleLicensePrice: -1}
                }else if(searchSmartContract.sortBy==='TOP_SOLD'){
                    SortBy={purchasedCounts: -1}
                }
            }else {
                SortBy = 0;
            }

            try{
                console.log("filter:",filter);
                console.log("sortBy:",SortBy);
                let response = await SmartContract.find(filter).sort(SortBy)
                console.log("response:",response)
                let {
                    minPrice,
                    maxPrice
                } = searchSmartContract
                console.log("minPrice",minPrice)
                if(minPrice===undefined&&maxPrice===undefined){
                    minPrice=0;
                    maxPrice=999999999;
                }
                let filteredResponse = lodash.remove(response, (n)=> {
                    console.log("n.singleLicensePrice >= searchSmartContract.minPrice:",n.singleLicensePrice , maxPrice)
                    if((parseFloat(n.singleLicensePrice) <= parseFloat(maxPrice)) && (parseFloat(n.singleLicensePrice) >= parseFloat(minPrice))){
                        console.log("returning...")
                        return n;
                    }
                });

                console.log("filteredResponse",filteredResponse)
                return filteredResponse;
            }catch(err){
                console.log(err);
            }

        },
        searchSmartContract: async (_,{searchSmartContract})=>{
            console.log("searchSmartContract:",searchSmartContract)


            let filter = {
                verified:"VERIFIED",
                '$or':[
                    {contractName:{ "$regex": searchSmartContract.contractName, "$options": "i" }},
                    {tags: { "$regex":  searchSmartContract.contractName, "$options": "i" }}
                ]
            };


            try{
                console.log("filter:",filter)
                let response = await SmartContract.find(filter)
                console.log("response:",response)
                return response;
            }catch(err){
                console.log(err);
            }
        },
        searchPendingSmartContracts:async(_,{},{user})=>{
            if(user.type==="ADMIN"){
                return await SmartContract.find({verified:"PENDING"});
            }else{
                throw new ApolloError("UnAuthorized User",)
            }
        },
        getSource:async (_,{id},{user}) => {
            if(user.type ==="ADMIN"||user.type ==="DEVELOPER"){
                let smartContract  = await SmartContract.findOne({"_id":id})
                console.log("response",smartContract)
                let filename = smartContract.source.substr(22,99);
                console.log(filename)
                filename =  filename.slice(0, -4);
                console.log('filename:',filename)
                const sourceFile=path.resolve ( './' ,'contracts',filename+'.sol');
                console.log(sourceFile)
                try{
                    let sourceCode= await fs.readFileSync (sourceFile,'utf8');
                    console.log(sourceCode)
                    return sourceCode;
                }catch(err){
                    throw new ApolloError("error file not exist",404)
                }
            } else{
                throw new ApolloError("UnAuthorized User",403)
            }
        },
    },
    Mutation:{
        cancelSmartContract: async (_, {id},{user})=>{
            if(user.type ==="ADMIN"){
                let smartContract;
                try {
                    smartContract = {
                        verifiedBy: user.id,
                        verifiedDateTime:dateTime(),
                        verified:"NOT_VERIFIED",
                    };
                }catch(e){
                    console.log("error:",e)
                }
                try {
                    console.log("smartContract:",smartContract)
                    let response = await SmartContract.findByIdAndUpdate(id, {$set:smartContract},{new:true})
                    console.log("response",response)
                    if (!response) {
                    }
                    return response

                } catch (err) {
                    throw new ApolloError("Update Failed");
                    // throw new ApolloError(err.message);
                }
            }else{
                throw new ApolloError("UnAuthorized User",403);
            }
        },
        createSmartContract:async (_,{newSmartContract},{SmartContract,user})=>{

            let smartContract;
            try {
                smartContract =  SmartContract({
                    ...newSmartContract,
                    publisher: user.id,
                    publishingDateTime:dateTime(),
                });
            }catch(e){
                console.log("error:",e)
            }
            //
            // console.log("smartContract:",smartContract);

            // Save the post
            let result = await smartContract.save();
            console.log("Smart Contract:",result)

            try{
                let response = await User.findById(user.id);
                response.smartContracts.push(result._id);
                response.save();
                // console.log("hello to response:",response);
            }catch(e){
                console.log("error:",e)
            }

            result = {
                ...result.toObject(),
                id: result._id.toString()
            }
            return result;
        },
        updateSmartContract:async (_,{newSmartContract,id},{SmartContract,user})=>{

            try {
                let response = await SmartContract.findByIdAndUpdate(id,newSmartContract,{new:true})
                console.log("response",response)
                if (!response) {
                    throw new ApolloError("UPDATE failed");
                }
                return response

            } catch (err) {
                throw new ApolloError(err.message);
            }
        },
        deleteSmartContract:async (_,{id})=>{
            try {
                let response = await SmartContract.findByIdAndDelete(id);
                console.log("response",response)
                if (!response) {
                    throw new ApolloError("delete failed");
                }
                return {
                    success: true,
                    message: "SmartContract Deleted Successfully."
                }

            } catch (err) {
                throw new ApolloError(err.message);
            }
        },
        verifySmartContract:async (_,{id},{SmartContract,user})=>{
            if(user.type ==="ADMIN"){
                let smartContract;
                try {
                    smartContract = {
                        verified:"VERIFIED",
                        verifiedBy: user.id,
                        verifiedDateTime:dateTime(),
                    };
                }catch(e){
                    console.log("error:",e)
                }
                try {
                    console.log("smartContract:",smartContract)
                    let response = await SmartContract.findByIdAndUpdate(id, {$set:smartContract},{new:true})

                    console.log("response",response)
                    if (!response) {
                    }
                    return response

                } catch (err) {
                    throw new ApolloError("Update Failed");
                    // throw new ApolloError(err.message);
                }
            }else{
                throw new ApolloError("UnAuthorized User",403);
            }
        },
    }
}

module.exports = resolvers;
