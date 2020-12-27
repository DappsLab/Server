import dateTime from "../../helpers/DateTimefunctions";
import {ApolloError, AuthenticationError} from 'apollo-server-express'

const {DApp, User, Order, PurchasedDApp, License} = require('../../models');


let fetchData = () => {
    return PurchasedDApp.find();
}

const resolvers = {
    PurchasedDApp:{
        user:async (parent)=>{
            return User.findOne({"_id":parent.user})
        },
        dApp:async(parent)=>{
            return DApp.findOne({"_id": parent.dApp})
        },
        licenses:async(parent)=>{
            return await License.find({"_id": parent.licenses})
        },

    },

    Query: {
        purchasedDApps:async(_)=>{
            return fetchData();
        },
        purchasedDAppById:async(id)=>{
            return PurchasedDApp.findOne({"id":id});
        },
    },
    Mutation: {
        purchaseDApp: async (_, {newPurchase}, {PurchasedDApp, user}) => {
            if(!user){
                return new AuthenticationError("Authentication Must Be Provided")
            }
            let order = await Order.findOne({"_id":newPurchase.orderId})
            if(!order){
                return new ApolloError("Order Not Found", 404)
            }
            if(order.status==="true"&&(order.user.toString()===user.id.toString())&&!order.orderUsed&&order.productType==="DAPP"){
                let oldPurchase = await PurchasedDApp.findOne({"user":user.id,"dApp":newPurchase.dAppId})
                if(!oldPurchase){
                    let license = {
                        order:order.id,
                        purchaseDateTime:dateTime(),
                    }
                    license = await License.create(license);
                    let purchase={
                        user:user.id,
                        dApp:newPurchase.dAppId,
                        licenses:[license.id],
                    }
                    let data = await PurchasedDApp.create(purchase);
                    await License.findByIdAndUpdate(license.id,{$set:{"purchasedDApp":data.id}})

                    try {
                        let response = await User.findById(user.id);
                        response.purchasedDApps.push(data._id);
                        response.save();
                    }catch(e){
                        throw new ApolloError("Internal Server Error", 500)
                    }
                    await Order.findByIdAndUpdate(order.id,{$set: {"orderUsed":true}},{new: true})
                    return data;
                }else{
                    try {
                        let license = {
                            order:order.id,
                            purchaseDateTime:dateTime(),
                        }
                        license = await License.create(license)
                        let newPurchase={
                            user:user.id,
                            dApp:oldPurchase.dApp,
                            licenses:oldPurchase.licenses,
                        }
                        newPurchase.licenses.push(license.id)
                        let response = await PurchasedDApp.findByIdAndUpdate(oldPurchase.id,newPurchase,{new: true});
                        await License.findByIdAndUpdate(license.id,{$set:{"purchasedDApp":response.id}})
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
