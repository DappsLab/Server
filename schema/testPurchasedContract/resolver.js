import dateTime from "../../helpers/DateTimefunctions";

const {SmartContract, User, TestOrder, TestPurchasedContract, CompiledContract, TestLicense} = require('../../models');


let fetchData = () => {
    return TestPurchasedContract.find();
}

const resolvers = {
    TestPurchasedContract:{
        user:async (parent)=>{
            return await User.findOne({"_id":parent.user})
        },
        smartContract:async(parent)=>{
            return await SmartContract.findOne({"_id": parent.smartContract})
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
            return await TestPurchasedContract.findOne({"_id":id})
        },

    },
    Mutation: {
        testPurchaseContract: async (_, {newPurchase}, {TestPurchasedContract, user}) => {
            let order = await TestOrder.findOne({"_id":newPurchase.testOrderId})
            if(order.status==="true"&&(order.user.toString()===user.id.toString())&&!order.orderUsed&&order.productType==="SMARTCONTRACT"){
                let oldPurchase = await TestPurchasedContract.findOne({"user":user.id,"smartContract":newPurchase.smartContractId})
                console.log("oldPurchase =",oldPurchase)
                if(!oldPurchase){
                    let unlimitedCustomization=false;
                    if(order.licenseType==="UNLIMITEDLICENSE"){
                        unlimitedCustomization=true;
                    }

                    let license= {
                        testOrder:order.id,
                        purchaseDateTime:dateTime(),
                    }
                    console.log("License",license)
                    license = await TestLicense.create(license);
                    console.log("License Response",license)
                    let purchase={
                        user:user.id,
                        smartContract:newPurchase.smartContractId,
                        unlimitedCustomization:unlimitedCustomization,
                        customizationsLeft:1,
                        testLicenses:[license.id],
                    }
                    console.log("Purchase:",purchase);

                    let data = await TestPurchasedContract.create(purchase);
                    console.log("response:",data);
                    await TestLicense.findByIdAndUpdate(license.id,{$set:{"testPurchasedContract":data.id}})

                    try{
                        let response = await User.findById(user.id);
                        response.testPurchasedContracts.push(data._id);
                        response.save();
                    }catch(e){
                        console.log("error:",e)
                    }
                    await TestOrder.findByIdAndUpdate(order.id,{$set: {"orderUsed":true}},{new: true})
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
                        testOrder:order.id,
                        purchaseDateTime:dateTime(),
                    }
                    license= await TestLicense.create(license)
                    let newPurchase={
                        user:user.id,
                        smartContract:oldPurchase.smartContract,
                        unlimitedCustomization:unlimitedCustomization,
                        customizationsLeft:oldPurchase.customizationsLeft+1,
                        testLicenses:oldPurchase.licenses,
                    }
                    newPurchase.testLicenses.push(license.id)
                    console.log("oldPurchase update",oldPurchase)
                    let response = await TestPurchasedContract.findByIdAndUpdate(oldPurchase.id,newPurchase,{new: true});
                    await TestLicense.findByIdAndUpdate(license.id,{$set:{"testPurchasedContract":response.id}})
                    await TestOrder.findByIdAndUpdate(order.id,{$set: {"orderUsed":true}},{new: true})
                    return response;
                }
            }else{
                // ! order failed
            }

        },

    }
}

module.exports = resolvers;
