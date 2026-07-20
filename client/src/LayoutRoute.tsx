import { Route, Routes } from "react-router-dom";
import ConversationPage from "./pages/ConversationPage";
import AuthPage from "./pages/AuthPage";
import FriendPage from "./pages/FriendPage";
import AccountPage from "./pages/AccountPage";

function LayoutRoute() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/messages" element={<ConversationPage />} />
      <Route path="/messages/:id" element={<ConversationPage />} />
      <Route path="/friend" element={<FriendPage />} />
      <Route path="/friend/add" element={<FriendPage />} />
      <Route path="/account/profile" element={<AccountPage />} />
    </Routes>
  );
}

export default LayoutRoute;
