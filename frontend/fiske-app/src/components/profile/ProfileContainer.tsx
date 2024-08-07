import React from "react";
import { ReactNode, useState, useEffect } from "react";
import { useUser } from "../../context/UserContext.tsx";
import ProfileCard from "./ProfileCard.tsx";
import styles from './css/ProfileContainer.module.css';
import UserAdminGroupsContainer from "./UserAdminGroupsContainer.tsx";
import FiskeAPI from "../../api.ts";
import UserPostsContainer from "./UserPostsContainer.tsx";
import CreateGroupContainer from "../groups/CreateGroupContainer.tsx";
import UserGroupsContainer from "./UserGroupsContainer.tsx";
import { useParams } from "react-router-dom";
import FishboardContainer from "../Fishboard/FishboardContainer.tsx";
import { useMessage } from "../../context/MessageContext.tsx";
import { ProfileUserType, GroupType, UserType } from "../../types.ts";

//TODO: UserAdmin groups and usergroups are handled differently, also function name in useEffect


/**ProfileContainer: renders profile page
 *
 *Props:
 * -none
 *
 *State:
 * - profileUser (obj): object containing data of the user thats profile is being viewed like...
 *    {
 *      user:
 *          {
 *           header_image_url:'link.com',
 *           profile_image_url:'link.com',
 *           first_name:'bob',
 *           last_name:'jerry',
 *           bio:'I like to fish',
 *           username: 'walleyeguy',
 *           fishboardboard_points:5,
 *           }
 *    fishboard:{
 *            fish:[fish(obj), fish(obj)],
 *            id: 2,
 *                }
 *    }
 *
 *  - userAdminGroups (array): array containing objects of groups that the user has created
 *  - isCreateGroupOpen (boolean): if true, CreateGroupContainer is rendered
 *
 * RoutesList -> ProfileContainer -> ProfileCard & FishboardContainer & UserPostsContainer & UserAdminGroupsContainer & UserGroupsContainer
 */
function ProfileContainer(): ReactNode {

  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState<boolean>(false);
  const [profileUser, setProfileUser] = useState<ProfileUserType>();
  const [userAdminGroups, setUserAdminGroups] = useState<GroupType[]>([]);
  const { id }= useParams<string>();
  const {user}:{user:UserType | null} = useUser();
  const {setMessage} = useMessage();
  const currentUserId:number = user!.id;
  //is the user that is being viewed the same as the one logged in
  let profileIsUser = currentUserId === Number(useParams().id)

    //toggle isCreateGroupOpen
    function toggleCreateGroup(){
        setIsCreateGroupOpen(!isCreateGroupOpen)
      }

    useEffect(() => {
      //get user and groups that user has created
        async function getGroups() {
         const token: string | null = localStorage.getItem('fiske-token');
         if (token && id && user) {
           try {
             const groups = await FiskeAPI.getUserAdminGroups(token, Number(id));
             const user:ProfileUserType = await FiskeAPI.getUser(token, Number(id) )
             setUserAdminGroups(groups);
             setProfileUser(user);
            }catch(err:unknown){
              if (err instanceof Error) {
                  setMessage(err.message, 'error');
                }else{
                  setMessage('An Unknown Error Occurred', 'error')
                }
              }
         }
       };

       getGroups();
     }, [id]);

     //update the profileUser
     function updateProfileUser(){
      async function getUser() {
        const token:string | null = localStorage.getItem('fiske-token');
        if (token) {
          try {
            const user = await FiskeAPI.getUser(token, Number(id))
            setProfileUser(user)
          }catch(err:unknown){
            if (err instanceof Error) {
                setMessage(err.message, 'error');
              }else{
                setMessage('An Unknown Error Occurred', 'error')
              }
            }
        }
      };

      getUser();
     }

     //update groups that user has created
     function updateUserAdminGroups(){
      async function getGroups() {
        const token: string | null = localStorage.getItem('fiske-token');
        if (token) {
          try {
            const groups = await FiskeAPI.getUserAdminGroups(token, Number(id));
            setUserAdminGroups(groups)
          }catch(err:unknown){
            if (err instanceof Error) {
                setMessage(err.message, 'error');
              }else{
                setMessage('An Unknown Error Occurred', 'error')
              }
            }
        }
      };

      getGroups();
     }

    return (
        <div className={styles.profileContainer}>
          {isCreateGroupOpen && <CreateGroupContainer
                                 toggleCreateGroup={toggleCreateGroup}
                                 updateUserAdminGroups={updateUserAdminGroups}/>}
          <div
           className={`${styles.gridcontainer} ${ isCreateGroupOpen ?
                     styles.overlay
                     : ''}`}>
            {profileUser ?
            <div className={styles.leftContainer}>
              <ProfileCard
              updateProfileUser= {updateProfileUser}
              profileIsUser={profileIsUser}
              profileUser={profileUser}
              toggleCreateGroup={toggleCreateGroup}/>
              <div className={styles.fishboardContainer}>
                <FishboardContainer
                 fishboard={profileUser.fishboard}
                 fishBoardType={'UserFishboard'}
                 profileIsUser={profileIsUser}/>
              </div>
              <UserPostsContainer profileUser={profileUser} />
            </div> :""
            }
            {profileUser ?
            <div className={styles.rightContainer}>
              {userAdminGroups ?
               <UserAdminGroupsContainer
               toggleCreateGroup={toggleCreateGroup}
               userAdminGroups={userAdminGroups}
               profileIsUser={profileIsUser}/>
               :""}
              <UserGroupsContainer profileUser={profileUser} />
            </div>
            :""}
          </div >
        </div>
    );
}

export default ProfileContainer;