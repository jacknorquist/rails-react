import React from "react";
import { ReactNode , useState} from "react";
import { useEffect } from "react";
import FiskeAPI from "../../api.ts";
import GroupListItem from "./GroupListItem.tsx";
import SearchGroupsForm from "./SearchGroupsForm.tsx";
import styles from './css/SearchGroupsContainer.module.css'
import { v4 as uuidv4 } from 'uuid';
import { useMessage } from "../../context/MessageContext.tsx";
import { GroupType, SearchGroupFormDataType } from "../../types.ts";


/**SearchGroupsContainer: renders container to search for groups, handles updating groups when searched
 *
 *Props:
 *  - none
 *
 *State:
 * - groups (array) : array of groups like ...
 *    [{name:'group', fish_species:'walleye', area:'Minnesota', description:'group for walleyes', id:5, user_id:1 }]
 *
 * Homepage & GroupsContainer -> SearchGroupsContainer
 */
function SearchGroupsContainer(): ReactNode {
    const [groups, setGroups] = useState<GroupType[]>([]);
    const {setMessage} = useMessage();

    useEffect(() => {
      //get inital groups (all groups in db)
        async function getGroups() {
         const token:string | null = localStorage.getItem('fiske-token');
         if (token) {
           try {
             const groups:GroupType[] = await FiskeAPI.getExploreGroups(token);
             setGroups(groups)
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
     }, []);

     //update groups based on serach term
     async function updateGroups(formData: SearchGroupFormDataType){
        const token = localStorage.getItem('fiske-token');
        if (token) {
          try {
            const groups = await FiskeAPI.searchGroups(token, formData);
            setGroups(groups);
          }catch(err:unknown){
            if (err instanceof Error) {
                setMessage(err.message, 'error');
              }else{
                setMessage('An Unknown Error Occurred', 'error')
              }
            }
        }
     }


    return (

        <div className={styles.container}>
          <div className={styles.sticky}>
            <SearchGroupsForm updateGroups={updateGroups}/>
          </div>
            {groups.length>0 ?
              groups.map(g=> <GroupListItem
                              key={uuidv4()}
                              group={g}/>)
            :
              <p>No Groups Found</p>}
        </div>

      );
}

export default SearchGroupsContainer;