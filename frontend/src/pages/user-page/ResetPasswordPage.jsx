import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

import "./ResetPasswordPage.css"
import password_icon from "../../assets/password_icon.svg"

export default function ResetPasswordPage()
{
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState({});
    const navigate = useNavigate();

    function validation()
    {
        let newErrors = {};

        if(!newPassword.trim())
        {
            newErrors.newPassword = "Please enter new password."
        }
        if(newPassword.trim().length <= 5)
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




    function handleReset()
    {
        if(!validation()) return;
        navigate("/login");
    }

    function loginRedirect()
    {
        navigate("/login");
    }







    return(
        <div className="reset-page">
            <div className="reset-box">
                <div className="center-all">

                    <p className="signup-text">Reset password</p>
                    <br/>

                    <div className="wrap-input-error">
                        <InputField
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => {setNewPassword(e.target.value)}}
                            icon={password_icon}
                            hasError={error.newPassword ? true : false}

                        />
                        <p className="error-msg">{error.newPassword ? error.newPassword : " "}</p>
                    </div>

                    <div className="wrap-input-error">
                        <InputField
                            type="password"
                            placeholder="Re-enter new password"
                            value={confirmNewPassword}
                            onChange={(e) => {setConfirmNewPassword(e.target.value)}}
                            icon={password_icon}
                            hasError={mismatch ? true : false}

                        />
                        <p className="error-msg">{mismatch ? "Passwords do not match." : " "}</p>
                    </div>


                        <Button
                            type="button"
                            variant="reset-button"
                            onClick={handleReset}
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
                </div>
            </div>
        </div>



    )
}