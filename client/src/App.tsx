import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loginp from "./pages/login";
import Signup from "./pages/signup";
import ForgotPassword from "./pages/forgot_password";
import Otp from "./pages/otp";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Loginp />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp" element={<Otp />} />
      </Routes>
    </Router>
  );
}

export default App;
