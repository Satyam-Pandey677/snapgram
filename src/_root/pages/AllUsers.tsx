import Loader from '@/components/shared/Loader'
import UserCard from '@/components/shared/UserCard'
import { toast } from '@/hooks/use-toast'
import { useGetUser } from '@/lib/react_query/queryandmutations'


const AllUsers = () => {
  const{data: creators, isLoading, isError:isErrorCreators} = useGetUser()

  if(isErrorCreators){
    toast({title:"Somthing went wrong."});

    return;
  }
  return (
    <div className='common-container'>
      <div className='user-container'>
        <h2 className='h3-bold md:h2-bold text-left w-full'>All Users</h2>
        {isLoading && !creators ? (
          <Loader/>
        ):(
          <ul className='user-grid'>
            {creators?.documents.map((creator) => (
              <li key={creator?.$id} className='flex-1 min-w-[200pxs] w-full'>
                <UserCard user={creator}/>
              </li>
            ))}
          </ul>
        )
        }
      </div>
    </div>
  )
}

export default AllUsers