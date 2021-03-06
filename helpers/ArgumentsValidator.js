import web3 from 'web3'
String.prototype.replaceAt = function(index, replacement) {
    if (index >= this.length) {
        return this.valueOf();
    }

    return this.substring(0, index) + replacement + this.substring(index + 1);
}
export const argumentsValidator = async (argumentsArray) => {
    let validation = true;
    for (let i = 0; i < argumentsArray.length; i++) {
        validation = await recursiveChecker(argumentsArray[i].dataType, argumentsArray[i].data)
        if (!validation) {
            return false;
        }
    }
    return validation;
}
export const argumentsConvertor = async (argumentsArray) => {
    let returnData = [];
    for (let i = 0; i < argumentsArray.length; i++) {
        let data = await recursiveConvertor(argumentsArray[i].dataType, argumentsArray[i].data, 0)
        if(CheckDimension(argumentsArray[i].dataType)===0){
            returnedArray=returnedArray.replace("[","")
            returnedArray=returnedArray.replace("]","")
        }
        try {
            returnData.push(JSON.parse(returnedArray));
        } catch (e) {
            returnData.push(returnedArray);
        }
        returnedArray = "";
    }

    return returnData;
}
const CheckDimension=(str)=>{
    let count = (str.match(/]/g) || []).length;
    if(count === 1 ){
        return 1
    }else if(count > 1 ){
        return 2
    }else {
        return 0
    }
}
export const typeDivider = async (type) => {
    let res = type.split("[");
    for (let i = 0; i < res.length; i++) {
        res[i] = res[i].replace("]", "")
    }
    return res;
}
export const isString = (string) => {
    let letters = /^[A-Za-z]+$/;
    return !!string.match(letters);
}

export const recursiveChecker = (dataType, data) => {
    let partialData
    dataType = dataType.split("[")[0];
    for (partialData of data) {
        let str = JSON.stringify(partialData)
        let count = (str.match(/]/g) || []).length;
        if (count > 1) {
            return recursiveChecker(dataType, partialData)
        } else {
            let str = JSON.stringify(partialData)
            let count = (str.match(/]/g) || []).length;
            if (count === 1) {
                return recursiveChecker(dataType, partialData)
            } else {
                switch (dataType) {
                    case 'int':
                    case 'int256':
                        if (!isInt(partialData)) {
                            return false
                        }
                        break;
                    case 'bool':
                        if (!stringTOBoolean(partialData)) {
                            return false
                        }
                        break;
                    case 'address':
                        if (!isAddress(partialData)) {
                            return false
                        }
                        break;
                    case 'string':
                    case 'bytes32':
                        if (!isString(partialData)) {
                            return false
                        }
                        break;

                    case 'Uint':
                    case 'uint256':
                        if (!isUint(partialData)) {
                            return false
                        }
                        break;
                    case 'int8':
                        if (!isInt8(partialData)) {
                            return false
                        }
                        break;
                    case 'int16':
                        if (!isInt16(partialData)) {
                            return false
                        }
                        break;
                    case 'int32':
                        if (!isInt32(partialData)) {
                            return false
                        }
                        break;
                    case 'int64':
                        if (!isInt64(partialData)) {
                            return false
                        }
                        break;
                    case 'uint8':
                        if (!isUint8(partialData)) {
                            return false
                        }
                        break;
                    case 'uint16':
                        if (!isUint16(partialData)) {
                            return false
                        }
                        break;
                    case 'uint32':
                        if (!isUint32(partialData)) {
                            return false
                        }
                        break;
                    case 'uint64':
                        if (!isUint64(partialData)) {
                            return false
                        }
                        break;
                    default:
                        return false
                }
            }
        }
    }
    return true
}

export let returnedArray = "";
const recursiveConvertor = async (dataType, data, counter) => {

    let partialData
    returnedArray = returnedArray + "["
    dataType = dataType.split("[")[0];
    let dataCounter = data.length;
    for (partialData of data) {
        dataCounter--;
        let str = JSON.stringify(partialData)
        let count = (str.match(/]/g) || []).length;
        if (count > 1) {
            await recursiveConvertor(dataType, partialData, 0)
            if (dataCounter > 0) {
                returnedArray += ","
            }
        } else {
            let str = JSON.stringify(partialData)
            let count = (str.match(/]/g) || []).length;
            if (count === 1) {
                counter = 0;
                await recursiveConvertor(dataType, partialData, counter)
                if (dataCounter > 0) {
                    returnedArray += ","
                }
            } else {
                counter++;
                switch (dataType) {
                    case 'int':
                    case 'int8':
                    case 'int16':
                    case 'int32':
                    case 'int64':
                    case 'int128':
                    case 'int256':
                    case 'uint':
                    case 'uint8':
                    case 'uint16':
                    case 'uint32':
                    case 'uint64':
                    case 'uint128':
                    case 'uint256': {
                        returnedArray = returnedArray + await stringToInt(partialData);
                    }
                        break;
                    case 'bool': {
                        returnedArray = returnedArray + await stringTOBoolean(partialData)
                    }
                        break;
                    case 'bytes32': {
                        returnedArray = returnedArray + stringToByte32Array(partialData)
                    }
                        break;
                    case 'string': {
                        returnedArray += '"' + partialData+'"'
                    }
                        break;
                    default:
                        returnedArray = returnedArray + partialData
                }
                if (counter < data.length) {
                    returnedArray += ","
                }
            }
        }

    }
    returnedArray += "]"
}
export const isNumber = async (string) => {
    let letters = /^[0-9]+$/;
    if (string.value.match(letters)) {
        return true;
    } else return false;
}

export const isInt8 = async (number) => {
    if (number >= -128 && number <= 127) {
        return true;
    } else {
        return false;
    }
}

export const isInt16 = async (number) => {
    if (number >= -32768 && number <= 32767) {
        return true;
    } else {
        return false;
    }
}
export const isInt32 = async (number) => {
    if (number >= -2147483648 && number <= 2147483647) {
        return true;
    } else {
        return false;
    }
}

export const isInt64 = async (number) => {
    if (number >= -9223372036854775808 && number <= 9223372036854775807) {
        return true;
    } else {
        return false;
    }
}

export const isInt128 = async (number) => {
    if (number >= -170141183460469231731687303715884105728 && number <= 170141183460469231731687303715884105727) {
        return true;
    } else {
        return false;
    }
}
export const isInt = async (number) => {
    if (number >= -57896044618658097711785492504343953926634992332820282019728792003956564819968 && number <= 57896044618658097711785492504343953926634992332820282019728792003956564819967) {
        return true;
    } else {
        return false;
    }
}

export const isUint = async (number) => {
    if (number >= 0 && number <= 115792089237316195423570985008687907853269984665640564039457584007913129639935) {
        return true;
    } else {
        return false;
    }
}

export const isUint128 = async (number) => {
    if (number >= 0 && number <= 340282366920938463463374607431768211455) {
        return true;
    } else {
        return false;
    }
}
export const isUint64 = async (number) => {
    if (number >= 0 && number <= 18446744073709551615) {
        return true;
    } else {
        return false;
    }
}

export const isUint32 = async (number) => {
    if (number >= 0 && number <= 4294967295) {
        return true;
    } else {
        return false;
    }
}
export const isUint16 = async (number) => {
    if (number >= 0 && number <= 65535) {
        return true;
    } else {
        return false;
    }
}
export const isUint8 = async (number) => {
    if (number >= 0 && number <= 255) {
        return true;
    } else {
        return false;
    }
}


export const isAddress = async (address) => {
    return web3.utils.isAddress(address)
}

export const isFloat = async (string) => {
    let letters = /^[-+]?[0-9]+\.[0-9]+$/;
    if (string.value.match(letters)) {
        return true;
    } else return false;
}

export const isFixedMxN = async (string, M, N) => {

}
export const stringToByte32Array = (string) => {
    return web3.utils.asciiToHex(string)
}
export const stringToInt = async (string) => {
    return parseInt(string)
}


export const stringTOBoolean = async (string) => {
    return string.toLowerCase() === "true" || string.toLowerCase() === 'false';
}

