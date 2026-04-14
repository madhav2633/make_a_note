import { Navigate } from "react-router-dom";
import { isTokenValid } from "./authFrontend";

export default function ProtectedRoute({children})
{
    if (!isTokenValid())
    {
        return <Navigate to = "/login" />;
    }
    return children;
}