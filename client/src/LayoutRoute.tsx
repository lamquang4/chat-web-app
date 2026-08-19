import { Route, Routes } from "react-router-dom";
import ConversationPage from "./pages/ConversationPage";
import AuthPage from "./pages/AuthPage";
import FriendPage from "./pages/FriendPage";
import AccountPage from "./pages/AccountPage";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function LayoutRoute() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<AuthPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route path="/messages" element={<ConversationPage />} />
        <Route
          path="/messages/:conversationId"
          element={<ConversationPage />}
        />
        <Route path="/friends" element={<FriendPage />} />
        <Route path="/friends/request" element={<FriendPage />} />
        <Route path="/friends/suggestion" element={<FriendPage />} />
        <Route path="/account/profile" element={<AccountPage />} />
      </Route>
    </Routes>
  );
}

export default LayoutRoute;
