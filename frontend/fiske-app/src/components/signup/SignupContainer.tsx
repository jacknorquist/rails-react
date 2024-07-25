import React from "react";
import { ReactNode } from "react";
import SignupForm from "./SignupForm.tsx";
import { useMessage } from "../../context/MessageContext.tsx";
import FiskeAPI from "../../api.ts";
import { useUser } from "../../context/UserContext.tsx";
import styles from './css/SignupContainer.module.css';
import { Button } from "reactstrap";


/**SignupContainer: renders SignupForm and handles signup functionality
 *
 *Props:
 * - none
 *
 *State:
 * - none
 *
 * App -> RoutesList -> SignupContainer -> SignupForm
 */
function SignupContainer(): ReactNode {

    const { setMessage } = useMessage();
    const {setUser} = useUser()

  //handle signup for user
  async function handleSignup(formData){

      try{
        const {user, token} = await FiskeAPI.signup(formData)
        setUser(user)
        localStorage['fiske-token'] =token
      }catch (err){
        setMessage(err.message, 'error')
      }

  }


    return (
        <div className={styles.container}>
          <Button href="/login" className={styles.button}>Go to login</Button>
        <SignupForm handleSignup={handleSignup} />
        </div>
    );
}

export default SignupContainer;