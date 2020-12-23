import {ApolloError, AuthenticationError} from "apollo-server-express";
import lodash from "lodash"
import {serializeDApp, serializeDApps} from '../../serializers'
import {BASE_URL} from '../../config';

const path = require('path');
const fs = require('fs');
const {DApp, User, License} = require('../../models');
const dateTime = require('../../helpers/DateTimefunctions');

let fetchData = async () => {
    return DApp.find()
}

const resolvers = {
    DApp: {
        publisher: async (parent) => {
            return User.findOne({"_id": parent.publisher})
        },
        verifiedBy: async (parent) => {
            return User.findOne({"_id": parent.verifiedBy})
        },
    },
    Query: {
        dApps: async (_, {}, {}) => {
            return serializeDApps(await fetchData());
        },
        verifiedDApps: async (_, {}, {}) => {
            return serializeDApps(await DApp.find({verified: "VERIFIED"}));
        },
        dAppById: async (_, args) => {
            return serializeDApp(await DApp.findById(args.id));
        },
        filterDApps: async (_, {searchDApp}) => {
            try {
                let filterCategory;
                if (searchDApp.dAppCategory !== [] && searchDApp.dAppCategory !== undefined && searchDApp.dAppCategory !== "" && searchDApp.dAppCategory[0] !== '' && searchDApp.dAppCategory[0] !== undefined) {
                    filterCategory = {
                        '$in': searchDApp.dAppCategory
                    }
                } else {
                    filterCategory = {$ne: null}
                }

                let filterTags;
                if (searchDApp.tags !== [] && searchDApp.tags !== undefined && searchDApp.tags !== "" && searchDApp.tags[0] !== '' && searchDApp.tags[0] !== undefined) {
                    filterTags = {
                        '$in': searchDApp.tags
                    }
                } else {
                    filterTags = {$ne: null}
                }

                let filterName;
                if (searchDApp.dAppName !== [] && searchDApp.dAppName !== undefined && searchDApp.dAppName !== "") {
                    filterName = {"$regex": searchDApp.dAppName, "$options": "i"}
                } else {
                    filterName = {$ne: null}
                }

                let filter = {
                    verified: "VERIFIED",
                    dAppName: filterName,
                    dAppCategory: filterCategory,
                    tags: filterTags,
                };


                let SortBy;
                if (searchDApp.sortBy !== "" && searchDApp.sortBy !== undefined) {
                    if (searchDApp.sortBy === 'NEWEST') {
                        SortBy = {createdAt: -1}
                    } else if (searchDApp.sortBy === 'LOW_TO_HIGH') {
                        SortBy = {singleLicensePrice: 1}
                    } else if (searchDApp.sortBy === 'HIGH_TO_LOW') {
                        SortBy = {singleLicensePrice: -1}
                    } else if (searchDApp.sortBy === 'TOP_SOLD') {
                        SortBy = {purchasedCounts: -1}
                    }
                } else {
                    SortBy = 0;
                }

                let response = await DApp.find(filter).sort(SortBy)
                if (!response) {
                    return new ApolloError("DApp Not Found", 404)
                }
                let {
                    minPrice,
                    maxPrice
                } = searchDApp
                if (minPrice === undefined && maxPrice === undefined) {
                    minPrice = 0;
                    maxPrice = 999999999;
                }
                let filteredResponse = lodash.remove(response, (n) => {
                    if ((parseFloat(n.singleLicensePrice) <= parseFloat(maxPrice)) && (parseFloat(n.singleLicensePrice) >= parseFloat(minPrice))) {
                        return n;
                    }
                });
                return serializeDApps(filteredResponse)
            } catch (err) {
                throw new ApolloError("Internal Server Error", 500)
            }
        },
        searchDApps: async (_, {searchDApp}) => {
            try {
                let filter = {
                    verified: "VERIFIED",
                    '$or': [
                        {dAppName: {"$regex": searchDApp.dAppName, "$options": "i"}},
                        {tags: {"$regex": searchDApp.dAppName, "$options": "i"}}
                    ]
                };
                let response = await DApp.find(filter)
                if (!response) {
                    return new ApolloError("DApp Not Found", 404)
                }
                return serializeDApps(response)
            } catch (err) {
                throw new ApolloError("Internal Server Error", 500)
            }
        },
        searchPendingDApps: async (_, {}, {user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            if (user.type === "ADMIN") {
                return serializeDApps(await DApp.find({verified: "PENDING"}));
            } else {
                return new ApolloError("UnAuthorized User", 403)
            }
        },
        getZip: async (_, {zipInput}, {user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                let license;
                if (zipInput.purchasedDApp !== undefined && zipInput.purchasedDApp !== "") {
                    license = await License.findById(zipInput.license)
                    if (!license) {
                        return new ApolloError("License Not Found", 404)
                    }
                    if (license.purchasedDApp.toString() === zipInput.purchasedDApp.toString()) {
                        let data = await DApp.findOne({"_id": zipInput.dApp});
                        if (!data) {
                            return new ApolloError("DApp Not Found", 404)
                        }
                        license.used = true;
                        license.save();
                        return data.zip;
                    }
                } else {
                    return new ApolloError("UnAuthorized User", 403)
                }
            } catch (err) {
                throw new ApolloError("Internal Server Error", 500)
            }
        },
    },
    Mutation: {
        cancelDApp: async (_, {id}, {user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            if (user.type === "ADMIN") {
                try {
                    let dApp = {
                        verifiedBy: user.id,
                        verifiedDateTime: dateTime(),
                        verified: "REJECTED",
                    };
                    let response = await DApp.findByIdAndUpdate(id, {$set: dApp}, {new: true})
                    return serializeDApp(response)
                } catch (err) {
                    throw new ApolloError("Internal Server Error", 500);
                }
            } else {
                throw new ApolloError("UnAuthorized User", 403);
            }
        },
        createDApp: async (_, {newDApp}, {DApp, user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {

                let dApp;
                let filename = newDApp.zip.substr(22, 99);
                filename = filename.slice(0, -4);
                let newfilename = filename + `${Date.now()}`
                const sourceFile = path.resolve('./', 'dapps', newfilename + '.zip');
                const oldSourceFile = path.resolve('./', 'dapps', filename + '.zip');
                try {
                    fs.renameSync(oldSourceFile, sourceFile);
                    newDApp.zip = `${BASE_URL}${newfilename}.zip`;
                } catch (err) {
                    return new ApolloError("Reading File Failed", 500)
                }
                dApp = DApp({
                    ...newDApp,
                    publisher: user.id,
                    publishingDateTime: dateTime(),
                });
                let result = await dApp.save();
                let response = await User.findById(user.id);
                response.dApps.push(result._id);
                response.save();
                result = {
                    ...result.toObject(),
                    id: result._id.toString()
                }
                return serializeDApp(result)
            } catch (err) {
                return new ApolloError("Internal Server Error", 500)
            }
        },
        updateDApp: async (_, {newDApp, id}, {DApp, user}) => {
            if (!user) {
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                if (!!newDApp.zip) {
                    let filename = newDApp.zip.substr(22, 99);
                    filename = filename.slice(0, -4);
                    let newfilename = filename + `${Date.now()}`
                    const sourceFile = path.resolve('./', 'dapps', newfilename + '.zip');
                    const oldSourceFile = path.resolve('./', 'dapps', filename + '.zip');
                    try {
                        fs.renameSync(oldSourceFile, sourceFile);
                        newDApp.zip = `${BASE_URL}${newfilename}.zip`;
                    } catch (err) {
                        return new ApolloError("Reading File Failed", 500)
                    }
                } else {
                    delete newDApp.zip
                }
                let DApp = {
                    ...newDApp,
                    verified:"PENDING"
                }
                let response = await DApp.findByIdAndUpdate(id, DApp, {new: true})
                if (!response) {
                    return new ApolloError("Update Failed", 500);
                }
                return serializeDApp(response)

            } catch (err) {
                throw new ApolloError("Internal Server Error", 500);
            }
        },
        deleteDApp: async (_, {id},{user}) => {
            if(!user){
                return new AuthenticationError("Authentication Must Be Provided")
            }
            try {
                let response = await DApp.findByIdAndDelete(id);
                if (!response) {
                    return new ApolloError("DApp Not Found", 404);
                }
                return {
                    success: true,
                    message: "DApp Deleted Successfully"
                }
            } catch (err) {
                throw new ApolloError("Internal Server Error", 500);
            }
        },
        verifyDApp: async (_, {id}, {DApp, user}) => {
            if (!user){
                return new AuthenticationError("Authentication Must Be Provided")
            }
            if (user.type === "ADMIN") {
                try {
                    let dApp = {
                        verified: "VERIFIED",
                        verifiedBy: user.id,
                        verifiedDateTime: dateTime(),
                    };
                    let response = await DApp.findByIdAndUpdate(id, {$set: dApp}, {new: true})
                    if (!response) {
                        return new ApolloError("DApp Not Found", 404)
                    }
                    return serializeDApp(response)

                } catch (err) {
                    throw new ApolloError("Internal Server Error", 500);
                }
            } else {
                throw new ApolloError("UnAuthorized User", 403);
            }
        },
    }
}

module.exports = resolvers;
