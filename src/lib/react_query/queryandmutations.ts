import {  useQueries, useMutation, useQueryClient, useInfiniteQuery, useQuery, QueryClient, } from "@tanstack/react-query";
import { createPost, createSessionLogin, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePost, getPostById, getRecentPosts, getUserById, getUsers, likePost, savePost, searchPost, signOutAccount, updatePost } from "../AppWrite/api";
import { INewPost, INewUser, IUpdatePost } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccountMutation = () => {
    return useMutation({
        mutationFn : (user : INewUser) => createUserAccount(user)
    })
}

export const useSignInAccountMutation = () => {
    return useMutation({
        mutationFn : (user : 
            {
                email: string,
                password: string
            }
        ) => createSessionLogin(user)
    })
}

export const useSignOutAccountMutation = () => {
    return useMutation({
        mutationFn : signOutAccount,
    })
}

export const useCreatPostMutation = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn : (user : INewPost) => createPost(user),
        onSuccess : () => {
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useGetRecentPostMutation = () => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_RECENT_POSTS],
        queryFn:getRecentPosts,
    })
}

export const useLikePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : ({ postId , likeArray } : {postId:string , likeArray:string[]}) =>likePost(postId, likeArray),
            onSuccess : (data) => {
                queryClient.invalidateQueries({
                    queryKey :[QUERY_KEYS.GET_POST_BY_ID, data?.$id]
                })
                queryClient.invalidateQueries({
                    queryKey :[QUERY_KEYS.GET_RECENT_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey :[QUERY_KEYS.GET_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey :[QUERY_KEYS.GET_CURRENT_USER]
                })
            }
    })
}

export const useSavePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : ({ postId , userId } : {postId:string , userId:string}) =>savePost(postId, userId),
            onSuccess : () => {
                queryClient.invalidateQueries({
                    queryKey :[QUERY_KEYS.GET_RECENT_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey :[QUERY_KEYS.GET_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey :[QUERY_KEYS.GET_CURRENT_USER]
                })
            }
    })
}

export const useDeletePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn : ( saveRecoredId:string) =>deleteSavedPost(saveRecoredId),
            onSuccess : () => {
                queryClient.invalidateQueries({
                    queryKey :[QUERY_KEYS.GET_RECENT_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey :[QUERY_KEYS.GET_POSTS]
                })
                queryClient.invalidateQueries({
                    queryKey :[QUERY_KEYS.GET_CURRENT_USER]
                })
            }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn:getCurrentUser
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn:() => getPostById(postId),
        enabled: !!postId
    })
}
export const useUpdatePost = () => {
   const queryClient = useQueryClient()

   return useMutation({
    mutationFn : (post : IUpdatePost) => updatePost(post),
    onSuccess : (data) => {
        queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_POST_BY_ID,data?.$id]
        })
    }
   })
}


export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
        deletePost(postId, imageId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
};

export const useGetPost = () => {
    return useInfiniteQuery({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePost as any,
        initialPageParam:null,
        getNextPageParam: (lastPage : any ) => {
            if(lastPage && lastPage.documents.length === 0){
                return null;
            }
                 
            const lastId = lastPage.documents[lastPage.documents.length -1].$id;
            return lastId;
        },
    });
};

export const useSearchpost = (searchTerm : string) => {
    return useQuery({
        queryKey : [QUERY_KEYS.SEARCH_POSTS,searchTerm],
        queryFn: () => searchPost(searchTerm),
        enabled: !!searchTerm

    })
}

export const useGetUserById = (userId : string) => {
    return useQuery({
        queryKey : [QUERY_KEYS.GET_USER_BY_ID,userId],
        queryFn : () => getUserById(userId),
        enabled : !!userId
    })
}

export const useGetUser = (limit?: number) =>{
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USERS],
        queryFn:() => getUsers(limit) 
    })
}