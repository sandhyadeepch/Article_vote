import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";
import articles from "./Article-content";
import { CommentsList } from "../components/CommentsList";
import { AddCommentForm } from "../components/AddNewComment";
import useUser from "../hooks/useUser";
import NotFound from "./NotFoundPage";

const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [],canUpvote:false});
  
    const { articleId } = useParams();
    const {user,isLoading}=useUser();
    const navigate=useNavigate();

    useEffect(() => {
        const loadArticleInfo = async () => {
          
            const token=user && await user.getIdToken();
            const headers=token?{authtoken:token}:{};
               try{
                const response = await axios.get(`/api/article/${articleId}`,{
                    headers
                });
                const newArticleInfo = response.data;
                 setArticleInfo(newArticleInfo);
               }
               catch(error){
                   console.log("error"+ error);
               }
  
        }
        if(isLoading){
            loadArticleInfo();
        }
  
        
    }, [isLoading,user,articleId])
    const { canUpvote }=articleInfo;
    // console.log(articleInfo);

    const article = articles.find(article => article.name === articleId);
    const addUpVote = async () => {
        const token=user && await user.getIdToken();
        const headers=token?{authtoken:token}:{};
        try{
            const response = await axios.put(`/api/article/${articleId}/upvote`,null,{headers});
            const updatedArticle = response.data;
            setArticleInfo(updatedArticle);
        }
        catch(error){
            console.error(error);
        }
       
    }
    if (!article) {
        return <NotFound />
    }

    // const {canUpvote}=articleInfo;
    return (
        <>
            <h1>{article.title}</h1>
            <div className="upvotes-section">
            {user?<button onClick={addUpVote}>{canUpvote?"Upvote":"Already Upvoted!"}</button>
            :<button onClick={()=>{
                        navigate("/login");
                    }}>Log in to Upvote</button>
            }
                
                <p>This Article has {articleInfo.upvotes} upvote(s).</p>
            </div>

            {article.content.map((paragraph, i) => (

                <p key={i}>{paragraph}</p>
            ))}
            {user? <AddCommentForm articleName={articleId} onArticleUpdated={
                (updatedArticle)=>setArticleInfo(updatedArticle)}/>:
               <button onClick={()=>{
                        navigate("/login");
                    }}>Log in to Add Comment</button> }
           
                <CommentsList comments={articleInfo.comments} />
        </>
    );
}
export default ArticlePage;
