import "./MessageBox.css";

export default function MessageBox({msg})
{
    

    return (
            <div className = "message-box">
                <p>{msg.msg}</p>
            </div>
    )
};

