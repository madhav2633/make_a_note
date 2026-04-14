import "./button.css"

export default function Button(
    {
        children,
        onClick,
        type = "button",
        variant,
        disabled = false
    }
)

{
    
    return(
        <button className={`btn ${variant}`}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >{children}
                   </button>
        
    );
}