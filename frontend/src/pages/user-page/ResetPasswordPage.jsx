import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

import "./ResetPasswordPage.css"
import password_icon from "../../assets/password_icon.svg"
import user_icon from "../../assets/user_icon.svg";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function ResetPasswordPage()
{
    const [username, setUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState({});
    const navigate = useNavigate();

    function validation()
    {
        let newErrors = {};

        if(!username.trim())
        {
            newErrors.username = "Please enter your username."
        }

        if(!newPassword.trim())
        {
            newErrors.newPassword = "Please enter new password."
        }
        else if(newPassword.trim().length <= 5)
        {
            newErrors.newPassword = "Password must be atleast 6 letters."
        }
        if(!confirmNewPassword.trim())
        {
            newErrors.confirmNewPassword = "Please re-enter new password."
        }
        if(confirmNewPassword.trim() !== newPassword.trim())
        {
            newErrors.confirmNewPassword = "Password did not match."
        }

        setError(newErrors);

        return Object.keys(newErrors).length === 0;
    }


    let mismatch = false;
    if(confirmNewPassword.length > 0)
    {
        if (confirmNewPassword !== newPassword)
        {
            mismatch = true;
        }
    }

    async function handleReset(e)
    {
        e.preventDefault();
        if(!validation()) return;
        try
        {   
            const data = {username, newPassword};
            const res = await fetch(`${BACKEND_URL}api/users/resetPassword`,
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data)
                });

            const result = await res.json();
            if(!res.ok)
            {
                setError({username: result.error});
                
                setNewPassword("");
                setConfirmNewPassword("");
                return;
            }

            navigate("/login",
            {
                state: {message: result.success}
            });

        }catch(err)
        {
            console.error("Something went wrong");
        }        
    }



    function loginRedirect()
    {
        navigate("/login");
    }







    return(
        <div className="reset-page">
            <div className="reset-box">
                <form className="center-all" onSubmit={handleReset}
                    autoComplete="on">

                    <p className="signup-text">Reset password</p>
                    <br/>

                    <div>
                        <InputField
                        icon={user_icon}
                        type="text"
                        placeholder="Enter username"
                        value={username}
                        autoComplete="username"
                        name="username"
                        id="username"
                        onChange={(e) => {setUsername(e.target.value)}}
                        hasError={error.username ? true : false}
                        />
                        <p className="error-msg">{error.username ? error.username : " "}</p>
                    </div>

                    <div className="wrap-input-error">
                        
                        <InputField
                            type="password"
                            name="new-password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => {setNewPassword(e.target.value)}}
                            icon={password_icon}
                            autoComplete="new-password"
                            hasError={error.newPassword ? true : false}

                        />
                        <p className="error-msg">{error.newPassword ? error.newPassword : " "}</p>
                    </div>

                    <div className="wrap-input-error">
                        <InputField
                            type="password"
                            name="confirm-password"
                            placeholder="Re-enter new password"
                            value={confirmNewPassword}
                            onChange={(e) => {setConfirmNewPassword(e.target.value)}}
                            icon={password_icon}
                            autoComplete="new-password"
                            hasError={mismatch ? true : false}

                        />
                        <p className="error-msg">{mismatch ? "Passwords do not match." : " "}</p>
                    </div>


                        <Button
                            type="submit"
                            variant="reset-button"
                            >Reset Password</Button>

                    <div className="login-redirection">
                        <br/>
                        <p>Remember password?</p>

                        <Button
                            type="button"
                            variant="login-redirect"
                            onClick={loginRedirect}
                        >Back to login</Button>

                    </div>    
                </form>
            </div>
        </div>



    )
}