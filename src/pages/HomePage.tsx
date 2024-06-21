import { useEffect, useState } from 'react';
import { Popup } from '../components/Popup';
import { Login } from '../components/Login';

export const HomePage = () => {

  const [preMsg, setPreMsg] = useState("Loading ...");
  const [canAccess, setCanAccess] = useState(true);

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    getLastLog();
  }, [canAccess]);

  const checkToken = async() => {
    const { token } = await chrome.storage.session.get('token');
    console.log(token);
    if(token) {
      setCanAccess(true);
      return;
    }
    setCanAccess(false);
  }

  const getLastLog = () => {
    if(!canAccess) {return;}
    chrome.runtime.sendMessage({ type: 'get_last_log' }, (response) => {
      if (response && response.data) {
        setPreMsg(JSON.stringify(response.data, null, 2));
      } else {
        setPreMsg("No logs available.");
      }
    });
  }

  return (
    <>
      {
        canAccess
        ? (
          <Popup message={preMsg} checkToken={checkToken} needDelay={!canAccess}/>
        )
        : (
          <Login checkToken={checkToken}/>
        )
      }
    </>
  )
}

