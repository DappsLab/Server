const {SmartContract, User, TestCompiledContract, TestPurchasedContract, TestLicense, TestDeployedContract} = require('../../models');
const path = require('path');
const fs = require('fs');
import {solCompilerSync} from "../../utils/solcCompiler";
import {BASE_URL} from '../../config';
import {ApolloError, AuthenticationError} from 'apollo-server-express'

let fetchData = () => {
    return TestCompiledContract.find();
}

const resolvers = {
    TestCompiledContract: {
        user: async (parent) => {
            return User.findOne({"_id": parent.user})
        },
        smartContract: async (parent) => {
            return SmartContract.findOne({"_id": parent.smartContract})
        },
        testPurchasedContract: async (parent) => {
            return TestPurchasedContract.findOne({"_id": parent.testPurchasedContract})
        },
        testLicense: async (parent) => {
            return TestLicense.findOne({"_id": parent.testLicense})
        },
        testDeployments:async (parent) => {
            return TestDeployedContract.find({"_id": parent.testDeployments})
        }
        // hello tahseen Mashaidi
    },
    Query: {
        testCompiledContracts: async (_) => {
            return await fetchData();
        },
        testCompiledContractById: async (_, {id}) => {
            return await TestCompiledContract.findById(id);
        },
        testGetABI: async (_, {id}, {user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                let compiled = await TestCompiledContract.findById(id)
                if (!compiled) {
                    return new ApolloError("Test Compiled Contract Not Found", 404)
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
        testGetBinary: async (_, {id}, {user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                let compiled = await TestCompiledContract.findById(id)
                if (!compiled) {
                    return new ApolloError("Test Compiled Contract Not Found", 404)
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
        testCompiledContractVersion:async(_,{smartContractId, version},{user})=>{
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                let sourceCode;
                let compiledData
                let compiledFile;
                let abi;
                let error;

                let smartContract = await SmartContract.findById(smartContractId)
                if (!smartContract) {
                    return new ApolloError("SmartContract Not Found", 404)
                }
                if (!smartContract.preCompiled) {
                    let filename = smartContract.source.replace(`${BASE_URL}` + "/", "");
                    let solFile = filename
                    console.log("filename",filename)
                    filename = filename.slice(0, -4);
                    const sourceFile = path.resolve('./', 'contracts', filename + '.sol');
                    console.log("sourceFile",sourceFile)
                    try {
                        try {
                            sourceCode = await fs.readFileSync(sourceFile, 'utf8');
                            console.log("sourceCode",sourceCode)
                        } catch (err) {
                            return new ApolloError("Reading File Failed", 500)
                        }
                        let solCompiler = await solCompilerSync(version);
                        if (!solCompiler) {
                            return new ApolloError("Compiler Error", 500)
                        }
                        let input = {
                            language: 'Solidity',
                            sources: {},
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
                        error = compiledData.errors;
                        compiledFile = `${filename}-${Date.now()}.json`
                        fs.writeFileSync("./contracts/compiledContracts/" + compiledFile, compiledData, function (err) {
                            if (err) {
                                return new ApolloError("WriteFile File Failed", 500)
                            }
                        })
                        try {
                            const sourceFile = path.resolve('./', 'contracts/compiledContracts/', compiledFile);
                            let sourceCode = JSON.parse(await fs.readFileSync(sourceFile, 'utf8'));
                            let contractsFile = Object.keys(sourceCode.contracts)
                            let contract = Object.keys(sourceCode.contracts[contractsFile[0]])
                            abi = sourceCode.contracts[contractsFile[0]][contract[0]].abi
                            if(!abi){
                                return new ApolloError("ABI Not Created Successfully", 400)
                            }
                        } catch (err) {
                            return new ApolloError("Reading File Failed", 500)
                        }

                    } catch (err) {
                        return new ApolloError("Compiling Failed", 500)
                    }
                    return {
                        error: JSON.stringify(error),
                        abi:JSON.stringify(abi),
                    }
                }
            } catch (err) {
                throw new ApolloError("Internal Server Error", 500)
            }
        },
        testCompileContract: async (_, {newCompile}, {user, TestCompiledContract}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                let smartContract = await SmartContract.findById(newCompile.smartContract)
                if (!smartContract) {
                    return new ApolloError("SmartContract Not Found", 404)
                }
                let purchasedContract = null;
                let license;
                if (newCompile.testPurchasedContract !== undefined && newCompile.testPurchasedContract !== "") {
                    license = await TestLicense.findById(newCompile.testLicense)
                    if (!license) {
                        return new ApolloError("Test License Not Found", 404)
                    }
                    if (license.testPurchasedContract.toString() === newCompile.testPurchasedContract.toString()) {
                        purchasedContract = await TestPurchasedContract.findById(newCompile.testPurchasedContract);
                        if (!purchasedContract) {
                            return new ApolloError("Test Purchased Contract Not Found", 404)
                        }
                    }
                }
                if (!smartContract.preCompiled) {
                    let filename = smartContract.source.replace(`${BASE_URL}` + "/", "");
                    let solFile = filename
                    filename = filename.slice(0, -4);
                    console.log("filename:",filename)
                    const sourceFile = path.resolve('./', 'contracts', filename + '.sol');
                    console.log("source file:",sourceFile)
                    let sourceCode;
                    let compiledData
                    let compiledFile;

                    try {
                        try {
                            sourceCode = await fs.readFileSync(sourceFile, 'utf8');
                            console.log("source code:",sourceCode)
                        } catch (err) {
                            return new ApolloError("Reading File Failed", 500)
                        }
                        let solCompiler = await solCompilerSync(smartContract.compilerVersion);
                        if (!solCompiler) {
                            return new ApolloError("Compiler Error", 500)
                        }
                        let input = {
                            language: 'Solidity',
                            sources: {},
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
                                return new ApolloError("WriteFile File Failed", 500)
                            }
                        })

                    } catch (err) {
                        return new ApolloError("Compiling Failed", 500)
                    }
                    let purchasedContractID = "";
                    let licenseID = "";
                    if (purchasedContract) {
                        purchasedContractID = newCompile.testPurchasedContract;
                        licenseID = newCompile.testLicense;
                    }
                    let compiledContract = TestCompiledContract({
                        compilationName: newCompile.compilationName,
                        user: user.id,
                        smartContract: smartContract.id,
                        compiledFile: compiledFile,
                        testPurchasedContract: purchasedContractID,
                        testLicense: licenseID,
                    })
                    if (purchasedContract != null) {
                        await TestLicense.findByIdAndUpdate(license.id, {$set: {used: true}});
                        await TestLicense.findByIdAndUpdate(license.id, {$push: {testCompilations: compiledContract.id}});
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
