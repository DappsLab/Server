import dateTime from "../../helpers/DateTimefunctions";
import {AuthenticationError, ApolloError} from "apollo-server-express"
const {UnBlockRequest, User, TestOrder, TestPurchasedContract, TestLicense} = require('../../models');


let fetchData = () => {
    return UnBlockRequest.find();
}

const resolvers = {
    UnBlockRequest:{
        user:async (parent)=>{
            return User.findOne({"_id":parent.user})
        },
    },

    Query: {
        unBlockRequests:async(_)=>{
            return fetchData();
        },

    },
    Mutation: {
        unBlockUser: async (_, {id}, {UnBlockRequest, user}) => {
            if(!user){
                return new AuthenticationError("Authentication Must Be Provided")
            }
            if(user.type==='ADMIN'){
                let unBlockRequest = UnBlockRequest.findById(id);
                unBlockRequest.unBlocked=true;
                let blockedUser = User.findById(unBlockRequest.user);
                blockedUser.isBlocked=false;
                blockedUser.save();
                unBlockRequest.save();
                return true
            }
            return false

        },

        createUnBlockRequest: async (_, {description},{user, UnBlockRequest}) => {
            if(!user){
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try{
                let unBlockRequest = UnBlockRequest({
                    description: description,
                    user:user.id,
                })
                return unBlockRequest.save()
            }catch(e){
                throw new ApolloError("Internal Server Error", 500)
            }
        }

    }
}

module.exports = resolvers;
