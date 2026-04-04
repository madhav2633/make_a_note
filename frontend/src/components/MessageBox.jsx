import "./MessageBox.css";

export default function MessageBox({text, type})
{
    

    return (
            <div className = {`message-box ${type}`}>
                <p>{text}</p>
            </div>
    )
};

