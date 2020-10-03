import * as yup from 'yup';

/**
 * USER MODEL Validation Rules
 */

const userName = yup
    .string()
    .required('userName is required.')
    .min(5, 'userName should have atleast 5 characters.')
    .max(20, 'userName should have atmost 10 characters.')
    .matches(/^\w+$/, 'Should be alphanumeric.');

const fullName = yup
    .string()
    .required('fullName is required.')
    .min(3, 'fullName should have atleast 3 characters.');


const email = yup
    .string()
    .required('Email is required.')
    .email('This is invalid email.');

const password = yup
    .string()
    .required("Password is required.")
    .min(5, 'Password should have atleast 5 characters.')
    .max(10, 'Password should have atmost 10 characters.');

// User Registeration Validation Schema
export const UserRegisterationRules = yup.object().shape({
    userName,
    password,
    fullName,
    email
});

// User Authentication Validation Schema
export const UserAuthenticationRules = yup.object().shape({
    userName,
    password
});