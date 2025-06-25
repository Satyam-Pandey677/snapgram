import { INewPost, INewUser, IUpdatePost } from "@/types";
import { account, AppWriteConfig, avatars, db, storage } from "./config";
import { ID, Query } from "appwrite";


export async function createUserAccount(user : INewUser) {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )

        if(!newAccount) throw Error

        const avatarUrl = avatars.getInitials(user.name)

        const newUser = await saveUserToDB ({
            accountId: newAccount.$id,
            name:newAccount.name,
            email:newAccount.email,
            username:user.username,
            imageUrl:avatarUrl
        })


        return newUser;
    } catch (error) {
        console.log(error)
    }
}


export async function saveUserToDB(user: {
    accountId:string,
    email:string,
    name:string,
    imageUrl: string,
    username?:string
}) {

    try {

        const newUser = db.createDocument(
            AppWriteConfig.databaseId,
            AppWriteConfig.userCollectionId,
            ID.unique(),
            user
        )
        return newUser
        
    } catch (error) {
        console.log(error)
    }

}


export async function createSessionLogin(user : {
    email:string,
    password:string
}){
    try {
        const session = await account.createEmailPasswordSession(
            user.email,
            user.password
        )
        return session;
    } catch (error) {
        console.log(error)
    }
}

export async function signOutAccount(){
    try {
        const session = await account.deleteSession("current")
        return session;
    } catch (error) {
        console.log(error)
    }
}

export async function getCurrentUser() {
    try {
       const  currentAccount  = await account.get()

       if(!currentAccount ) throw Error;
        
       const currentUser  = await db.listDocuments(
        AppWriteConfig.databaseId,
        AppWriteConfig.userCollectionId,
        [Query.equal('accountId', currentAccount.$id)]
       ) 

       if(!currentUser) throw Error ;

       return currentUser.documents[0]
        
    } catch (error) {
        console.log(error )
    }
}

export async function createPost(post : INewPost) {
    try {
        //upload into a storage 
        const uploadedFile = await uploadFile(post.file[0])

        if(!uploadedFile) throw Error

        //getfile Url
        const fileUrl = getFilePreview(uploadedFile.$id)

        
        if (!fileUrl || typeof fileUrl !== "string") {
            deleteFile(uploadedFile.$id);
            throw new Error("File URL is not a valid string!");
        }

        //Convert tag into an array
        const tags = post.tags?.replace(/ /g, " ").split(",") || [];

        //save post in db
        const newPost  = await db.createDocument(
            AppWriteConfig.databaseId,
            AppWriteConfig.postCollectionId,
            ID.unique(),
            {
                creator:post.userId,
                caption : post.caption,
                imageUrl : fileUrl,
                imageId: uploadedFile.$id,
                location : post.location,
                tags: tags
            }


        )

        if(!newPost) {
            deleteFile(uploadedFile.$id)
            throw Error
        }
        return newPost
        
    } catch (error) {
        console.log(error)
    }
}

export async function uploadFile(file:File) {
    try {
        const uploadedFile = await storage.createFile(
            AppWriteConfig.storageId,
            ID.unique(),
            file
        )
        return uploadedFile
        
    } catch (error) {
        console.log(error)
    }
}

export function getFilePreview(fileID: string) {
    try {
        const fileUrl = storage.getFileView(
            AppWriteConfig.storageId,
            fileID
        )
        if (!fileUrl) throw Error;
        return fileUrl;
    } catch (error) {
        console.log(error)
    }
}
export async function deleteFile(fileID:string) {
    try {
        await storage.deleteFile(
            AppWriteConfig.storageId,
            fileID
        );

        return {status : "Ok"}
    } catch (error) {
        console.log(error)
    }
}

export async function getRecentPosts() {
    const post =await db.listDocuments(
        AppWriteConfig.databaseId,
        AppWriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
    if(!post)throw Error
    return post
}

export async function likePost(postId: string, likesArray:string[]) {
    try {
        const updatedpost = await db.updateDocument(
            AppWriteConfig.databaseId,
            AppWriteConfig.postCollectionId,
            postId,
            {
                likes:likesArray
            }
        )

        if(!updatedpost) throw Error

        return updatedpost
    } catch (error) {
        console.log(error)
    }
}

export async function savePost(postId: string, userId:string) {
    try {
        const updatedPost = await db.createDocument(
            AppWriteConfig.databaseId,
            AppWriteConfig.saveCollectionId,
            ID.unique(),
            {
                post : postId,
                user: userId,
            }
        )

        if(!updatedPost) throw Error

        return updatedPost
    } catch (error) {
        console.log(error)
    }
}

export async function deleteSavedPost(saveRecordId : string) {
    try {
        const statusCode = await db.deleteDocument(
            AppWriteConfig.databaseId,
            AppWriteConfig.saveCollectionId,
            saveRecordId
        )

        if(!statusCode) throw Error

        return{status: "ok"}
    } catch (error) {
        console.log(error)
    }
}

export async function getPostById(postId:string) {
    try {
        const post = await db.getDocument(
            AppWriteConfig.databaseId,
            AppWriteConfig.postCollectionId,
            postId
        )

        return post
    } catch (error) {
        console.log(error)
    }


}

export async function getUserById(profileId:string) {
    try {
        const user = await db.getDocument(
            AppWriteConfig.databaseId,
            AppWriteConfig.userCollectionId,
            profileId
        )
        return user;
    } catch (error) {
        console.log(error)
    }
}


export async function updatePost(post : IUpdatePost) {
    const hasFileToUpdate = post?.file.length > 0 
    try {
        let image = {
            imageUrl : post.imageUrl,
            imageId : post.imageId
        }

        if(hasFileToUpdate){
            const uploadedFile = await uploadFile(post.file[0])
            if(!uploadedFile) throw Error

            const fileUrl = getFilePreview(uploadedFile.$id);
            if (!fileUrl) {
            await deleteFile(uploadedFile.$id);
            throw Error;
            }
    

            image = {...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
        }
        //getfile Url

        
        
        //Convert tag into an array
        const tags = post.tags?.replace(/ /g, " ").split(",") || [];

        //save post in db
        const updatedPost  = await db.updateDocument(
            AppWriteConfig.databaseId,
            AppWriteConfig.postCollectionId,
            post.postId,
            {
                caption : post.caption,
                imageUrl : image.imageUrl,
                imageId: image.imageId,
                location : post.location,
                tags: tags
            }


        )

        if(!updatedPost) {
            deleteFile(post.imageId)
            throw Error
        }
        return updatedPost
        
    } catch (error) {
        console.log(error)
    }
}

export async function deletePost(postId?:string , imageId? :string) {
    if(!postId || !imageId) throw Error

    try {
        await db.deleteDocument(
            AppWriteConfig.databaseId,
            AppWriteConfig.postCollectionId,
            postId
        )

        return {status : "ok"}
        
    } catch (error) {
        console.log(error)
    }
}

export async function getInfinitePost({pageParam}: {pageParam : number}) {
    const queries : any[]  = [Query.orderDesc('$updatedAt'), Query.limit(10)]

    if(pageParam){
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const posts = await db.listDocuments(
            AppWriteConfig.databaseId,
            AppWriteConfig.postCollectionId,
            queries
        )

        if(!posts) throw Error;

        return posts
    } catch (error) {
        console.log(error)
    }
}
export async function searchPost(searchTerm : string) {

    try {
        const posts = await db.listDocuments(
            AppWriteConfig.databaseId,
            AppWriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )

        if(!posts) throw Error;

        return posts
    } catch (error) {
        console.log(error)
    }
}

export async function getUsers(limit?:number) {
    const queries: any[] = [Query.orderDesc('$createdAt')];

    if(limit){
        queries.push(Query.limit(limit));
    }

    try{
        const users = await db.listDocuments(
            AppWriteConfig.databaseId,
            AppWriteConfig.userCollectionId,
            queries
        );

        if(!users) throw Error;

        return users
    }catch(error){
        console.log(error);
    }
}


