import React, {ReactNode} from 'react';
import { Alert } from 'reactstrap';
import { useMessage } from '../../context/MessageContext.tsx';
import styles from './css/GlobalMessage.module.css'


/**GlobalMessage: renders message available throughout entire app
 *
 *Props:
 * - none
 *
 *State:
 * - none
 *
 * Index -> App -> GloablMessage
 */

function GlobalMessage():ReactNode{

  const { message, messageType, clearMessage } = useMessage();

  const messageColor:string =  messageType === 'success'? 'success' : 'danger'

  return (
    <div className={styles.messageContainer} >
    <Alert
    color={`${messageColor}`}
    isOpen={!!message}
    toggle={clearMessage}>
      {message}
    </Alert>
    </div>
  );
};


export default GlobalMessage;