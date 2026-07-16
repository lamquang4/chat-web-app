import { Route, Routes } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import FriendPage from "./pages/FriendPage";
import AccountPage from "./pages/AccountPage";

function LayoutRoute() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:id" element={<ChatPage />} />
      <Route path="/friend" element={<FriendPage />} />
      <Route path="/friend/add" element={<FriendPage />} />
      <Route path="/account/profile" element={<AccountPage />} />
    </Routes>
  );
}

export default LayoutRoute;
