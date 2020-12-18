const {gql} = require('apollo-server-express');


const licenseQuery = gql`
    extend type Query {
        licenses:[License],
        licenseById(id:ID!):License,
    }
    
`;

module.exports = licenseQuery;
