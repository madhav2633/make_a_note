import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./SignupPage.css";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

import user_icon from "../../assets/user_icon.svg"
import password_icon from "../../assets/password_icon.svg"

export default function SignupPage()
{

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState({});
    const navigate = useNavigate();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    function validation()
    {
        let newErrors = {};
        const usernameTrimmed = username.trim();
        const passwordTrimmed = password.trim();
        const confirmPasswordTrimmed = confirmPassword.trim();

        if(!usernameTrimmed)
        {
            newErrors.username = "Please enter a username";
        }
        //pending: the username is taken check
        if(!passwordTrimmed)
            {
                newErrors.password = "Please enter a password"
            }
            else if(passwordTrimmed.length <= 5)
            {
                newErrors.password = "Password must be at least 6 characters."
            }
        if(!confirmPasswordTrimmed)
        {
            newErrors.confirmPassword ="Please re-enter your new password."
        }
        else if(confirmPasswordTrimmed != passwordTrimmed)
        {
            newErrors.confirmPassword = "Password did not match."
        }
        else if(confirmPasswordTrimmed.length <= 5)
        {
            newErrors.confirmPassword = "Password must be at least 6 characters."
        }

        setError(newErrors);
        return Object.keys(newErrors).length === 0;

    }

    let mismatch = false;

    if(confirmPassword.length > 0)
    {
        if (confirmPassword !== password)
        {
            mismatch = true;
        }
    }
    
    async function handleSignup()
    {
        if(!validation()) return;

        try
        {
            await createAccount();

            // IMPORTANT: clear existing session
            await fetch(`${BACKEND_URL}api/users/logout`, {
                method: "POST",
                credentials: "include"
            });

            navigate("/login");

        } catch(err) {
            setError(prev => ({...prev, username: err.message}));
        }
    }

    function loginRedirect()
    {
        navigate("/login");
    }


    async function createAccount()
    {
        const trimmedUsername = username.trim();
        const trimmedPassword = password.trim();
        const newUserData = {trimmedUsername, trimmedPassword};

        const res = await fetch(`${BACKEND_URL}api/users/signup`,
            {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(newUserData)
            }
        );

        const data = await res.json();

        if(!res.ok)
        {
            throw new Error(data.error || "Signup failed.")
        }

        return data;

    }





    return(
        <div className="signup-page">
            <div className="signup-box">
                <div className="center-all">
                    <p className="signup-text">Create your new account.</p>
                    <br/>

                    <div className="wrap-input-error">
                        <InputField
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => {setUsername(e.target.value)}}
                            icon={user_icon}
                            hasError={error.username ? true : false}

                        />
                        <p className="error-msg">{error.username ? error.username : " "}</p>
                    </div>

                    <div className="wrap-input-error">
                        <InputField
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => {setPassword(e.target.value)}}
                            icon={password_icon}
                            type="password"
                            hasError={error.password ? true : false}
                        />
                        <p className="error-msg">{error.password ? error.password : " "}</p>
                    </div>

                    <div className="wrap-input-error">
                        <InputField
                            placeholder="Re-enter new password"
                            value={confirmPassword}
                            onChange={(e)=> {
                                setConfirmPassword(e.target.value)
                            }}
                            icon={password_icon}
                            type="password"
                            hasError={mismatch ? true : false}
                        />
                        <p className="error-msg">{mismatch ? "Passwords do not match." : " "}</p>
                    </div>

                    <Button
                        variant="create-account"
                        onClick={handleSignup}
                
                    >Create Account</Button>

                    <div className="signin-redirection">
                        <br/>
                        <p>Already have an account?</p>

                        <Button
                        type="button"
                        variant="signup-redirect"
                        onClick={loginRedirect}
                        >Back to login</Button>
                    </div>
                </div>
            </div>
        </div>

    )
}