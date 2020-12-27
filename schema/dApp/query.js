const {gql} = require('apollo-server-express');


const dAppQuery = gql`
    extend type Query {
        dApps: [DApp],
        dAppById(id:ID!): DApp,
        verifiedDApps:[DApp],
        searchPendingDApps:[DApp] @isAuth,
        getZip(zipInput:DAppZipInput!):String! @isAuth,
        filterDApps(searchDApp: SearchDApp): [DApp],
        searchDApps(searchDApp: SearchDApp): [DApp],
    },

    extend type Mutation {
        createDApp(newDApp: DAppInput): DApp,! @isAuth,
        updateDApp(newDApp: DAppInput, id: ID!): DApp! @isAuth,
        deleteDApp(id: ID!): MessageResponse! @isAuth,
        verifyDApp(id: ID!): DApp! @isAuth,
        cancelDApp(id: ID!): DApp @isAuth,
    }

`;



module.exports = dAppQuery;
