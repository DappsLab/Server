import {ApolloError, AuthenticationError} from "apollo-server-express";
import {EmailRules} from "../../validations"

const {User, CustomOrder} = require('../../models');

let fetchData = () => {
    return CustomOrder.find();
}

const resolvers = {
    CustomOrder: {
        user: async (parent) => {
            return User.findOne({"_id": parent.user})
        },
    },
    Query: {
        customOrders: async (_) => {
            return await fetchData();
        },
        customOrderById: async (_, {id}) => {
            return await CustomOrder.findById(id);
        },
        searchPendingCustomOrders: async (_, {}, {user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            if (user.type === "ADMIN") {
                return await CustomOrder.find({status: "PENDING"})
            } else {
                throw new ApolloError("UnAuthorized User", 403)
            }
        },
        searchVerifiedCustomOrders: async (_, {}, {user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            if (user.type === "DEVELOPER") {
                return await CustomOrder.find({status: "VERIFIED", "user": {$ne: user.id}})
            } else {
                throw new ApolloError("UnAuthorized User", 403)
            }
        },
    },
    Mutation: {
        cancelCustomOrder: async (_, {id}, {user, CustomOrder}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                if (user.type === 'ADMIN') {
                    await CustomOrder.findByIdAndUpdate(id, {$set: {'status': 'REJECTED'}});
                    return true
                }
                return false;
            } catch (e) {
                throw new ApolloError("Internal Server Error", 500)
            }
        },
        deleteCustomOrder: async (_, {id}, {user, CustomOrder}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                await User.findOneAndUpdate({"_id": user.id,}, {'$pull': {'customOrders': id}}, {new: true});
                await CustomOrder.findByIdAndDelete(id);
                return true
            } catch (e) {
                throw new ApolloError("Internal Server Error", 500)
            }
        },
        createCustomOrder: async (_, {newCustomOrder}, {CustomOrder, user}) => {

            let email = newCustomOrder.businessEmail
            await EmailRules.validate({email}, {abortEarly: false});
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                let customOrder = CustomOrder({
                    ...newCustomOrder,
                    user: user.id,
                })
                await User.findByIdAndUpdate(user.id, {$push: {customOrders: customOrder.id}})
                return await customOrder.save();
            } catch (err) {
                throw new ApolloError("Internal Server Error", 500)
            }
        },
        verifyCustomOrder: async (_, {id}, {user, CustomOrder}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                if (user.type === 'ADMIN') {
                    await CustomOrder.findByIdAndUpdate(id, {$set: {'status': 'VERIFIED'}});
                    return true
                }
                return false;
            } catch (e) {
                throw new ApolloError("Internal Server Error", 500)
            }
        }
    }
}

module.exports = resolvers;
