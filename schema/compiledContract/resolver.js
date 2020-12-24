const {SmartContract, User, Order, CompiledContract, PurchasedContract, License} = require('../../models');
const path = require('path');
const fs = require('fs');
const sol = require("solc");
import {ApolloError, AuthenticationError} from 'apollo-server-express'

let fetchData = () => {
    return CompiledContract.find();
}

const resolvers = {
    CompiledContract: {
        user: async (parent) => {
            return User.findOne({"_id": parent.user})
        },
        smartContract: async (parent) => {
            return SmartContract.findOne({"_id": parent.smartContract})
        },
        purchasedContract: async () => {
            return PurchasedContract.findOne({"_id": parent.purchasedContract})
        },
        license: async () => {
            return License.findOne({"_id": parent.license})
        },
    },
    Query: {
        compiledContracts: async (_) => {
            return await fetchData();
        },
        compiledContractById: async (_, {id}) => {
            return await CompiledContract.findById(id);
        },
        getABI: async (_, {id}, {user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                let compiled = await CompiledContract.findById(id)
                if (!compiled) {
                    return new ApolloError("CompiledContract Not Found", 400)
                }
                try {
                    const sourceFile = path.resolve('./', 'contracts/compiledContracts/', compiled.compiledFile);
                    let sourceCode = JSON.parse(await fs.readFileSync(sourceFile, 'utf8'));
                    return sourceCode.interface;
                } catch (err) {
                    return new ApolloError("Reading File Failed", 500)
                }
            } catch (err) {
                throw new ApolloError("Internal Server Error", 500)
            }
        },
        getBinary: async (_, {id}, {user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                let compiled = await CompiledContract.findById(id)
                if (!compiled) {
                    return new ApolloError("CompiledContract Not Found", 400)
                }
                try {
                    const sourceFile = path.resolve('./', 'contracts/compiledContracts/', compiled.compiledFile);
                    let sourceCode = JSON.parse(await fs.readFileSync(sourceFile, 'utf8'));
                    return sourceCode.bytecode;
                } catch (err) {
                    return new ApolloError("Reading File Failed", 500)
                }
            } catch (err) {
                return new ApolloError("Internal Server Error", 500)
            }
        }
    },
    Mutation: {
        compileContract: async (_, {newCompile}, {user, CompiledContract}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                let smartContract = await SmartContract.findById(newCompile.smartContract)
                if(!smartContract) {
                    return new ApolloError("SmartContract Not Found", 404)
                }
                let purchasedContract=null;
                let license;
                if(newCompile.purchasedContract!==undefined&&newCompile.purchasedContract!==""){
                    license = await License.findById(newCompile.license)
                    if(!license){
                        return new ApolloError("License Not Found", 404)
                    }
                    if(license.purchasedContract.toString()===newCompile.purchasedContract.toString()){
                        purchasedContract = await PurchasedContract.findById(newCompile.purchasedContract);
                        if(!purchasedContract){
                            return new ApolloError("Purchased Contract Not Found", 404)
                        }
                    }
                }
                if(!smartContract.preCompiled){
                    let filename = smartContract.source.substr(22,99);
                    filename =  filename.slice(0, -4);
                    const sourceFile=path.resolve ( './' ,'contracts',filename+'.sol');
                    let sourceCode;
                    let compiledData
                    let compiledFile;
                    try{
                        sourceCode = await fs.readFileSync (sourceFile,'utf8');
                        sol.loadRemoteVersion(smartContract.compilerVersion, function (err, solSnapshot) {
                            if (err) {
                                return new ApolloError("Compiler Version Failed", 500)
                            }
                            compiledData = solSnapshot.compile(sourceCode,1).contracts[':'+smartContract.sourceContractName];
                            compiledFile = `${filename}-${Date.now()}.json`
                            fs.writeFile( "./contracts/compiledContracts/"+compiledFile, JSON.stringify(compiledData), function(err) {
                                if (err) {
                                   return new ApolloError("WriteFile File Failed", 500)
                                }
                            })
                        })
                        // compiledData = await sol.compile(sourceCode,1).contracts[':'+smartContract.sourceContractName];
                    }catch(err){
                        console.log ("Reading File Failed", 500)
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
                    if(purchasedContract!=null){
                        await License.findByIdAndUpdate(license._id,{$set:{used:true}});
                        await License.findByIdAndUpdate(license._id,{$push:{compilations:compiledContract.id}});
                    }
                    return await compiledContract.save();
                }

            } catch (err) {
                throw new ApolloError("Internal Server Error", 500)
            }
        }
    }
}

module.exports = resolvers;
