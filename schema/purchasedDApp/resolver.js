import dateTime from "../../helpers/DateTimefunctions";


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
            let order = await Order.findOne({"_id":newPurchase.orderId})
            console.log("oldPurchase")
            if(order.status==="true"&&(order.user.toString()===user.id.toString())&&!order.orderUsed&&order.productType==="DAPP"){
                let oldPurchase = await PurchasedDApp.findOne({"user":user.id,"dApp":newPurchase.dAppId})
                console.log("oldPurchase =",oldPurchase)
                if(!oldPurchase){
                    let license = {
                        order:order.id,
                        purchaseDateTime:dateTime(),
                    }
                    console.log("License",license)
                    license = await License.create(license);
                    console.log("License Response",license)
                    let purchase={
                        user:user.id,
                        dApp:newPurchase.dAppId,
                        licenses:[license.id],
                    }
                    console.log("Purchase:",purchase);

                    let data = await PurchasedDApp.create(purchase);
                    console.log("response:", data);
                    await License.findByIdAndUpdate(license.id,{$set:{"purchasedDApp":data.id}})

                    try {
                        let response = await User.findById(user.id);
                        response.purchasedDApps.push(data._id);
                        response.save();
                    }catch(e){
                        console.log("error:",e)
                    }
                    await Order.findByIdAndUpdate(order.id,{$set: {"orderUsed":true}},{new: true})
                    return data;
                }else{
                    console.log('old found')

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
                    console.log("oldPurchase update",oldPurchase)
                    let response = await PurchasedDApp.findByIdAndUpdate(oldPurchase.id,newPurchase,{new: true});
                    await License.findByIdAndUpdate(license.id,{$set:{"purchasedDApp":response.id}})
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
