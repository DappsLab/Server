const {SmartContract, User, Order, CompiledContract,PurchasedContract} = require('../../models');
const path = require('path');
const fs = require('fs');
const sol=require("solc");

let fetchData = () => {
    return CompiledContract.find();
}

const resolvers = {
    CompiledContract:{
        user:async (parent)=>{
            return await User.findOne({"_id":parent.user})
        },
        smartContract:async(parent)=>{
            return await SmartContract.findOne({"_id": parent.smartContract})
        },
    },
    Query: {
        compiledContracts:async (_)=>{
            return await fetchData();
        },
        compiledContractById:async(_,{id})=>{
            return await CompiledContract.findById(id);
        },
    },
    Mutation: {
        compileContract:async (_,{newCompile},{user,CompiledContract})=>{
            let smartContract = await SmartContract.findById(newCompile.smartContract)
            let purchasedContract=null;
            if(newCompile.purchasedContract!==undefined&&newCompile.purchasedContract!==""){
                purchasedContract = await PurchasedContract.findOne({"_id":newCompile.purchasedContract,licenses:{'$in':{"_id":newCompile.license}}})
            }
            console.log("PurchasedContract:",purchasedContract)
            if(!smartContract.preCompiled){
                let filename = smartContract.source.substr(22,99);
                filename =  filename.slice(0, -4);
                console.log ("filename:",filename)
                const sourceFile=path.resolve ( './' ,'contracts',filename+'.sol');
                console.log ("sourceFile:",sourceFile);
                try{
                    let sourceCode = await fs.readFileSync (sourceFile,'utf8');
                    console.log ("sourceCode:",sourceCode);
                    let compiledData = await sol.compile(sourceCode,1).contracts[':'+smartContract.sourceContractName];
                    console.log ("Compiled Data:",compiledData)
                        let compiledFile = `${filename}-${Date.now()}.json}`
                    fs.writeFile( "./contracts/compiledContracts/"+compiledFile, JSON.stringify(compiledData), function(err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                }catch(err){
                    console.log ("error file not exist")
                }
            }
        }
    }
}

module.exports = resolvers;
