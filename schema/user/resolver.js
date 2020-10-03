const {hash, compare} = require('bcryptjs')
const {serializeUser, issueAuthToken} = require('../../helpers/Userfunctions.js')
const {UserRegisterationRules, UserAuthenticationRules} = require('../../validations');
const User = require('../../models/user');
const {walletObject} = require('../../helpers/Walletfunctions.js');

import {
    ApolloError
} from 'apollo-server-express';

var fetchData = () => {
    return User.find()
}

const resolvers = {
    Query: {
        users: () => {
            return fetchData()
        },
        userById: async (_, args) => {
            return await User.findById(args.id);
        },
        loginUser: async (_, {userName, password}, {User}) => {
            // Validate Incoming User Credentials
            await UserAuthenticationRules.validate({ userName, password }, { abortEarly: false });
            // Find the user from the database
            let user = await User.findOne({
                userName
            });
            // If User is not found
            if (!user) {
                throw new ApolloError("Username not found", '404');
            }
            // If user is found then compare the password
            let isMatch = compare(password, user.password);
            // If Password don't match
            if (!isMatch) {
                throw new ApolloError("Username not found", '403');
            }
            user = await serializeUser(user);
            // Issue Token
            let token = await issueAuthToken(user);
            return {
                user,
                token,
            }
        },
        /**
         * @DESC to get the authenticated User
         * @Headers Authorization
         * @Access Private
         */
        authUser: (_, __, {
            req: {
                user
            }
        }) => user,
    },
    Mutation: {
        addUser: async (_, args) => {
            try {
                let response = await User.create(args);
                return response;
            } catch (e) {
                return e.message;
            }
        },
        editUser: async (_, args) => {
            try {
                let response = await User.findByIdAndUpdate(args.id, args, {new: true});
                console.log(response);
                return response;
            } catch (e) {
                return e.message;
            }
        },
        deleteUser: async (_, args) => {
            try {
                let response = await User.findByIdAndRemove(args.id);
                console.log(response);
                return response;
            } catch (e) {
                return e.message;
            }
        },
        addKyc: async (_, args) => {
            try {
                // console.log(args, Object.entries(args))
                const kyc = args;
                let response = await User.findOneAndUpdate({_id: args.id}, {$set: {kyc}}, {new: true});
                // console.log(response);
                return response;
            } catch (e) {
                console.log("error", e)
                return e.message;
            }
        },
        editKyc: async (_, args) => {
            try {
                const kyc = args;
                console.log(kyc)
                let response = await User.findById(args.id);
                // console.log("old kyc",response.kyc);
                let oldKyc = response.kyc;
                let newKyc = {...oldKyc, ...kyc};
                delete newKyc.id;
                delete newKyc["$init"];
                // console.log("new kyc:",newKyc);
                let response2 = await User.findByIdAndUpdate({_id: args.id}, {$set: {kyc: newKyc}}, {new: true});
                console.log(response2);

                return response2;
            } catch (e) {
                console.log("error", e)
                return e.message
            }
        },
        addTestAddress: async (_, args) => {
            try {
                const testAddress = args;
                console.log("request", testAddress);
                let response = await User.findOneAndUpdate({_id: args.id}, {$push: {testAddress}}, {new: true});
                console.log(response);
                return response;
            } catch (e) {
                console.log("error", e);
                return e.message;
            }
        },
        editTestAddress: async (_, args) => {

            try {
                // console.log(args)
                let response2 = await User.findOneAndUpdate({
                    "_id": args.id,
                    'testAddress.address': args.address
                }, {'$set': {'testAddress.$': args}}, {new: true});
                console.log(response2);

                return response2;
            } catch (e) {
                console.log("error", e)
                return e.message
            }
            // let response = await User.findOneAndUpdate({$and:[{_id:args.id},{testAddressaddress:args.address}]} ,{$set:{testAddress}},{new:true});

        },
        registerUser: async (_,{newUser}, {User}) => {
            console.log("newUser:",newUser);
            console.log("User:",User);
            try {

                let {
                    email,
                    userName
                } = newUser;
                // console.log("UserName:",userName);
                // Validate Incoming New User Arguments
                await UserRegisterationRules.validate(newUser, {abortEarly: false});

                // Check if the Username is taken
                let user = await User.findOne({
                    userName
                });
                if (user) {
                    throw new ApolloError('Username is already taken.', '403')
                }

                // Check is the Email address is already registred
                user = await User.findOne({
                    email
                });
                if (user) {
                    throw new ApolloError('Email is already registred.', '403')
                }

                // New User's Account can be created
                // var wallet = hdwallet.derivePath(PATH).getWallet();
                // var address = "0x" + wallet.getAddress().toString("hex");
                console.log("address","0x" + walletObject.wallet.getAddress().toString("hex"))
                user = new User(newUser);

                // Hash the user password
                user.password = await hash(user.password, 10);

                // Save the user to the database
                let result = await user.save();
                result = await serializeUser(result);
                // Issue Token
                let token = await issueAuthToken(result);
                return {
                    token,
                    user: result
                }
            } catch (err) {
                throw new ApolloError(err.message);
            }
        },

    },
}

module.exports = resolvers;