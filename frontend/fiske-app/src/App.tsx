import React from 'react';
import { ReactNode, useEffect} from 'react';
import NavBar from './components/NavBar.tsx';
import { BrowserRouter , Link} from "react-router-dom";
import RoutesList from './components/routes/RoutesList.tsx';
import { Button } from 'reactstrap';
import './App.css';
import FiskeAPI from './api.ts'
import GlobalError from './components/GlobalError.tsx';
import { LoggedInProvider } from './context/LoggedInContext.tsx';
import { useLoggedIn } from './context/LoggedInContext.tsx';
import { useUser } from './context/UserContext.tsx';
import { useError } from './context/ErrorContext.tsx';


function App(): ReactNode{
  const { loggedIn, setLoggedIn } = useLoggedIn();
  const {user, setUser} = useUser()
  const {setError} = useError()


  // if (!context) {
  //   // Handle the case where context is undefined
  //   return null; // Or any fallback UI you prefer
  // }

  useEffect(function fetchUserWhenMounted() {
    async function fetchUser() {
      if (localStorage.getItem('fiske-token')) {
        try{
          const user =await FiskeAPI.profile(localStorage['fiske-token'])
          setUser(user)
        }catch (err){
          setError('nope')
        }

      }
    }
    fetchUser();
  }, []);

  return (

      <div className="App">
        <BrowserRouter>
        {loggedIn && <NavBar />}
          <RoutesList />
          <main>
            <GlobalError />
          </main>
        </BrowserRouter>
      </div>
  );
}

export default App;
