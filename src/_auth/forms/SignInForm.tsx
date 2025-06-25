import * as z from "zod"
import {Button } from "../../components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignInValidation} from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast"
import {  useSignInAccountMutation } from "@/lib/react_query/queryandmutations";
import { useUserContext } from "@/context/AuthContext";




const SignUpForm = () => {
  const {checkAuthUser, isLoading : isUserLoading} = useUserContext()
  const { toast } = useToast()
  const {mutateAsync: createSessionLogin } = useSignInAccountMutation()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email:"",
      password:""
    },
  })

  const handleSubmit = async (user : z.infer<typeof SignInValidation>) => {
    

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
    console.log(isLogggIn);

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
          {isUserLoading ? (
            <div className="flex-center gap-2"> <Loader/> Loading...</div>
          ): "Sign up"}
        </Button>

        <p className="text-small-regular text-light-2 text-center mt-2"> Don't Have Account ? <Link to="/Sign-up" className="text-primary-500">Register</Link></p>

      </form>
      </div>
    </Form>
  )
}

export default SignUpForm