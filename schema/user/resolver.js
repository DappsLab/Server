import {Master, User,Order,SmartContract,PurchasedContract, DApp, TestOrder} from "../../models";
import {find} from "lodash"
const {USERSPATH, TESTSPATH, SECRET} = require("../../config")
const {hash, compare} = require('bcryptjs')
const {serializeUser, issueAuthToken, serializeEmail} = require('../../serializers')
const {UserRegisterationRules, UserAuthenticationRules, EmailRules, PasswordRules} = require('../../validations');
const {walletObject} = require('../../helpers/Walletfunctions.js');
const {verify} = require('jsonwebtoken');
import {ApolloError} from 'apollo-server-express';
import {sendEmail} from "../../utils/sendEmail";
import {emailConfirmationUrl} from "../../utils/emailConfirmationUrl";
import {forgetPasswordUrl} from "../../utils/forgetPasswordUrl";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import {toEth, getBalance} from "../../helpers/Web3Wrapper";
import {test_Request5DAppCoin, test_getBalance} from "../../helpers/TestWeb3Wrapper";


let fetchData = () => {
    return User.find();
}
let fetchBalance = async(id) => {
    console.log("user ID:",id)
    let user = await User.findOne({"_id":id})
    console.log("User:",user)
    user.balance = toEth(await getBalance(user.address))
    let x;
    for(x of user.testAddress){
        x.balance = toEth(await test_getBalance(x.address))
    }
    user.save()
    return user
}

const resolvers = {
    User:{
        orders:async (parent)=>{
            return await Order.find({"user":parent.id});
        },
        testOrders:async (parent)=>{
            return await TestOrder.find({"user":parent.id});
        },
        smartContracts:async(parent)=>{
            return await SmartContract.find({"publisher":parent.id})
        },
        purchasedContracts:async(parent)=>{
            return await PurchasedContract.find({"user":parent.id})
        },
        dApps:async(parent)=>{
            return await DApp.find({"publisher":parent.id})
        },
        purchasedDApps:async(parent)=>{
            return await DApp.find({"user":parent.id})
        },
    },
    Query: {
        users: () => {
            return fetchData()
        },
        me:async (_,{},{user})=>{
            console.log("user",user)
            try{
                await fetchBalance(user.id);
                return await User.findByIdAndUpdate(user.id,{$set: {balance:toEth(await getBalance(user.address))}}, {new: true})
            }catch(err){
                console.log("error",err)
            }
        },
        userById: async (_, args) => {
            let response = await User.findById(args.id);
            console.log("response:", response)
            return response;
        },
        loginUser: async (_, {userName, password}, {User}) => {
            // Validate Incoming User Credentials
            await UserAuthenticationRules.validate({userName, password}, {abortEarly: false});
            // Find the user from the database
            let user = await User.findOne({
                userName
            });
            // If User is not found
            if (!user) {
                throw new ApolloError("Username not found", '404');
            }else if(!user.confirmed){
                console.log("sending email")
                console.log("User",user)
                let emailData = {
                    id: user.id,
                    email: user.email
                }
                let userEmail = await serializeEmail(emailData);
                let emailLink = await emailConfirmationUrl(userEmail);
                let resp = await sendEmail(user.email, emailLink)
                throw new ApolloError("Email not confirmed", '403');
            }else{

            }
            // If user is found then compare the password
            let isMatch = await compare(password, user.password);
            // If Password don't match
            console.log("isMatch:", isMatch);
            if (!isMatch) {
                throw new ApolloError("Username or Password is invalid", '403');
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
        verify2FA:async (_,{token},{user})=>{
            try {
                return await speakeasy.totp.verify({
                    secret:user.twoFactorSecret,
                    encoding:'base32',
                    token:token
                })
            }catch(err){
                throw new ApolloError(err)
            }
        },
        searchPendingKyc:async(_,{},{user})=>{
            if(user.type=== "ADMIN"){
                return await User.find({"kyc.kycStatus":"PENDING"});
            }else{
                throw new ApolloError("Unauthorised", '401');
            }
        },
        authUser: async (_, __, {
            req: {
                user
            }
        }) => user,


    },
    Mutation: {
        verifyKyc:async (_, {id},{user})=>{
            if(user.type === "ADMIN"){
                try{
                    await User.findByIdAndUpdate(id,{$set: {"kyc.kycStatus":"VERIFIED"}});
                    return true
                }catch(err){
                    throw new ApolloError("User not found", '404');
                }
            }else{
                throw new ApolloError("Unauthorised", '401');
            }
        },
        cancelKyc: async (_,{id},{user}) => {
            if(user.type === "ADMIN"){
                try{
                    await User.findByIdAndUpdate(id,{$set: {"kyc.kycStatus":"NOT_VERIFIED"}});
                    return true
                }catch(err){
                    throw new ApolloError("User not found", '404');
                }
            }else{
                throw new ApolloError("Unauthorised", '401');
            }
        },
        disable2FA:async (_,__,{User,user})=>{
            try{
                let response = await User.findByIdAndUpdate(user.id, {
                    $set: {
                        twoFactorEnabled:false,
                        twoFactorSecret:"",
                        twoFactorCode:""
                    }}, {new: true});
                // return true
                return true;
            }catch(err){
                return false;
            }
        },
        enable2FA:async (_,__ ,{User,user})=>{

            console.log("User:",user);
            try{
                let secret = speakeasy.generateSecret({
                    name:"DappsLab"
                })

                const data = await qrcode.toDataURL(secret.otpauth_url);
                console.log("data:",data)

                let response = await User.findByIdAndUpdate(user.id, {
                    $set: {
                        twoFactorEnabled:true,
                        twoFactorSecret:secret.base32,
                        twoFactorCode:data
                    }}, {new: true});
                // return true
                console.log("Response:",response)
                return response;
            }catch(err){
                throw new ApolloError(err);
            }
        },
        forgetPassword: async (_, {email}) => {
            await EmailRules.validate({email}, {abortEarly: false});

            const user = await User.findOne({email: email});
            console.log("User", user)
            if(!user){
                console.log("Email not Registered!")
                throw new ApolloError("Email not registered", '404');

            }else{
                let emailData = {
                    id: user.id,
                    email: user.email
                }
                let userEmail = await serializeEmail(emailData);
                let emailLink = await forgetPasswordUrl(userEmail);
                return await sendEmail(email, emailLink);
            }

        },
        resetPassword: async (_, {token,password}) => {

            console.log("token",token)
            console.log("Psaaword:",password)
            if (!token || token === "" || token == "") {
                throw new ApolloError("token not found", '404');
            }

            // Verify the extracted token
            let decodedToken;
            try {
                decodedToken = verify(token, SECRET);
            } catch (err) {
                throw new ApolloError("token not found", '404');
            }

            // If decoded token is null then set authentication of the request false
            if (!decodedToken) {
                throw new ApolloError("token not found", '404');
            }

            // If the user has valid token then Find the user by decoded token's id
            let authUser = await User.findById(decodedToken.id);
            let user;
            if (!authUser) {
                throw new ApolloError("invalid token", '404');

            } else {

                await PasswordRules.validate({password}, {abortEarly: false});
                const passwordHash = await hash(password, 10);
                if (authUser.resetPasswordToken === token) {
                    user = await User.findByIdAndUpdate(authUser.id, {
                        $set: {
                            password: passwordHash,
                            resetPasswordToken: ""
                        }
                    }, {new: true});
                    // console.log("User", user)
                    return true
                }
            }
            return false
        },
        confirmEmail: async (_, {token}) => {
            console.log("token", token)
            if (!token || token === "" || token == "") {
                return "token not found"
            }

            // Verify the extracted token
            let decodedToken;
            try {
                decodedToken = verify(token, SECRET);
            } catch (err) {
                return "token not found"
            }

            // If decoded token is null then set authentication of the request false
            if (!decodedToken) {
                return "token not found"
            }

            // If the user has valid token then Find the user by decoded token's id
            let authUser = await User.findById(decodedToken.id);
            let user;
            if (!authUser) {
                return "invalid token"
                return false
            } else {
                if (authUser.emailConfirmToken === token) {
                    user = await User.findByIdAndUpdate(authUser.id, {
                        $set: {
                            confirmed: true,
                            emailConfirmToken: ""
                        }
                    }, {new: true});
                    return true
                }
            }
            console.log("authUser:", user);
            return false
        },
        addUser: async (_, args) => {
            try {
                let response = await User.create(args);
                return response;
            } catch (e) {
                return e.message;
            }
        },
        editUser: async (_, {newUser}, {User, user}) => {
            // console.log("user:", user);
            // console.log("User:", User);
            try {
                let response = await User.findOneAndUpdate({_id: user.id}, newUser, {new: true});
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
        addTestAddress: async (_, {},{user}) => { // TODO "ADD TEST ADDRESSES"
            try {
                let master = await Master.findOne({})
                console.log("MASTER:", master);
                console.log("Path:", TESTSPATH + master.testCount);
                let wallet = walletObject.hdwallet.derivePath(TESTSPATH + master.testCount).getWallet();
                let address = wallet.getAddressString();
                console.log("address:", address);
                let testAddress ={
                    address: address,
                    balance:"0",
                    wallet:{
                        privateKey:wallet.getPrivateKeyString(),
                        publicKey:wallet.getPublicKeyString(),
                    },
                }
                master.testCount = (parseInt(master.testCount) + 1).toString();
                // * changed from id top master.id
                const response = await Master.findByIdAndUpdate(master.id, master, {new: true});
                console.log("response", response);
                console.log("request", testAddress);
                let response2 = await User.findOneAndUpdate({_id: user.id}, {$push: {testAddress}}, {new: true});
                console.log(response2);
                return response2;
            } catch (e) {
                console.log("error", e);
                return e.message;
            }
        },
        deleteTestAddress: async (_, {testAddressId},{user}) => { // TODO "ADD TEST ADDRESSES"

            try {
                let response2 = await User.findOneAndUpdate({
                    "_id": user.id,
                }, {'$pull': {'testAddress': {"_id":testAddressId}}}, {new: true});
                return response2;
            } catch (e) {
                return e.message
            }
        },
        request5DAppsCoin: async(_,{testAddressId},{user})=>{
            try {
                // console.log(args)
                let response2 = await User.findById(user.id)
                console.log("response2",response2)
                let testAddress = find(response2.testAddress, { 'id': testAddressId});
                console.log("testAddress:",testAddress)
                let data = await test_Request5DAppCoin(testAddress.address);
                console.log("testAddress:",data);
                return fetchBalance(user.id);
            } catch (e) {
                console.log("error", e)
                return e.message
            }
        },

        registerUser: async (_, {newUser}, {User}) => {
            // console.log("newUser:", newUser);
            // console.log("User:", User);
            try {

                let {
                    email,
                    userName,
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

                // * changed from findbyid to findone
                let master = await Master.findOne({})
                console.log("MASTER:", master);
                console.log("Path:", USERSPATH + master.walletCount);
                let wallet = walletObject.hdwallet.derivePath(USERSPATH + master.walletCount).getWallet();
                let address = wallet.getAddressString();
                console.log("address:", address);

                user = new User(newUser);
                user.wallet.privateKey = wallet.getPrivateKeyString()
                user.wallet.publicKey = wallet.getPublicKeyString()
                user.address = address;
                user.type = "USER";
                master.walletCount = (parseInt(master.walletCount) + 1).toString();
                // * changed from id top master.id
                const response = await Master.findByIdAndUpdate(master.id, master, {new: true});
                console.log("response", response);


                // Hash the user password
                user.password = await hash(user.password, 10);

                // Save the user to the database
                let result = await user.save();
                let emailstr = {
                    id: user.id,
                    email: user.email
                }
                // console.log("emailstr:", emailstr)
                let userEmail = await serializeEmail(emailstr);
                // console.log("userEmail:", userEmail)
                let emailLink = await emailConfirmationUrl(userEmail);
                // console.log("emailLink:", emailLink);
                await sendEmail(result.email, emailLink);

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
