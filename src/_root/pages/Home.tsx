import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import { useGetRecentPostMutation } from '@/lib/react_query/queryandmutations';
import { Models } from 'appwrite';
import React from 'react'

const Home = () => {
const {data : posts, isPending : isPostLoading , isError:isErrorPost} = useGetRecentPostMutation()


console.log(posts?.documents[0].caption)

  return (
    <div className='flex flex-1'>
      <div className='home-container'>
        <div className='home-posts'>
            <h2 className='h3-bold md:h2-bold text-left w-full'>
              Home Feed
            </h2>
            {
              isPostLoading && !posts ? (
                <Loader/>
              ) : (
                <ul className='  flex-co l gap-9 w-full'>
                    {
                      posts?.documents.map((post : Models.Document,index) => (
                        <PostCard key={index} post= {post}/>
                      ))
                    }
                </ul>
              )
            }
        </div>
      </div>
    </div>
  )
}

export default Home