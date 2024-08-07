import React from 'react';
import { ReactNode, } from 'react';
import NavBar from './NavBar.tsx';
import { BrowserRouter} from "react-router-dom";
import RoutesList from '../routes/RoutesList.tsx';
import GlobalMessage from './GlobalMessage.tsx';
import { useUser } from '../../context/UserContext.tsx';
import { MessageProvider } from '../../context/MessageContext.tsx';
import styles from './css/App.module.css'
import { UserType } from '../../types.ts';

/**App: renders NavBar, RoutesList and GlobalMessage
 *
 *Props:
 * - none
 *
 *State:
 * - none
 *
 * Index -> App -> RoutesList & GloablMessage & NavBar
 */
function App(): ReactNode{
  const {user}:{user:UserType | null} = useUser();

  return (
    <div >
      <MessageProvider>
        <BrowserRouter>
      <div className={styles.app}>
          <main>
          {user && <NavBar/>}
          <RoutesList />
          <GlobalMessage />
          </main>
      </div>
        </BrowserRouter>
      </MessageProvider>
    </div>
  );
}

export default App;
