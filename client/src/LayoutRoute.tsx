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
      <Route path="/friends" element={<FriendPage />} />
      <Route path="/friends/request" element={<FriendPage />} />
      <Route path="/friends/suggestion" element={<FriendPage />} />
      <Route path="/account/profile" element={<AccountPage />} />
    </Routes>
  );
}

export default LayoutRoute;
