import GridPostList from '@/components/shared/GridPostList'
import Loader from '@/components/shared/Loader'
import { useGetCurrentUser } from '@/lib/react_query/queryandmutations'

const LikedPost = () => {

    const {data:currentUser} = useGetCurrentUser()
    if(!currentUser){
        return(
            <div className='flex-center w-full h-full'>
                <Loader/>
            </div>

        )
    }
  return (

    <div>
        {currentUser.liked.length === 0 && (
            <p className='text-light-4'>No Likes</p>
        )}

        <GridPostList posts={currentUser?.liked} showState={false} />
    </div>
  )
}

export default LikedPost