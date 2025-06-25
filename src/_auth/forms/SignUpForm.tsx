import * as z from "zod"
import {Button } from "../../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignUpValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"
import { useCreateUserAccountMutation, useSignInAccountMutation } from "@/lib/react_query/queryandmutations";
import { useUserContext } from "@/context/AuthContext";




const SignUpForm = () => {
  const {checkAuthUser, isLoading : isUserLoading} = useUserContext()
  const { toast } = useToast()
  const {mutateAsync: createUserAccount ,isPending: isCreatingUSer} = useCreateUserAccountMutation()
  const {mutateAsync: createSessionLogin, isPending:isSigningIn } = useSignInAccountMutation()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof SignUpValidation>>({
    resolver: zodResolver(SignUpValidation),
    defaultValues: {
      name: "",
      username: "",
      email:"",
      password:""
    },
  })

  const handleSubmit = async (user : z.infer<typeof SignUpValidation>) => {
    const newUser = await createUserAccount(user)
    if(!newUser) {
      return toast({
        title: "Sign Up Failed",
      })
    }

    const session = await createSessionLogin( {
      email: user.email,
      password : user.password
    }) 

    if(!session) {
      return toast({
        title : "Sign In fail, please try again!!"
      })
    }
    const isLogggIn = await checkAuthUser() 

  if(isLogggIn) {
    form.reset();
    navigate("/")
  }else {
    return toast({
      title : "SignUp fail, please try again"
    })
  }
  }

  
  return ( 
      <Form {...form}>

        <div className="sm:w-420 flex-center flex-col h-1/2">
          <img src="/assets/images/logo.svg" alt=""  />
          <h2 className="h2-bold md:h2-bold pt-5 sm:pt-12">Create New Account</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2" >To use Social enter your details</p>
        
      <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-2 w-full mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Name</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Email</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Password</FormLabel>
              <FormControl>
                <Input type="password" className="shad-input" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="shad-button_primary mt-2">
          {isCreatingUSer || isSigningIn || isUserLoading? (
            <div className="flex-center gap-2"> <Loader/> Loading...</div>
          ): "Sign Up"}
        </Button>

        <p className="text-small-regular text-light-2 text-center mt-2"> Already Have Account ? <Link to="/Sign-in" className="text-primary-500">Login</Link></p>

      </form>
      </div>
    </Form>
  )
}

export default SignUpForm