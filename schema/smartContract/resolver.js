const SmartContract = require('../../models/smartContract.js');


var  fetchData = ()=>{
    return SmartContract.find().populate('publisher').populate('verifiedBy');
}

const resolvers = {
    Query: {
        smartContracts: () => {
            return fetchData()
        },
        smartContractById: async (_,args)=>{
            let smartContract= await SmartContract.findById(args.id).populate('publisher').populate('verifiedBy');
            // console.log("SmartContract:",smartContract);
            return smartContract;
        }
    },
    Mutation:{
        createSmartContract:async (_,{newSmartContract},{SmartContract,user})=>{
            console.log("newSmartContract:",newSmartContract)
            console.log("user:",user);
            const smartContract = new SmartContract({
                ...newSmartContract,
                // publisher: user.id
            });
            //
            console.log("smartContract:",smartContract);

            // Save the post
            let result = await smartContract.save();
            // result = {
            //     ...result.toObject(),
            //     id: result._id.toString()
            // }
            return result;
        }
    }
}

module.exports = resolvers;