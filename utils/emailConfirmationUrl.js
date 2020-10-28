export const createConfirmationUrl=async(userId)=>{
    let token = await sign(jwtPayload, SECRET, {
        expiresIn: 3600*24
    });
    return `Bearer ${token}`;
}