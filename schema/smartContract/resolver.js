import {ApolloError} from "apollo-server-express";

const {SmartContract,User} = require('../../models');
const dateTime = require('../../helpers/DateTimefunctions');



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
        }
    }
}

module.exports = resolvers;