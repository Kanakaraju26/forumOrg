import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loginp from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgot_password";
import Otp from "./pages/otp";
import "./App.css";
import Home from "./pages/home";
import Setpassword from "./pages/set_password";
import Profile from "./pages/profile";
import CreatePost from "./pages/creation_post";
import About from "./pages/about";
import Messages from "./pages/chat_page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Loginp />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/set-password" element={<Setpassword />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/otp" element={<Otp />} />
        <Route path="/otp/set-password" element={<Setpassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/messages" element={<Messages />} />
      </Routes>
    </Router>
  );
}

export default App;
