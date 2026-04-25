import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import NotePage from "./pages/note-page/NotePage";
import LoginPage from "./pages/user-page/LoginPage";
import SignupPage from "./pages/user-page/SignupPage";
import ResetPasswordPage from "./pages/user-page/ResetPasswordPage";

import ProtectedRoute from "./services/ProtectedRoute";

export default function App()
{
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/"
                element = {
                    <ProtectedRoute><NotePage/></ProtectedRoute>
                }/>
                <Route path="/signup" element={<SignupPage/>} />
                <Route path="/reset-password" element={<ResetPasswordPage/>} />
            </Routes>
        </BrowserRouter>
    );
}



