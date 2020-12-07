const {gql} = require('apollo-server-express');


const dAppQuery = gql`
    extend type Query {
        dApps: [DApp],
        verifiedDApps:[DApp],
        searchPendingDApps:[DApp] @isAuth,
        getZip(zipInput:DAppZipInput!):String! @isAuth,
        dAppById(id:ID!): DApp,
        filterDApps(searchDApp: SearchDApp): [DApp],
        searchDApps(searchDApp: SearchDApp): [DApp],
    },

    extend type Mutation {
        createDApp(newDApp: DAppInput): DApp,! @isAuth,
        updateDApp(newDApp: DAppInput, id: ID!): DApp! @isAuth,
        deleteDApp(id: ID!): DAppMessageResponse! @isAuth,
        verifyDApp(id: ID!): DApp! @isAuth,
        cancelDApp(id: ID!): [DApp] @isAuth,
    }

`;



module.exports = dAppQuery;
