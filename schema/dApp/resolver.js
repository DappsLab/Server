import {ApolloError} from "apollo-server-express";
import lodash from "lodash"
const path = require('path');
const fs = require('fs');
const {DApp,User} = require('../../models');
const dateTime = require('../../helpers/DateTimefunctions');
const {walletObject}= require('../../helpers/Walletfunctions');


let fetchData = ()=>{
    return DApp.find()
}

const resolvers = {
    DApp: {
        publisher:async (parent)=>{
            return User.findOne({"_id":parent.publisher})
        },
        verifiedBy: async (parent)=>{
            return User.findOne({"_id":parent.verifiedBy})
        },
    },
    Query: {
        dApps: () => {
            return fetchData()
        },
        verifiedDApps: () => {
            return DApp.find({verified:"VERIFIED"});
        },
        dAppById: async (_,args)=>{
            return await DApp.findById(args.id);
        },
        filterDApps: async (_,{searchDApp})=>{
            let filterCategory;
            if(searchDApp.dAppCategory!==[]&&searchDApp.dAppCategory!==undefined&&searchDApp.dAppCategory!==""&&searchDApp.dAppCategory[0]!==''&&searchDApp.dAppCategory[0]!==undefined){
                filterCategory = {
                    '$in':searchDApp.dAppCategory
                }
            }else{
                filterCategory={$ne:null}
            }

            let filterTags;
            // console.log("tag:",searchSmartContract.contractCategory[0]);
            if(searchDApp.tags!==[]&&searchDApp.tags!==undefined&&searchDApp.tags!==""&&searchDApp.tags[0]!==''&&searchDApp.tags[0]!==undefined){
                filterTags = {
                    '$in':searchDApp.tags
                }
            }else{
                filterTags={$ne:null}
            }

            let filterName;
            if(searchDApp.dAppName!==[]&&searchDApp.dAppName!==undefined&&searchDApp.dAppName!==""){
                filterName = { "$regex": searchDApp.dAppName, "$options": "i" }
            }else{
                filterName={$ne:null}
            }

            let filter = {
                verified:"VERIFIED",
                dAppName:filterName,
                dAppCategory:filterCategory,
                tags: filterTags,
            };


            let SortBy;
            if(searchDApp.sortBy!==""&&searchDApp.sortBy!==undefined){
                if(searchDApp.sortBy==='NEWEST'){
                    SortBy={createdAt: -1}
                }else if(searchDApp.sortBy==='LOW_TO_HIGH'){
                    SortBy={singleLicensePrice: 1}
                }else if(searchDApp.sortBy==='HIGH_TO_LOW'){
                    SortBy={singleLicensePrice: -1}
                }else if(searchDApp.sortBy==='TOP_SOLD'){
                    SortBy={purchasedCounts: -1}
                }
            }else {
                SortBy = 0;
            }

            try{
                console.log("filter:",filter);
                console.log("sortBy:",SortBy);
                let response = await DApp.find(filter).sort(SortBy)
                console.log("response:",response)
                let {
                    minPrice,
                    maxPrice
                } = searchDApp
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
        searchDApps: async (_,{searchDApp})=>{
            console.log("searchSmartContract:",searchDApp)
            
            let filter = {
                verified:"VERIFIED",
                '$or':[
                    {dAppName:{ "$regex": searchDApp.dAppName, "$options": "i" }},
                    {tags: { "$regex":  searchDApp.dAppName, "$options": "i" }}
                ]
            };


            try{
                console.log("filter:",filter)
                let response = await DApp.find(filter)
                console.log("response:",response)
                return response;
            }catch(err){
                console.log(err);
            }
        },
        searchPendingDApps:async(_,{},{user})=>{
            if(user.type==="ADMIN"){
                return await DApp.find({verified:"PENDING"});
            }else{
                throw new ApolloError("UnAuthorized User",)
            }
        },
        getZip:async (_,{id},{user}) => {
            if(user.type ==="ADMIN"){
            //     let dApp  = await DApp.findOne({"_id":id})
            //     console.log("response",dApp)
            //     let filename = dApp.zip.substr(22,99);
            //     console.log(filename)
            //     filename =  filename.slice(0, -4);
            //     console.log('filename:',filename)
            //     const sourceFile=path.resolve ( './' ,'dApps',filename+'.zip');
            //     console.log(sourceFile)
            //     try{
            //         let sourceCode= await fs.readFileSync (sourceFile,'utf8');
            //         console.log(sourceCode)
            //         return sourceCode;
            //     }catch(err){
            //         throw new ApolloError("error file not exist",404)
            //     }
            } else{
                throw new ApolloError("UnAuthorized User",403)
            }
        },
    },
    Mutation:{
        cancelDApp: async (_, {id},{user})=>{
            if(user.type ==="ADMIN"){
                let dApp;
                try {
                    dApp = {
                        verifiedBy: user.id,
                        verifiedDateTime:dateTime(),
                        verified:"NOT_VERIFIED",
                    };
                }catch(e){
                    console.log("error:",e)
                }
                try {
                    console.log("dApp:",dApp)
                    let response = await DApp.findByIdAndUpdate(id, {$set:dApp},{new:true})
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
        createDApp:async (_,{newDApp},{DApp,user})=>{

            let dApp;
            try {
                dApp =  DApp({
                    ...newDApp,
                    publisher: user.id,
                    publishingDateTime:dateTime(),
                });
            }catch(e){
                console.log("error:",e)
            }
            //
            // console.log("smartContract:",smartContract);

            // Save the post
            let result = await dApp.save();
            console.log("Smart Contract:",result)

            try{
                let response = await User.findById(user.id);
                response.dApps.push(result._id);
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
        updateDApp:async (_,{newDApp,id},{DApp,user})=>{

            try {
                let response = await DApp.findByIdAndUpdate(id,newDApp,{new:true})
                console.log("response",response)
                if (!response) {
                    throw new ApolloError("UPDATE failed");
                }
                return response

            } catch (err) {
                throw new ApolloError(err.message);
            }
        },
        deleteDApp:async (_,{id})=>{
            try {
                let response = await DApp.findByIdAndDelete(id);
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
        verifyDApp:async (_,{id},{DApp,user})=>{
            if(user.type ==="ADMIN"){
                let dApp;
                try {
                    dApp = {
                        verified:"VERIFIED",
                        verifiedBy: user.id,
                        verifiedDateTime:dateTime(),
                    };
                }catch(e){
                    console.log("error:",e)
                }
                try {
                    console.log("dApp:",dApp)
                    let response = await DApp.findByIdAndUpdate(id, {$set:dApp},{new:true})

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