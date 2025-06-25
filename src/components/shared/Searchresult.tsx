import { Models } from 'appwrite'
import { Loader } from 'lucide-react';
import React from 'react'
import GridPostList from './GridPostList';


type SearchResultProp = {
  isSearchFetching:boolean;
  searchPosts: Models.Document[];
}

const Searchresult = ( { isSearchFetching, searchPosts} : SearchResultProp) => {
  if(isSearchFetching) return <Loader/>

  if(searchPosts && searchPosts.documents.length > 0){ 
    return (<GridPostList posts={searchPosts.documents}/>)
  }
  return (
    <p className='text-light-4 mt-10 text-center w-full'>Not Result Found</p>
  )
}

export default Searchresult