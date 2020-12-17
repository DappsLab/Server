const {SmartContract, User, TestOrder, TestCompiledContract,TestPurchasedContract, TestLicense} = require('../../models');
const path = require('path');
const fs = require('fs');
const sol=require("solc");

let fetchData = () => {
    return TestCompiledContract.find();
}

const resolvers = {
    TestCompiledContract:{
        user:async (parent)=>{
            return await User.findOne({"_id":parent.user})
        },
        smartContract:async(parent)=>{
            return await SmartContract.findOne({"_id": parent.smartContract})
        },
        testPurchasedContract:async()=>{
            return await TestPurchasedContract.findOne({"_id": parent.testPurchasedContract})
        },
        testLicense:async()=>{
            return await TestLicense.findOne({"_id": parent.testLicense})
        },
    },
    Query: {
        testCompiledContracts:async (_)=>{
            return await fetchData();
        },
        testCompiledContractById:async(_,{id})=>{

            return await TestCompiledContract.findById(id);
        },
        testGetABI: async (_,{id},{user})=>{
            let compiled = await TestCompiledContract.findById(id)
            const sourceFile = path.resolve ( './' ,'contracts/compiledContracts/',compiled.compiledFile);
            let sourceCode = JSON.parse(await fs.readFileSync (sourceFile,'utf8'));
            console.log(sourceCode);
            return sourceCode.interface;
        },
        testGetBinary:async(_,{id},{user})=>{
            let compiled = await TestCompiledContract.findById(id)
            const sourceFile = path.resolve ( './' ,'contracts/compiledContracts/',compiled.compiledFile);
            let sourceCode = JSON.parse(await fs.readFileSync (sourceFile,'utf8'));
            console.log(sourceCode);
            return sourceCode.bytecode;
        }
    },
    Mutation: {
        testCompileContract:async (_,{newCompile},{user,TestCompiledContract})=>{
            let smartContract = await SmartContract.findById(newCompile.smartContract)
            let purchasedContract=null;
            let license;
            if(newCompile.testPurchasedContract!==undefined&&newCompile.testPurchasedContract!==""){
                license = await TestLicense.findById(newCompile.testLicense)
                console.log("License:",license)
                if(license.testPurchasedContract.toString()===newCompile.testPurchasedContract.toString()){
                    console.log("fetching...")
                    purchasedContract = await TestPurchasedContract.findById(newCompile.testPurchasedContract);
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
                    purchasedContractID=newCompile.testPurchasedContract;
                    licenseID=newCompile.testLicense;
                }
                let compiledContract=TestCompiledContract({
                    compilationName:newCompile.compilationName,
                    user:user.id,
                    smartContract:smartContract.id,
                    compiledFile:compiledFile,
                    testPurchasedContract:purchasedContractID,
                    testLicense:licenseID,
                })
                if(purchasedContract!=null){
                    await TestLicense.findByIdAndUpdate(license._id,{$set:{used:true}});
                    await TestLicense.findByIdAndUpdate(license._id,{$push:{testCompilations:compiledContract.id}});
                }
                return await compiledContract.save();


            }
        }
    }
}

module.exports = resolvers;
