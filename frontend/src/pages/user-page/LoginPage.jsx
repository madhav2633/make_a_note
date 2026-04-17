import { useNavigate} from "react-router-dom"
import { useEffect, useState } from "react";

import "./LoginPage.css"
import InputField from "../../components/InputField";
import Button from "../../components/Button";

import user_icon from "../../assets/user_icon.svg"
import password_icon from "../../assets/password_icon.svg"

import { checkAuth } from "../../services/authFrontend";

export default function LoginPage()
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState({});

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    
    const navigate = useNavigate();


    function validation()
    {
        let newErrors = {};
        if(!username.trim())
        {
            newErrors.username = "Please enter a valid username.";
        }
        if(!password.trim())
        {
            newErrors.password = "Please enter a valid password.";
        }
        else if(password.length <= 5)
        {
            newErrors.password = "Password must be at least 6 characters.";
        }

        setError(newErrors);
        return Object.keys(newErrors).length === 0;

    }


    async function handleLogin(e)
    {
        e.preventDefault();
        if(!validation()) return;
        try
        {
            await authLogin();
            navigate("/notes");
        
        }catch(err)
        {
            setError(prev => ({...prev, username: err.message}))
        }

    }


    //sending login data to server using post
    async function authLogin()
    {   
        const loginData = {username, password};
        const res = await fetch(`${BACKEND_URL}api/users/login`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify(loginData)
            }
        );

        const userData = await res.json();
        if(!res.ok)
        {
            throw new Error(userData.error || "Login failed");
        }
        
        return userData;
    }



    function signupRedirect()
    {
        navigate("/signup");
    }

    function resetPasswordRedirect()
    {
        navigate("/reset-password");
    }


    useEffect(() =>
        {
            async function verify()
            {
                const ok = await checkAuth();
                if (ok)
                {
                    navigate("/notes", { replace: true });
                }
            }
            verify();
        }, []);







    return(
        <div className="login-page">
            <div className="login-box">
                <form className="center-all" onSubmit={handleLogin}>
                    <p className="welcome-text">Login to use note.</p>
                    <br/>
                    
                    <div className="wrap-input-error">
                        <InputField
                        icon={user_icon}
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        autoComplete="username"
                        name="username"
                        id="username"
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError(prev => ({...prev, username: ""}));
                        }}
                            
                        hasError = {error.username ? true : false}
                        />

                        <p className="error-msg">{error.username ? error.username : " "}</p>
                    </div>

                    <div className="wrap-input-error">
                        <InputField
                            type="password"
                            placeholder="password"
                            value={password}
                            icon={password_icon}
                            autoComplete="current-password"
                            name="password"
                            id="password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(prev => ({...prev, password: ""}))
                            }}
                            hasError = {error.password ? true : false}
                        />
                        <p className="error-msg">{error.password ? error.password : " "}</p>
                        
                        <button className="reset-password"
                            onClick={resetPasswordRedirect}
                            type="button"  
                        >reset password</button>

                    </div>
                    
                    
                    <Button
                        type="submit"
                        variant="login"
                        >Login</Button>
                    
                    <div className="signup-redirection">
                        <br/>
                        <p>Don't have an account?</p>

                        <Button
                        type="button"
                        variant="signup-redirect"
                        onClick={signupRedirect}
                        >Signup</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}