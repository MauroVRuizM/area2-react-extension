import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { auth } from '../firebase/config';
import { Popup } from '../components/Popup';

export const HomePage = () => {

  const [preMsg, setPreMsg] = useState("Loading ...");
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    checkToken();
  }, []);

  useEffect(() => {
    getLastLog();
  }, [canAccess]);

  const checkToken = async() => {
    const token = await auth.currentUser?.getIdToken();
    if(token) {
      setCanAccess(true);
    }
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
          <Popup message={preMsg}/>
        )
        : (
          <Typography>No Aceses</Typography>
        )
      }
    </>
  )
}

