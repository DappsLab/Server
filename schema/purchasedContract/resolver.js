import {ApolloError, AuthenticationError} from "apollo-server-express";
import dateTime from "../../helpers/DateTimefunctions";


const {SmartContract, User, Order, PurchasedContract, CompiledContract, License} = require('../../models');


let fetchData = () => {
    return PurchasedContract.find();
}

const resolvers = {
    PurchasedContract:{
        user:async (parent)=>{
            return User.findOne({"_id":parent.user})
        },
        smartContract:async(parent)=>{
            return SmartContract.findOne({"_id": parent.smartContract})
        },
        licenses:async(parent)=>{
            return await License.find({"_id": parent.licenses})
        },

    },

    Query: {
        purchasedContracts:async(_)=>{
            return fetchData();
        },
        purchasedContractById: async (_, {id}) => {
            return PurchasedContract.findOne({"_id":id})
        },
    },
    Mutation: {
        purchaseContract: async (_, {newPurchase}, {PurchasedContract, user}) => {
            if(!user){
                return new AuthenticationError("Authentication Must Be Provided")
            }
            let order = await Order.findOne({"_id":newPurchase.orderId})
            if(!order){
                return new AuthenticationError("Order Not Found", 404)
            }
            if(order.status==="true"&&(order.user.toString()===user.id.toString())&&!order.orderUsed&&order.productType==="SMARTCONTRACT"){
                let oldPurchase = await PurchasedContract.findOne({"user":user.id,"smartContract":newPurchase.smartContractId})
                if(!oldPurchase){
                    try{
                        let unlimitedCustomization=false;
                        if(order.licenseType==="UNLIMITEDLICENSE"){
                            unlimitedCustomization=true;
                        }
                        let license= {
                            order:order.id,
                            purchaseDateTime:dateTime(),
                        }
                        license = await License.create(license);
                        let purchase={
                            user:user.id,
                            smartContract:newPurchase.smartContractId,
                            unlimitedCustomization:unlimitedCustomization,
                            customizationsLeft:1,
                            licenses:[license.id],
                        }
                        let data = await PurchasedContract.create(purchase);
                        await License.findByIdAndUpdate(license.id,{$set:{"purchasedContract":data.id}})
                        let response = await User.findById(user.id);
                        response.purchasedContracts.push(data._id);
                        response.save();
                        await Order.findByIdAndUpdate(order.id,{$set: {"orderUsed":true}},{new: true})
                        return data;
                    }catch(e){
                        throw new ApolloError("Internal Server Error", 500)
                    }
                }else{
                    try {
                        let unlimitedCustomization;
                        if(order.licenseType==="UNLIMITEDLICENSE"){
                            unlimitedCustomization=true;
                        }else if(order.licenseType==="SINGLELICENSE"&&oldPurchase.unlimitedCustomization===false){
                            unlimitedCustomization=false;
                        }else{
                            unlimitedCustomization=oldPurchase.unlimitedCustomization;
                        }
                        let license= {
                            order:order.id,
                            purchaseDateTime:dateTime(),
                        }
                        license= await License.create(license)
                        let newPurchase={
                            user:user.id,
                            smartContract:oldPurchase.smartContract,
                            unlimitedCustomization:unlimitedCustomization,
                            customizationsLeft:oldPurchase.customizationsLeft+1,
                            licenses:oldPurchase.licenses,
                        }
                        newPurchase.licenses.push(license.id)
                        let response = await PurchasedContract.findByIdAndUpdate(oldPurchase.id,newPurchase,{new: true});
                        await License.findByIdAndUpdate(license.id,{$set:{"purchasedContract":response.id}})
                        await Order.findByIdAndUpdate(order.id,{$set: {"orderUsed":true}},{new: true})
                        return response;
                    }catch (err) {
                        throw new ApolloError("Internal Server Error", 500)
                    }
                }
            }else{
                return new ApolloError("Purchase Failed", '406')
            }

        },

    }
}

module.exports = resolvers;
