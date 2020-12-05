import {ApolloError} from "apollo-server-errors";

const { User, CustomOrder } = require('../../models');


let fetchData = () => {
    return CustomOrder.find();
}

const resolvers = {
    CustomOrder:{
        user:async (parent)=>{
            return User.findOne({"_id":parent.user})
        },
    },
    Query: {
        customOrders:async (_)=>{
            return await fetchData();
        },
        customOrderById:async(_,{id})=>{
            return await CustomOrder.findById(id);
        },
        searchPendingCustomOrders:async(_,{},{user})=>{
            if(user.type === "DEVELOPER"){
                await CustomOrder.find({status:"PENDING"})
            }else{
                throw new ApolloError("UnAuthorized User")
            }
        },
    },
    Mutation: {
        createCustomOrder:async (_,{newCustomOrder},{CustomOrder,user})=>{
            let customOrder = CustomOrder({
                ...newCustomOrder,
                user: user.id,
            })
            await User.findByIdAndUpdate(user.id,{$push:{customOrders:customOrder.id}})
            return await customOrder.save();
        },
    }
}

module.exports = resolvers;
