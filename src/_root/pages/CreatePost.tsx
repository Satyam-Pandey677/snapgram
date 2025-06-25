import Postform from "@/components/forms/Postform"



const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/add-post.svg"
          alt="" 
          width={35}
          height={35}/>
          <h2 className="h3-bold md:h2-bold text-left w-full ">Edit post</h2>
        </div>
         <Postform action="Create"/>
      </div>
    </div>
  )
}

export default CreatePost