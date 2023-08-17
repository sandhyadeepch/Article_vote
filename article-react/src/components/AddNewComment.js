import { useState } from "react";
import axios from "axios";
import useUser from "../hooks/useUser";
export function AddCommentForm({articleName,onArticleUpdated}){
// const clearCommentInfo={
//     name:'',
//     CommentText:'',
// }
const [commentText,setCommentText]=useState("");
const {user}=useUser();
    
    async function onAddComment(){
        const token=user && await user.getIdToken();
        const headers=token?{authtoken:token}:{};
    

        //e.preventDefault();
        try{
            const response=await axios.post(`/api/article/${articleName}/comments`,{
                postedBy:user ? user.email: "",
                text:commentText,
            },{headers});
            const updatedArticle=response.data;
            onArticleUpdated(updatedArticle);
            console.log(updatedArticle);
            setCommentText("");
            
        }
        catch(error){
            console.error("error"+ error.response);
        }
        
    }
    
return(
    <div id="add-comment-form">
        <h3>Add a Comment:</h3>
        {/* <label>Name:
        <input type="text" value={comments.name}
            onChange={e=>setComments({...comments,name:e.target.value})}
        />
        </label> */}
       {user && <p>You are posting as {user.email}</p> }
       
        <input type="textarea" value={commentText}
        onChange={e=>setCommentText(e.target.value)}
        rows="4" cols="50"/>
        <button onClick={onAddComment}>Add Comment</button>
    </div>
)

}