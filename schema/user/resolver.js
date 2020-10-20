import {Master} from "../../models";
const {PATH} = require("../../config")
const {hash, compare} = require('bcryptjs')
const {serializeUser, issueAuthToken} = require('../../helpers/Userfunctions.js')
const {UserRegisterationRules, UserAuthenticationRules} = require('../../validations');
const User = require('../../models/user');
const {walletObject} = require('../../helpers/Walletfunctions.js');

import {
    ApolloError
} from 'apollo-server-express';

var fetchData = () => {
    return User.find().populate('smartContracts');
}

const resolvers = {
    Query: {
        users: () => {
            return fetchData()
        },
        userById: async (_, args) => {
            let response = await User.findById(args.id).populate('smartContracts');
            console.log("response:",response)
            return response;
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
            let isMatch = await compare(password, user.password);
            // If Password don't match
            console.log("isMatch:",isMatch);
            if (!isMatch) {
                throw new ApolloError("Username not found", '403');
            }
            // If Password don't match
            //
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
        // editUser: async (_, args) => {
        //     try {
        //         let response = await User.findByIdAndUpdate(args.id, args, {new: true});
        //         console.log(response);
        //         return response;
        //     } catch (e) {
        //         return e.message;
        //     }
        // },
        editUser:async (_,{newUser}, {User,user}) => {
            try{

                let {
                    password,
                    userName
                } = newUser;

                await UserAuthenticationRules.validate({ userName, password }, { abortEarly: false });


                newUser.password = await hash(newUser.password, 10);
                delete newUser.userName
                delete newUser.email

                // Save the user to the database
                let response = await User.findOneAndUpdate({_id: user.id},newUser, {new: true}).populate('smartContracts');
                if (!response) {
                    throw new Error("Unathorized Access");
                }

                return response

            } catch (err) {
                throw new ApolloError(err.message);
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
        addTestAddress: async (_, args) => { // TODO "ADD TEST ADDRESSES"
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
        editTestAddress: async (_, args) => { // TODO "ADD TEST ADDRESSES"

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

                let master = await Master.findById("5f7ad7f29b4681fbe7a9bc09")
                console.log("MASTER:",master);
                console.log("Path:",PATH + master.walletCount);
                let wallet = walletObject.hdwallet.derivePath(PATH + master.walletCount).getWallet();
                let address = wallet.getAddressString();
                console.log("address:",address);

                user = new User(newUser);
                user.wallet.privateKey=wallet.getPrivateKeyString()
                user.wallet.publicKey=wallet.getPublicKeyString()
                user.address=address;
                user.type="USER";
                master.walletCount=(parseInt(master.walletCount)+1).toString();
                const response = await Master.findByIdAndUpdate("5f7ad7f29b4681fbe7a9bc09",master,{new:true});
                console.log("response", response);


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