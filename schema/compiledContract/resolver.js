import {BASE_URL} from "../../config";

const {SmartContract, User, CompiledContract, PurchasedContract, License, DeployedContract} = require('../../models');
const path = require('path');
const fs = require('fs');
import {ApolloError, AuthenticationError} from 'apollo-server-express'
import {solCompilerSync} from "../../utils/solcCompiler";

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
        deployments: async (parent) => {
            return DeployedContract.find({"_id": parent.deployments})
        }
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
                    let contractsFile = Object.keys(sourceCode.contracts)
                    let contract = Object.keys(sourceCode.contracts[contractsFile[0]])
                    let abi = sourceCode.contracts[contractsFile[0]][contract[0]].abi
                    return JSON.stringify(abi)
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
                    let contractsFile = Object.keys(sourceCode.contracts)
                    let contract = Object.keys(sourceCode.contracts[contractsFile[0]])
                    return sourceCode.contracts[contractsFile[0]][contract[0]].evm.bytecode.object
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
                    let filename = smartContract.source.replace(`${BASE_URL}` + "\\", "");
                    let solFile = filename
                    filename = filename.slice(0, -4);
                    const sourceFile = path.resolve('./', 'contracts', filename + '.sol');

                    let sourceCode;
                    let compiledData
                    let compiledFile;

                    try {
                        try {
                            sourceCode = await fs.readFileSync(sourceFile, 'utf8');
                        }catch (err) {
                            return new ApolloError("Reading File Failed", 500)
                        }
                        let solCompiler = await solCompilerSync(smartContract.compilerVersion);
                        if (!solCompiler) {
                            return new ApolloError("Compiler Error", 500)
                        }
                        let input = {
                            language: 'Solidity',
                            sources: {
                            },
                            settings: {
                                outputSelection: {
                                    '*': {
                                        '*': ['*']
                                    }
                                }
                            }
                        };
                        input.sources[solFile] = {
                            content: sourceCode
                        }
                        compiledData = solCompiler.compile(JSON.stringify(input))
                        compiledFile = `${filename}-${Date.now()}.json`
                        fs.writeFile("./contracts/compiledContracts/" + compiledFile, compiledData, function (err) {
                            if (err) {
                                return new ApolloError("Writing File Failed", 500)
                            }
                        })

                    }catch(err){
                        return new ApolloError("Compiling Failed", 500)
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
