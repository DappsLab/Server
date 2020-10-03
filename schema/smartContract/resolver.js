const SmartContract = require('../../models/smartContract.js');


var  fetchData = ()=>{
    return SmartContract.find()
}

const resolvers = {
    Query: {
        smartContracts: () => {
            return fetchData()
        },
        smartContractById: async (_,args)=>{
            let smartContract= await SmartContract.findById(args.id).populate('publisher');
            return smartContract;
        }
    },
}

module.exports = resolvers;