const {SmartContract, User, Order, CompiledContract,PurchasedContract, License} = require('../../models');
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
        purchasedContract:async()=>{
            return await PurchasedContract.findOne({"_id": parent.purchasedContract})
        },
        license:async()=>{
            return await License.findOne({"_id": parent.license})
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
                let license = await License.findById(newCompile.license)
                console.log("License:",license)
                if(license.purchasedContract.toString()===newCompile.purchasedContract.toString()){
                    console.log("fetching...")
                    purchasedContract = await PurchasedContract.findById(newCompile.purchasedContract);
                }
            }
            console.log("PurchasedContract:",purchasedContract)
            if(!smartContract.preCompiled){
                let filename = smartContract.source.substr(22,99);
                filename =  filename.slice(0, -4);
                console.log ("filename:",filename)
                const sourceFile=path.resolve ( './' ,'contracts',filename+'.sol');
                console.log ("sourceFile:",sourceFile);

                let sourceCode;
                let compiledData
                let compiledFile;

                try{
                    sourceCode = await fs.readFileSync (sourceFile,'utf8');
                    // console.log ("sourceCode:",sourceCode);
                    compiledData = await sol.compile(sourceCode,1).contracts[':'+smartContract.sourceContractName];
                    // console.log ("Compiled Data:",compiledData)
                    compiledFile = `${filename}-${Date.now()}.json`
                    fs.writeFile( "./contracts/compiledContracts/"+compiledFile, JSON.stringify(compiledData), function(err) {
                        if (err) {
                            console.log(err);
                        }
                    })
                }catch(err){
                    console.log ("error file not exist")
                }
                let purchasedContractID="";
                let licenseID="";
                if(purchasedContract){
                    purchasedContractID=newCompile.purchasedContract;
                    licenseID=newCompile.license;
                }
                let compiledContract=CompiledContract({
                    compilationName:newCompile.compilationName,
                    user:user.id,
                    smartContract:smartContract.id,
                    compiledFile:compiledFile,
                    purchasedContract:purchasedContractID,
                    license:licenseID,
                })
                return await compiledContract.save();



            }
        }
    }
}

module.exports = resolvers;
