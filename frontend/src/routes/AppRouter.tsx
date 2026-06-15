import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RoomsPage from "../pages/RoomsPage";
import ChatPage from "../pages/ChatPage";



export default function AppRouter(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage/>}></Route>
                <Route path="/rooms" element={<RoomsPage/>}></Route>
                <Route path="/chat/:roomId" element={<ChatPage/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}