import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import StudentPage from "./pages/Student";
import DepartmentPage from "./pages/Department";
import ManagementPage from "./pages/Management";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/student" element={<StudentPage />} />
      <Route path="/department" element={<DepartmentPage />} />
      <Route path="/management" element={<ManagementPage />} />
    </Routes>
  );
}

export default App;
