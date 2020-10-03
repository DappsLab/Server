import {
    config
} from 'dotenv';

const {
    parsed
} = config();

export const {
    PROD,
    SECRET,
    IN_PROD = PROD === 'prod',
    MNEMONIC,
    PATH
} = parsed;