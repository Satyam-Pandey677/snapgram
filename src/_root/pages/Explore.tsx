import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import Searchresult from '@/components/shared/Searchresult';
import useDebounce from '@/hooks/useDebouncing';
import { useGetPost, useSearchpost } from '@/lib/react_query/queryandmutations';
import { useInView} from 'react-intersection-observer'
import { useState,useEffect } from 'react'

const Explore = () => {
  const {ref, inView} = useInView()
  const {data:posts, fetchNextPage, hasNextPage } = useGetPost();

  const [searchValue, setSearchValue] = useState("")
  const debouncedValue = useDebounce(searchValue,500)
  const {data : searchPost , isFetching : isSeachFeching} = useSearchpost(debouncedValue)

  useEffect(()=> {
    if(inView && !searchValue) fetchNextPage();
  }, [inView,searchValue])

  if(!posts){
    return( 
    <div className='flex-center w-full h-full'>
      <Loader/>
    </div>)
  }


   const shouldShowSearchResult = searchValue !== "";
   const shouldShowPost = !shouldShowSearchResult && posts.pages.every((item) => item.documents.length === 0)


  return (
    <div className='explore-container'>
      <div className='explore-inner_container'>
        <h2 className='h3-bold md:h2-bold w-full'>Search Posts</h2>
        <div className='flex gap-1 px-4 w-full rounded-lg bg-dark-4'>
          <img
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
           />
           <input
           type="text"
           placeholder='Search'
           className='explore-search w-full'
           value={searchValue}
           onChange={(e) => setSearchValue(e.target.value)}
            />
        </div>
      </div>

      <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
        <h3 className='body-bold md:h3-bold'>Popular Today</h3>
        <div className='flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer'>
          <p className='small-medium md:base-medium text-light-2'>All</p>
          <img
          src="/assets/icons/filter.svg"
          width={20}
          height={20}
          alt="Filter"
          />
        </div>
      </div>

       <div className='flex flex-wrap gap-9 w-full max-w-5xl '>
        {shouldShowSearchResult ? (
          <Searchresult isSearchFetching = {isSeachFeching} searchPosts = {searchPost?.documents ?? []}/>
        ):shouldShowPost? (
          <p className='text-light-4 text-center w-full'>End of post</p>
        ): posts.pages.map((item,index) => (
          <GridPostList key={`page-${index}`} posts={item.documents}/>
        ))}
      </div> 

      {
        hasNextPage && !searchValue && (
          <div ref={ref} className='mt-10'>
            <Loader/>
          </div>
        )}
    </div>
  )
}

export default Explore