import {ApolloError} from "apollo-server-express";
import dateTime from "../../helpers/DateTimefunctions";


const {SmartContract, User, Order, PurchasedContract, CompiledContract} = require('../../models');


let fetchData = () => {
    return PurchasedContract.find();
}

const resolvers = {
    PurchasedContract:{
        user:async (parent)=>{
            return await User.findOne({"_id":parent.user})
        },
        smartContract:async(parent)=>{
            return await SmartContract.findOne({"_id": parent.smartContract})
        },
    },
    License:{
        compilations:async(parent)=>{
            return await CompiledContract.find({"id":parent.compilations})
        },
        order:async(parent)=>{
            return await Order.findOne({"_id": parent.order})
        }
    },
    Query: {
        purchasedContracts:async(_)=>{
            return fetchData();
        },
        purchasedContractById: async (_, {id}) => {
            return await PurchasedContract.findOne({"_id":id})
        },

    },
    Mutation: {
        purchaseContract: async (_, {newPurchase}, {PurchasedContract, user}) => {
            let order = await Order.findOne({"_id":newPurchase.orderId})
            if(order.status==="true"&&(order.user.toString()===user.id.toString())&&!order.orderUsed){
                let oldPurchase = await PurchasedContract.findOne({"user":user.id,"smartContract":newPurchase.smartContractId})
                console.log("oldPurchase =",oldPurchase)
                if(!oldPurchase){
                    let unlimitedCustomization=false;
                    if(order.licenseType==="UNLIMITEDLICENSE"){
                        unlimitedCustomization=true;
                    }
                    let license={
                        order:order.id,
                        purchaseDateTime:dateTime(),
                    }
                    let purchase={
                        user:user.id,
                        smartContract:newPurchase.smartContractId,
                        unlimitedCustomization:unlimitedCustomization,
                        customizationsLeft:1,
                        licenses:[license],
                    }

                    let data = await PurchasedContract.create(purchase);

                    try{
                        let response = await User.findById(user.id);
                        response.purchasedContracts.push(data._id);
                        response.save();
                    }catch(e){
                        console.log("error:",e)
                    }
                    await Order.findByIdAndUpdate(order.id,{$set: {"orderUsed":true}},{new: true})
                    return data;
                }else{
                    console.log('old found')
                    let unlimitedCustomization;
                    if(order.licenseType==="UNLIMITEDLICENSE"){
                        unlimitedCustomization=true;
                    }else if(order.licenseType==="SINGLELICENSE"&&oldPurchase.unlimitedCustomization===false){
                        unlimitedCustomization=false;
                    }else{
                        unlimitedCustomization=oldPurchase.unlimitedCustomization;
                    }
                    let newPurchase={
                        user:user.id,
                        smartContract:oldPurchase.smartContract,
                        unlimitedCustomization:unlimitedCustomization,
                        customizationsLeft:oldPurchase.customizationsLeft+1,
                        licenses:oldPurchase.licenses,
                    }
                    let license={
                        order:order.id,
                        purchaseDateTime:dateTime(),
                    }
                    newPurchase.licenses.push(license)
                    console.log("oldPurchase update",oldPurchase)
                    let response = await PurchasedContract.findByIdAndUpdate(oldPurchase.id,newPurchase,{new: true});
                    await Order.findByIdAndUpdate(order.id,{$set: {"orderUsed":true}},{new: true})
                    return response;
                }
            }else{
                // ! order failed
            }

        },

    }
}

module.exports = resolvers;
