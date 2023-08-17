import { useEffect, useState } from "react";
import {getAuth,onAuthStateChanged} from "firebase/auth";

const useUser=()=>{
    const [user,setUser]=useState(null);
    //to see if the user has logged in or not
    const [isLoading,setIsLoading]=useState(true);
    useEffect(()=>{
        const unsubscribe=onAuthStateChanged(getAuth(),user=>{
            setUser(user);
            //changed to see if user is logged in or if user doesnt exist after logging
            setIsLoading(false);
        });
        return unsubscribe;
    },[]);
    return {user,isLoading};
}
export default useUser;