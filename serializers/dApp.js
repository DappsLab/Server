const {pick, map} = require('lodash');

const serializeDApp = dApp => pick(dApp, [
    'id',
    'dAppName',
    'image',
    'tags',
    'dAppCategory',
    'shortDescription',
    'description',
    'singleLicensePrice',
    'publisher',
    'publishingDateTime',
    'verifiedBy',
    'verifiedDateTime',
    'verified',
    'purchasedCounts',
    'createdAt',
    'updatedAt',
]);

const serializeDApps = async(dApps)=>{
    return map(dApps, (dApp)=>{
        return serializeDApp(dApp)
    });
}

module.exports = {serializeDApp, serializeDApps};
