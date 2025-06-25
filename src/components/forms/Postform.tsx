import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
 
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form"
import { Textarea } from "../ui/textarea"
import Fileuploader from "../shared/Fileuploader"
import { Input } from "../ui/input"
import { PostValidation } from "@/lib/validation"
import { Models } from "appwrite"
import { useCreatPostMutation, useUpdatePost } from "@/lib/react_query/queryandmutations"
import { useUserContext } from "@/context/AuthContext"
import {  useToast } from "@/hooks/use-toast"


type PostFormPost = {
    post?:Models.Document,
    action:'Create' | 'Update'
}

const Postform = ({post,action}: PostFormPost) => {

    const {mutateAsync:createPost, isPending:isLoadingCreate} = useCreatPostMutation()
    const {mutateAsync:updatePost, isPending:isLoadingUpdate} = useUpdatePost()
    const {user} = useUserContext()
    const {toast} = useToast()
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post? post?.caption : "",
      file: [],
      location: post? post?.location : "",
      tags:post? post?.tags.join(",") : "",

    },
  })
   
    const handleSubmit = async(value : z.infer<typeof PostValidation>) => {
      if(post && action === "Update"){
        const updatedPost = await updatePost({
          ...value,
          postId:post?.$id,
          imageId:post?.imageId,
          imageUrl : post?.imageUrl
        })

        if(!updatedPost){
          toast({
            title:"Please Try Agains"
          })
        }
        navigate(`/posts/${post.$id}`)
      }


      const newPost = await createPost({
        ...value,
        userId: user.id,
      });

      if(!newPost){
            toast({
              title: "Please try again"
        })
      }

          toast({
            title :"Post Uploaded"
          })
          navigate("/");
    }
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
      <FormField
        control={form.control}
        name="caption"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Caption</FormLabel>
            <FormControl>
              <Textarea className="shad-textarea custom-scrollbar" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="file"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Caption</FormLabel>
            <FormControl>
              <Fileuploader fieldChange = {field.onChange} mediaUrl={post?.imageUrl}/>
            </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Location</FormLabel>
            <FormControl>
            <Input type="text" className="shad-input" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}/>
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="shad-form_label">Add Tag (separated by comma " , ")</FormLabel>
            <FormControl>
              <Input 
              type="text" 
              className="shad-input" 
              placeholder="ReactJS, NextJS, NodeJS" {...field} />
            </FormControl>
            <FormMessage className="shad-form_message" />
          </FormItem>
        )}
      />
      <div className="flex gap-4 items-center justify-end">
        <Button 
        type="button" 
        className="shad-button_dark-4"
        >
            Cancel
        </Button>
        <Button 
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled = {isLoadingCreate || isLoadingUpdate}>
              {isLoadingCreate || isLoadingUpdate && "Loading..." }
              {action} Post
            </Button>
      </div>
    </form>
  </Form>
  )
}

export default Postform