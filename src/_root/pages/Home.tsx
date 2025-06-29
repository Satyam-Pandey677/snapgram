import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/PostCard';
import UserCard from '@/components/shared/UserCard';
import { useGetRecentPostMutation, useGetUser } from '@/lib/react_query/queryandmutations';
import { Models } from 'appwrite';


const Home = () => {
const {data : posts, isPending : isPostLoading , isError:isErrorPosts} = useGetRecentPostMutation()

const {data : creators, isLoading : isUserLoading, isError: isErrorCreators} = useGetUser()

  if (isErrorPosts || isErrorCreators) {
    return (
      <div className="flex flex-1">
        <div className="home-container">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
        <div className="home-creators">
          <p className="body-medium text-light-1">Something bad happened</p>
        </div>
      </div>
    );
  }


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
       <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        {isUserLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="grid 2xl:grid-cols-2 gap-6">
            {creators?.documents.map((creator) => (
              <li key={creator?.$id}>
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Home