import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkAuth } from "./authFrontend";

export default function ProtectedRoute({ children }) {
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        async function verify() {
            const ok = await checkAuth();
            setIsAuth(ok);
            setLoading(false);
        }

        verify();
    }, []);

    if (loading) return null;

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return children;
}