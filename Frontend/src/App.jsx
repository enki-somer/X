import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import SignupPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LogInPage";
import Sidebar from "./components/common/SideBar";
import RightPanel from "./components/common/RightPanel";
import Notification from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.message || "Something went wrong");
        }
        console.log("auth user is here", data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-[1265px] mx-auto flex relative">
        {/* Left Sidebar Space */}
        <div className="w-[275px] flex-shrink-0">{authUser && <Sidebar />}</div>

        {/* Main Content */}
        <div className="w-[600px] min-h-screen border-x border-gray-800">
          <Routes>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!authUser ? <LoginPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/signup"
              element={!authUser ? <SignupPage /> : <Navigate to="/" />}
            />
            <Route
              path="/notifications"
              element={authUser ? <Notification /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile/:username"
              element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
          </Routes>
        </div>

        {/* Right Panel Space */}
        <div className="w-[350px] flex-shrink-0">
          {authUser && <RightPanel />}
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
