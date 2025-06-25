import * as z from "zod"

export const SignUpValidation = z.object ({
    name: z.string().min(2 , {message : 'To Short'}),
    username : z.string().min(2, {message :' to Short'}),
    email: z.string().trim().email({ message: "Invalid email format" }),
    password : z.string().min(8, {message:'to Short'})

})

export const SignInValidation = z.object({
    email: z.string().trim().email({ message: "Invalid email format" }),
    password : z.string(). min(2, {message : "To Short"})
})

export const PostValidation = z.object({
    caption: z.string().min(5 , {message : 'To Short'}).max(2200, { message: "Maximum 2,200 caracters" }),
    file:z.custom<File[]>(),
    location:z.string().min(1, { message: "This field is required" }).max(1000, { message: "Maximum 1000 characters." }),
    tags:z.string()
})