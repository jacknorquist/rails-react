import React from "react";
import { ReactNode , useState} from "react";
import { useUser } from "../../context/UserContext.tsx";
import { Link} from "react-router-dom";
import CommentsContainer from "../comments/CommentsContainer.tsx";
import FiskeAPI from "../../api.ts";
import { useMessage } from "../../context/MessageContext.tsx";
import styles from './css/PostListItem.module.css'
import PostImageGallery from "./PostImageGallery.tsx";
import timeAgo from "../../helpers/timgeAgo.ts";
import {  PostType, UserType, PostFormDataType, PostListItemPropsType } from "../../types.ts";


/**PostListItem: renders individual post
 *
 *Props:
 * - post (obj): object containing individual post data like...
 *      {content:'hello',
 *       user_profile_image:'image.com',
 *       images:['image.com],
 *       group_id:2,
 *       group_name:'Walleye Fishing',
 *       username:'bob',
 *       comments:[{content:'hello', user_id:5, username:'bob', user_profile_image:'link.com'}] }
 * - updatePosts (function): function to update posts if one is deleted
 *
 *State:
 * - postState (obj): object containing individual post data
 * - isCommentsOpen (boolean): if true, CommentsContainer is rendered
 * - isButtonsOpen (boolean): if true, utitliy box is rendered
 * - isExpanded (boolean): if true, all content in post is displayed
 *
 * Homepage & GroupContainer & PostsContainer and UserPostsContainer -> PostListItem -> PostImageGallery & CommentsContainer
 */
function PostListItem({post, updatePosts}:PostListItemPropsType): ReactNode {

    const[postState, setPostState] = useState<PostType>(post);
    const [isCommentsOpen, setIsCommentsOpen] = useState<boolean>(false);
    const[isButtonsOpen, setIsButtonsOpen] = useState<boolean>(false);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const {user}:{user:UserType | null} = useUser();
    const {setMessage} = useMessage();

    //toggle isCommentsOpen to render CommentsContainer
    function toggleComments(){
        setIsCommentsOpen(true)
    }

    //update post
    async function updatePost(){
        try{
            const updatedPost:PostType =
            await FiskeAPI.getPost(
                                    localStorage['fiske-token'],
                                    post.id
                                  );
            setPostState(updatedPost)
        }catch(err:unknown){
            if (err instanceof Error) {
                setMessage(err.message, 'error');
              }else{
                setMessage('An Unknown Error Occurred', 'error')
              }
        }
    }

    //create comment
    async function createComment(formData:PostFormDataType){
        try{
         await FiskeAPI.createComment(
                                      localStorage['fiske-token'],
                                      post.group_id,
                                      post.id,
                                      formData
                                     );
        }catch(err:unknown){
            if (err instanceof Error) {
                setMessage(err.message, 'error');
              }else{
                setMessage('An Unknown Error Occurred', 'error')
              }
        }

    }

    //delete post
    async function deletePost(){
        try{
            await FiskeAPI.deletePost(
                                      localStorage['fiske-token'],
                                      post.group_id,
                                      post.id);
            updatePosts()
        }catch(err:unknown){
            if (err instanceof Error) {
                setMessage(err.message, 'error');
              }else{
                setMessage('An Unknown Error Occurred', 'error')
              }
        }
    }

    //toggle isButtonsOpen to render utility box
    function toggleButtons(){
        setIsButtonsOpen(!isButtonsOpen)
    }

    //toggle isExpanded to display entire content in post
    function toggleExpand(){
        setIsExpanded(true)
    }


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link to={`/profile/${postState.user_id}`} >
                    <img
                    src={postState.user_profile_image ||
                    `${process.env.PUBLIC_URL}/DefaultHeader.jpg`}
                    alt=""
                    className={styles.profileImage}/>
                </Link>
                <div className={styles.groupUser}>
                        <Link
                        to={`/groups/${postState.group_id}`}
                        className={styles.grouplink}>
                            <h6>{postState.group_name}</h6>
                        </Link>
                        <Link to={`/profile/${postState.user_id}`}>
                            <i className={styles.username}>{postState.username}</i>
                        </Link>
                        <i
                        style={{color:'gray'}}>
                         {' posted' + timeAgo(postState.created_at)}
                        </i>
                </div>
            </div>
            <span
            onClick={toggleButtons}
            className={`${styles.openButtonsIcon} bi bi-three-dots-vertical`}>
            </span>
            {isButtonsOpen ?
             <div className={styles.buttonscontainer}>
                {post.user_id === user!.id ?
                <span onClick={deletePost}
                className={`${styles.icon} bi bi-trash icon`}>
                </span>
                :"" }
             </div>
            :""}
            <div className={styles.content}>
                {isExpanded?
                 <div
                 className={styles.contentTextExpanded}>
                    <p>{postState.content}</p>
                 </div>
                 :
                 <div
                 className={styles.contentText}>
                    <p>{postState.content}</p>
                </div>}
                {!isExpanded ?
                <i
                style={{cursor:'pointer'}}
                onClick={toggleExpand}>
                    Read More
                </i>
                :""}
            </div>
            {postState.images.length > 0 ?
             <PostImageGallery  images={postState.images}/>
            :""}
            <div className={styles.socialContainer}>
                {!isCommentsOpen ?
                 <p
                 onClick={toggleComments}
                 className={styles.icon}>
                 Comments
                 </p>
                : ""}
            </div>
            {isCommentsOpen ?
             <CommentsContainer
             comments={postState.comments}
             updatePost={updatePost}
             createComment={createComment}/>
            :""}
        </div>
    );
}

export default PostListItem;