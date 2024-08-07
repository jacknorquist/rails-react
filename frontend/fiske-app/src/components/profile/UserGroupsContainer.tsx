import React from "react";
import { ReactNode, useEffect, useState} from "react";
import FiskeAPI from "../../api.ts";
import GroupListItem from "../groups/GroupListItem.tsx";
import styles from './css/UserGroupsContainer.module.css';
import { v4 as uuidv4} from 'uuid';
import { useMessage } from "../../context/MessageContext.tsx";
import { GroupType, ProfileUserType } from "../../types.ts";



/**UserGroupsContainer: renders GroupListItems for groups that user has joined
 *
 *Props:
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
 *           id: 5
 *           }
 *    fishboard:{
 *            fish:[fish(obj), fish(obj)],
 *            id: 2,
 *                }
 *    }
 *
 *State:
 * - isGroupsOpen (boolean): if true, renders GroupListItems
 * - userGroups (array): array containing objects of groups that the user has joined
 *
 * RoutesList -> ProfileContainer -> UserGroupsContainer -> GroupListItem
 */
function UserGroupsContainer({profileUser}:
                             {profileUser: ProfileUserType}): ReactNode {

  const [userGroups,  setUserGroups] = useState<GroupType[]>([]);
  const [isGroupsOpen, setIsGroupsOpen] = useState<boolean>(false)
  const {setMessage} = useMessage();

    useEffect(() => {
      //get groups that user has joined
        async function getGroups() {
         const token: string | null = localStorage.getItem('fiske-token');
         if (token) {
           try {
             const groups: GroupType[] =
             await FiskeAPI.getUserGroups(
                                          token,
                                          profileUser.user.id
                                         );
             setUserGroups(groups);
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
     }, [profileUser]);

     //toggle isGroupsOpen
    function toggleIsGroupsOpen(){
      setIsGroupsOpen(!isGroupsOpen)
    }

    return (
        <div className={styles.container}>
          <div onClick={toggleIsGroupsOpen} className={styles.header}>
            <h6 >User Groups</h6>
            {isGroupsOpen?
            <i className="bi bi-arrow-up"></i>
            :
            <i className="bi bi-arrow-down"></i>}
          </div>
          {isGroupsOpen ?
          <div className={styles.groups}>
            {userGroups.length>0?
            userGroups.map(g=> <GroupListItem key={uuidv4()} group={g}/>)
            :
            <p>You haven't joined any groups yet.</p>}
          </div>
          :
          ""}
        </div>
    );
}

export default UserGroupsContainer;