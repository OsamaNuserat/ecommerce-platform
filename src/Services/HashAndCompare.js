import bycrptjs from "bcryptjs";

export const hashPassword = (password , saltRound = parseInt(process.env.SALT_ROUND)) => {
    return bycrptjs.hashSync(password , saltRound);
}

export const comparePassword = (password, hashPassword)=> {
    return bycrptjs.compareSync(password , hashPassword);
}