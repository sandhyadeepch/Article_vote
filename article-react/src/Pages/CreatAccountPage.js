import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import {getAuth,createUserWithEmailAndPassword} from "firebase/auth";



export default function CreateAccountPage(){
    const clearAccountInfo = {
        email: '',
        password: '',
        confirmPassword:'',
    }
    const [error,setError]=useState('');
    const navigate=useNavigate();
    const [accountInfo, setAccountInfo] = useState(clearAccountInfo)
    async function createAccount(){
        try{
            if(accountInfo.password!==accountInfo.confirmPassword){
                setError('Passwords do not match!');
                return;
            }
            await createUserWithEmailAndPassword(getAuth(),accountInfo.email,accountInfo.password);
            navigate("/articles");
        }
        catch(e){
            setError(e.message);
        }

    }
    
    return (
        <>
            <h1>Create Account</h1>
            {error && <p className="error">{error}</p>}
            <input placeholder="Your email address" 
            value={accountInfo.email}
                onChange={e=>setAccountInfo({...accountInfo,email:e.target.value})}
            />
            <input type="password" placeholder="Your password" 
            onChange={e=>setAccountInfo({...accountInfo,password:e.target.value})}
            value={accountInfo.password}/>
            <input type="password" placeholder="Re-enter your password" 
            onChange={e=>setAccountInfo({...accountInfo,confirmPassword:e.target.value})}
            value={accountInfo.confirmPassword}/>
            <button onClick={createAccount}>Create Account</button>
            <Link to="/login">Already have an account? Log in here</Link>
        </>

    )
}