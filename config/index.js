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
    USERSPATH,
    ORDERSPATH,
    TESTSPATH,
    TESTORDERSPATH,
    BASE_URL = `http://localhost:${PORT}`,
    GMAIL_USER,
    GMAIL_PASSWORD,
    TEST_NET_HTTP,
    TEST_NET_WS,
    TEST_MAIN_ADDRESS,
    MAIN_NET_HTTP,
    MAIN_NET_WS,
} = parsed;
