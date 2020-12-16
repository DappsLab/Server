const path = require('path');
const fs = require('fs');

export const getKeys = async (filename)=>{
    const sourceFile=path.resolve ( './' ,'keys',filename);
    console.log(sourceFile)
    try{
        let sourceCode= await fs.readFileSync (sourceFile,'utf8');
        let data = JSON.parse(sourceCode)
        let keys = Object.keys(data.addresses)
        let privateKeys = Object.keys(data.private_keys)
        console.log("keys:",keys)
        let accounts=[];
        let key;
        for(key of keys){
            let privateKey;
            for(privateKey of privateKeys){
                if(key === privateKey){
                    console.log("foundKey:",key)
                    console.log("foundprivateKey:",data.private_keys[privateKey])
                    let account = {
                        address:key,
                        privateKey:data.private_keys[privateKey]
                    }
                    accounts.push(account)
                }
            }

        }
        let wallet = {
            'accounts':accounts,
        }
        console.log("wallet:",wallet)
        return wallet;
    }catch(err){
        console.log(err)
    }
}
