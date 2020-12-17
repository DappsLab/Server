const {gql} = require('apollo-server-express');


const testLicenseQuery = gql`
    extend type Query {
        testLicenses:[TestLicense],
        TestLicenseById(id:ID!):TestLicense,
    }
    
`;



module.exports = testLicenseQuery;
