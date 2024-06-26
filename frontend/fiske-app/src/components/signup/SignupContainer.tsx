import React from "react";
import { ReactNode } from "react";
import SignupForm from "./SignupForm.tsx";
import { useError } from "../../context/ErrorContext.tsx";
import FiskeAPI from "../../api.ts";
import { useUser } from "../../context/UserContext.tsx";
import styles from '../../css/fomContainer.module.css'


function SignupContainer(): ReactNode {

    const { setError } = useError();
    const {setUser} = useUser()


  async function handleSignup(formData){

      try{
        const {user, token} = await FiskeAPI.signup(formData)
        setUser(user)
        localStorage['fiske-token'] =token
      }catch (err){
        setError(err.message)
      }

  }


    return (
        <div className={styles.container}>
        <SignupForm handleSignup={handleSignup} />
        </div>
    );
}

export default SignupContainer;