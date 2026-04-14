import "./InputField.css"
import { useState } from "react";
import eye_icon from "../assets/eye_icon.svg";
import eye_crossed_icon from "../assets/eye_crossed_icon.svg";


export default function InputField(
    {
        type = "text",
        placeholder,  //props
        value,
        onChange,
        icon,
        hasError,
        autoComplete,
        name,
        id
    })

{
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    function togglePassword()
    {
        setShowPassword(prevState => !prevState)
    }


    return(
        <div className="input-wrapper">

            <input className={`input-field ${hasError ? 'error' : ''}`}
                type={isPassword ? (showPassword ? "text" : "password") : type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                autoComplete={autoComplete}
                name={name}
                id={id}
            />
            
            
            <img src={icon} className="icon"/>

            {!!isPassword && (<img src={showPassword ? eye_crossed_icon : eye_icon}
            className="toggle-icon-pw"
            onClick={togglePassword}/>)}

        
        </div>
    )
}