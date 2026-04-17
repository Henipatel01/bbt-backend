import {z} from "zod";

export const signupSchema = z.object({
    name:z
    .string()
    .trim()
    .min(1, "Name is required")
    .min(3,{message:"name must be at least 3 character long"})
    .max(255,{message:"name must not be more than 255 character"}),

    email:z
    .string()
    .trim()
    .min(1, "email is required")
    .email({message:"Invalid email address"})
    .max(255,{message:"Email must not be more than 255 character"})
    ,
    
    password:z
    .string()
    .trim()
    .min(1, "Password is required")
    .min(6,{message:"Password must be at least 6 characters long"})
    .max(255,{message:"Password must not be more than 255 character"})
    
    
})
