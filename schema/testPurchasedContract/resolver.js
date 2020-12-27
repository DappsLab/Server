import dateTime from "../../helpers/DateTimefunctions";
import {AuthenticationError, ApolloError} from "apollo-server-express"
const {SmartContract, User, TestOrder, TestPurchasedContract, TestLicense} = require('../../models');


let fetchData = () => {
    return TestPurchasedContract.find();
}

const resolvers = {
    TestPurchasedContract:{
        user:async (parent)=>{
            return User.findOne({"_id":parent.user})
        },
        smartContract:async(parent)=>{
            return SmartContract.findOne({"_id": parent.smartContract})
        },
        testLicenses:async(parent)=>{
            return await TestLicense.find({"_id": parent.testLicenses})
        },

    },

    Query: {
        testPurchasedContracts:async(_)=>{
            return fetchData();
        },
        testPurchasedContractById: async (_, {id}) => {
            return TestPurchasedContract.findOne({"_id":id})
        },

    },
    Mutation: {
        testPurchaseContract: async (_, {newPurchase}, {TestPurchasedContract, user}) => {
            if(!user){
                return new AuthenticationError("Authentication Must Be Provided")
            }
            let order = await TestOrder.findOne({"_id":newPurchase.testOrderId})
            if(!order){
                return new ApolloError("TestOrder Not Found", '404')
            }
            if(order.status==="true"&&(order.user.toString()===user.id.toString())&&!order.orderUsed&&order.productType==="SMARTCONTRACT"){
                let oldPurchase = await TestPurchasedContract.findOne({"user":user.id,"smartContract":newPurchase.smartContractId})
                if(!oldPurchase){
                    let unlimitedCustomization=false;
                    if(order.licenseType==="UNLIMITEDLICENSE"){
                        unlimitedCustomization=true;
                    }

                    let license= {
                        testOrder:order.id,
                        purchaseDateTime:dateTime(),
                    }
                    license = await TestLicense.create(license);
                    let purchase={
                        user:user.id,
                        smartContract:newPurchase.smartContractId,
                        unlimitedCustomization:unlimitedCustomization,
                        customizationsLeft:1,
                        testLicenses:[license.id],
                    }

                    let data = await TestPurchasedContract.create(purchase);
                    await TestLicense.findByIdAndUpdate(license.id,{$set:{"testPurchasedContract":data.id}})

                    try{
                        let response = await User.findById(user.id);
                        response.testPurchasedContracts.push(data._id);
                        response.save();
                    }catch(e){
                        throw new ApolloError("Internal Server Error", '500');
                    }
                    await TestOrder.findByIdAndUpdate(order.id,{$set: {"orderUsed":true}},{new: true})
                    return data;
                }else{
                    let unlimitedCustomization;
                    if(order.licenseType==="UNLIMITEDLICENSE"){
                        unlimitedCustomization=true;
                    }else if(order.licenseType==="SINGLELICENSE"&&oldPurchase.unlimitedCustomization===false){
                        unlimitedCustomization=false;
                    }else{
                        unlimitedCustomization=oldPurchase.unlimitedCustomization;
                    }
                    let license= {
                        testOrder:order.id,
                        purchaseDateTime:dateTime(),
                    }
                    license= await TestLicense.create(license)
                    let newPurchase={
                        user:user.id,
                        smartContract:oldPurchase.smartContract,
                        unlimitedCustomization:unlimitedCustomization,
                        customizationsLeft:oldPurchase.customizationsLeft+1,
                        testLicenses:oldPurchase.testLicenses,
                    }
                    newPurchase.testLicenses.push(license.id)
                    let response = await TestPurchasedContract.findByIdAndUpdate(oldPurchase.id,newPurchase,{new: true});
                    await TestLicense.findByIdAndUpdate(license.id,{$set:{"testPurchasedContract":response.id}})
                    await TestOrder.findByIdAndUpdate(order.id,{$set: {"orderUsed":true}},{new: true})
                    return response;
                }
            }else{
                return new ApolloError("Purchase Failed", '406')
            }

        },

    }
}

module.exports = resolvers;
