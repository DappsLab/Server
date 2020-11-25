import {ApolloError} from "apollo-server-express";
import lodash from "lodash"
const {SmartContract,User} = require('../../models');
const dateTime = require('../../helpers/DateTimefunctions');
const {walletObject}= require('../../helpers/Walletfunctions');


let fetchData = ()=>{
    return SmartContract.find().populate('publisher').populate('verifiedBy');
}

const resolvers = {
    Query: {
        smartContracts: () => {
            return fetchData()
        },
        smartContractById: async (_,args)=>{
            let smartContract= await SmartContract.findById(args.id).populate('publisher').populate('verifiedBy');
            console.log("SmartContract:",smartContract);
            return smartContract;
        },
        filterSmartContract: async (_,{searchSmartContract})=>{
            console.log("searchSmartContract:",searchSmartContract)
            let filterCategory;
            if(searchSmartContract.contractCategory!==[]&&searchSmartContract.contractCategory!==undefined){
                filterCategory = {
                    '$in':searchSmartContract.contractCategory
                }
            }else{
                filterCategory={$ne:null}
            }

            let filterTags;
            if(searchSmartContract.tags!==[]&&searchSmartContract.tags!==undefined){
                filterTags = {
                    '$in':searchSmartContract.tags
                }
            }else{
                filterTags={$ne:null}
            }

            let filter = {
                contractName:{ "$regex": searchSmartContract.contractName, "$options": "i" },
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
                let response = await SmartContract.find(filter).sort(SortBy).populate('publisher').populate('verifiedBy')
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
                '$or':[
                    {contractName:{ "$regex": searchSmartContract.contractName, "$options": "i" }},
                    {tags: { "$regex":  searchSmartContract.contractName, "$options": "i" }}
                ]
            };


            try{
                console.log("filter:",filter)
                let response = await SmartContract.find(filter).populate('publisher').populate('verifiedBy')
                console.log("response:",response)
                return response;
            }catch(err){
                console.log(err);
            }
        }

    },
    Mutation:{
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
                let response = await SmartContract.findByIdAndUpdate(id,newSmartContract,{new:true}).populate('publisher').populate('verifiedBy');
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
        verifySmartContract:async (_,{newSmartContract,id},{SmartContract,user})=>{
            if(user.type ==="ADMIN"){
                let smartContract;
                try {
                    smartContract = {
                        ...newSmartContract,
                        verifiedBy: user.id,
                        verifiedDateTime:dateTime(),
                    };
                }catch(e){
                    console.log("error:",e)
                }
                try {
                    console.log("smartContract:",smartContract)
                    let response = await SmartContract.findByIdAndUpdate(id,smartContract,{new:true}).populate('publisher').populate('verifiedBy');
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
        }

    }
}

module.exports = resolvers;
