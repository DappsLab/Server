const sol=require("solc");

export const solCompiler=(version="v0.7.5+commit.eb77ed08")=>{
    return new Promise((resolve, reject)=>{
        sol.loadRemoteVersion(version, function(err,solcSnapshot){
            if (err){
                reject(err)
            }else{
                resolve(solcSnapshot)
            }
        })
    });

}

export const solCompilerSync = async(version)=>{
    try{
        return await solCompiler(version)
    }catch(err){
        console.log("Compiler Error:",err)
    }
}

