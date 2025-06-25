import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import { useUserContext } from '@/context/AuthContext'
import { useGetUserById } from '@/lib/react_query/queryandmutations'
import { Link, Outlet, Route, Routes, useLocation, useParams } from 'react-router-dom'
import LikedPost from './LikedPost';

interface statBlockProps{
  value: string | number;
  label: string
}

const StatBlock = ({value,label} : statBlockProps) => (
  <div className='flex-center gap-2'>
    <p className='small-semibold lg:body-bold text-primary-500'>{value}</p>
    <p className='small-medium lg:base-medium text-light-2'>{label}</p>
  </div>
)

const Profile = () => {
  const {id} = useParams()
  const  {user} = useUserContext()
  const {pathname} = useLocation()

  const {data:profile, } = useGetUserById(id || "")
  console.log(profile)
  if(!profile)
    return (
      <div className='flex-center w-full h-full'>
        <Loader/>
      </div>
    )

  return (
    <div className='profile-container'>
      <div className='profile-inner_container'>
        <div className='flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7'>
          <img 
          src={profile.imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="profile"
          className='w-28 h-28  lg:h-36 lg:w-36 rounded-full'
          />
          <div className='flex flex-col-1 flex-1 justify-between md:md-2'>
            <div className='flex flex-col w-full mt-10'>
              <h1 className='text-center xl:text-left h3-bold md:h1-semibold w-full'>
                {profile?.name}
              </h1>
              <p className='small-regular md:body-medium text-center xl:text-left'>
                  @{profile?.username}
              </p>
            </div>

          </div>
            <div className='flex gap-8 mt-1 items-center justify-center xl:justify-start flex-wrap z-20'>
              <StatBlock value = {profile.posts.length} label = "Posts"/>
              <StatBlock value = {20} label="Followers"/>
              <StatBlock value = {20} label= "Following"/>
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {profile.bio}
            </p>
        </div>

        <div className='flex justify-center gap-4'>
          <div className={`${user.id !== profile.$id &&  "hidden"}`}>
            <Link to={`/update-profile/${profile.$id}`}
            className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${user.id !== profile.$id && "hidden"}`}
            >
              <img 
              src={"/assets/icons/edit.svg"} 
              alt="edit"
              height={20}
              width={20}
               />

               <p className='flex whitespace-nowrap small-medium'>
                  Edit
               </p>
            </Link>
          </div>
          <div className={`${user.id === id && "hidden"}`}>
            <button type='button' className='shad-button_primary px-8'>
              Follow
            </button>
          </div>
        </div>
      </div>
      {profile.$id === user.id && (
        <div className='flex max-w-5xl w-full'>
            <Link to={`/profile/${profile.$id}`}
            className={`profile-tab rounded-1-lg ${pathname === `/profile/${id}` && "!bg-dark-3"}`}>
              <img src={"/assets/icons/posts.svg"} alt="Posts" width={20} height={20} />
              Posts
            </Link>

            <Link to={`/profile/${profile.$id}/liked-posts`}
             className={`profile-tab rounded-1-lg ${pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"}`}>
              <img src={"/assets/icons/like.svg"} alt="Posts" width={20} height={20} />
              Likes
            </Link>

        </div>
      )}

      <Routes>
        <Route index element={<GridPostList posts={profile.posts} showUser={false}/>} />
        {profile.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPost />} />
        )}
      </Routes>
      <Outlet/>
    </div>
  );
};

export default Profile