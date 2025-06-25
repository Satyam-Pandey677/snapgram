import Postform from "@/components/forms/Postform"
import { useGetPostById } from "@/lib/react_query/queryandmutations";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom"


const UpdatePost = () => {
  const { id } = useParams();
  const {data: post, isPending} = useGetPostById(id || " ")

  if(isPending) return <Loader/>

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/add-post.svg"
          alt="" 
          width={35}
          height={35}/>
          <h2 className="h3-bold md:h2-bold text-left w-full ">Create post</h2>
        </div>
         <Postform  post={post} action="Update" />
      </div>
    </div>
  )
}

export default UpdatePost