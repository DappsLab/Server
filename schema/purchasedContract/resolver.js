import {ApolloError} from "apollo-server-express";
import dateTime from "../../helpers/DateTimefunctions";


const {SmartContract, User, Order, PurchasedContract, CompiledContract, License} = require('../../models');


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
        licenses:async(parent)=>{
            return await License.findOne({"_id": parent.license})
        },

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

                    let license= {
                        order:order.id,
                        purchaseDateTime:dateTime(),
                    }
                    console.log("License",license)
                    license = await License.create(license);
                    console.log("License Response",license)
                    let purchase={
                        user:user.id,
                        smartContract:newPurchase.smartContractId,
                        unlimitedCustomization:unlimitedCustomization,
                        customizationsLeft:1,
                        licenses:[license.id],
                    }
                    console.log("Purchase:",purchase);

                    let data = await PurchasedContract.create(purchase);
                    console.log("response:",data);
                    await License.findByIdAndUpdate(license.id,{$set:{"purchasedContract":data.id}})

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
                    console.log("oldPurchase update",oldPurchase)
                    let response = await PurchasedContract.findByIdAndUpdate(oldPurchase.id,newPurchase,{new: true});
                    await License.findByIdAndUpdate(license.id,{$set:{"purchasedContract":response.id}})
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
