import React from "react";
import { ReactNode } from "react";
import { useMessage } from "../../context/MessageContext.tsx";
import FiskeAPI from "../../api.ts";
import { useUser } from "../../context/UserContext.tsx";
import styles from './css/EditProfileContainer.module.css'
import EditProfileForm from "./EditProfileForm.tsx";
import { UserType } from "../../types.ts";

type FormData ={
  username:string;
  first_name:string;
  last_name:string;
  bio: string;
  profile_image?: File;
  header_image?: File
}
type EditProfileContainerProps = {
  toggleEditProfileForm:()=> void;
  updateProfileUser:()=>void;
}



/**EditProfileContainer: renders EditProfileForm and handles editing profile
 *
 *Props:
 * - toggleEditProfileForm (function): toogles visibility of EditProfileContainer
 * - updateProfileUser (function): updates profile page
 *
 *State:
 * -none
 *
 * ProfileContainer -> EditProfileContainer -> EditProfileForm
 */
function EditProfileContainer({toggleEditProfileForm, updateProfileUser}:EditProfileContainerProps): ReactNode {

    const { setMessage } = useMessage();
    const {user, setUser}:{user:UserType, setUser:(arg0: UserType)=> void} = useUser()
    const currentUserId = user.id;

  //handle edit profile
  async function handleEdit(formData:FormData){

      try{
        const {user} = await FiskeAPI.editUser(formData, currentUserId , localStorage['fiske-token']);
        updateProfileUser()
        setUser(user)
        toggleEditProfileForm();
        setMessage('Profile Updated', 'success')
      }catch(err:unknown){
        if (err instanceof Error) {
            setMessage(err.message, 'error');
          }else{
            setMessage('An Unknown Error Occurred', 'error')
          }
        }

  }

    return (
        <div className={styles.editprofilecontainer}>
        <EditProfileForm  handleEdit={handleEdit} toggleEditProfileForm={toggleEditProfileForm}user={user}/>
        </div>
    );
}

export default EditProfileContainer;