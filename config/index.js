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
    TEST_NET_ADDRESS,
    TEST_NET_PORT,
    MAIN_NET_PORT,
    NET_HTTP,
    NET_WS,
    TEST_NET_HTTP = `${NET_HTTP}${TEST_NET_PORT}`,
    TEST_NET_WS = `${NET_WS}${TEST_NET_PORT}`,
    MAIN_NET_WS = `${NET_WS}${MAIN_NET_PORT}`,
    MAIN_NET_HTTP= `${NET_HTTP}${MAIN_NET_PORT}`
} = parsed;
