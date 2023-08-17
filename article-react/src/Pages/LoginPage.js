import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import {getAuth,signInWithEmailAndPassword} from "firebase/auth";


export default function LoginPage() {
    const clearLogInInfo = {
        email: '',
        password: '',
    }
    const [error,setError]=useState('');
    const navigate=useNavigate();
    const [logInInfo, setLogInInfo] = useState(clearLogInInfo)
    async function onLogIn(){
        try{
            await signInWithEmailAndPassword(getAuth(),logInInfo.email,logInInfo.password);
            navigate("/articles");
        }
        catch(e){
            setError(e.message);
        }
        
    }
    return (
        <>
            <h1>Log In</h1>
            {error && <p className="error">{error}</p>}
            <input placeholder="Your email address" 
            value={logInInfo.email}
                onChange={e=>setLogInInfo({...logInInfo,email:e.target.value})}
            />
            <input type="password" placeholder="Your password" 
            onChange={e=>setLogInInfo({...logInInfo,password:e.target.value})}
            value={logInInfo.password}/>
            <button onClick={onLogIn}>Log In</button>
            <Link to="/create-account">Don't have an account? Create one here</Link>
        </>

    )
}