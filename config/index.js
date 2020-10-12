import {
    config
} from 'dotenv';

const {
    parsed
} = config();

export const {
    PROD,
    SECRET,
    PORT,
    IN_PROD = PROD === 'prod',
    MNEMONIC,
    PATH,
    BASE_URL = `http://localhost:${PORT}`,
} = parsed;