const {gql} = require('apollo-server-express');


const testLicenseQuery = gql`
    extend type Query {
        testLicenses:[TestLicense],
        testLicenseById(id:ID!):TestLicense,
    }
    
`;



module.exports = testLicenseQuery;
