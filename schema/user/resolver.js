const User = require('../../models/user');
const Kyc = require('../../models/kyc');
const userQuery = require('./query.js');
const userTypeDefs = require('./type.js')

var  fetchData = ()=>{
    return User.find()
}

const resolvers = {
    Query: {
        users:()=>{
            return fetchData()
        }
    },
    Mutation: {
        addUser : async(_,args)=>{
           try{
               let response = await User.create(args);
               return response;
           }catch(e){
               return e.message;
           }
        },
        editUser : async(_,args)=>{
          try {
              let response = await User.findByIdAndUpdate(args.id,args,{new:true});
              console.log(response);
              return response;
          }catch(e){
              return e.message;
          }
        },
        deleteUser : async(_,args)=>{
            try {
                let response = await User.findByIdAndRemove(args.id);
                console.log(response);
                return response;
            }catch(e){
                return e.message;
            }
        },
        addKyc : async(_,args)=>{
            try{
                // console.log(args, Object.entries(args))
                const kyc = args;
                let response = await User.findOneAndUpdate({_id:args.id},{$set:{kyc}},{new:true});
                // console.log(response);
                return response;
            }catch(e){
                console.log("error" , e)
                return e.message;
            }
        },
        editKyc: async(_,args)=>{
            try{
              const kyc = args;
              console.log(kyc)
              let response = await User.findById(args.id);
              // console.log("old kyc",response.kyc);
              let oldKyc=response.kyc;
              let newKyc={...oldKyc,...kyc};
              delete newKyc.id;
              delete newKyc["$init"];
              // console.log("new kyc:",newKyc);
              let response2 = await User.findByIdAndUpdate({_id:args.id},{$set:{kyc:newKyc}},{new:true});
              console.log(response2);

              return response2;
            }catch(e){
              console.log("error" ,e)
              return e.message
            }
        },
        addTestAddress: async(_,args)=>{
            try {
                const testAddress = args;
                console.log("request",testAddress);
                let response = await User.findOneAndUpdate({_id:args.id},{$push:{testAddress}},{new:true});
                console.log(response);
                return response;
            }catch(e){
                console.log("error", e);
                return e.message;
            }
        },
        editTestAddress: async(_,args)=>{

            try{
                // console.log(args)
                let response2 = await User.findOneAndUpdate({"_id":args.id,'testAddress.address':args.address},{'$set':{'testAddress.$':args}},{new:true});
                console.log(response2);

                return response2;
            }catch(e){
                console.log("error" ,e)
                return e.message
            }
            // let response = await User.findOneAndUpdate({$and:[{_id:args.id},{testAddressaddress:args.address}]} ,{$set:{testAddress}},{new:true});

        }
    },
}

module.exports = resolvers;