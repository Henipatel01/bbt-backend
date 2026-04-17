import {z} from "zod";

export const logInSchema = z.object({

    email:z
    .string()
    .trim()
    .min(1,"Email is required")
    .email({message:"Invalid Email Id"})
    ,
    
    password:z
    .string()
    .trim()
    .min(1,"Password is required")
    .min(6,{message:"Password must be 6 character long"})
    .max(255,{message:"password must not be more than 255 character"})
    
    
})

// module.exports=logInSchema;