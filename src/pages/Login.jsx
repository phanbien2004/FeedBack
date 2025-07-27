import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";
import { login } from "../services/Login";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (!response?.role) {
        alert(
          "Thông tin tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!"
        );
        return;
      }
      sessionStorage.setItem("role", response.role);
      sessionStorage.setItem("username", response?.username);
      sessionStorage.setItem("id", response.id);
      if (response?.role === "STUDENT") {
        sessionStorage.setItem("sos", response?.sos);
        navigate("/student");
      } else if (response?.role === "DEPARTMENT") {
        navigate("/department");
      } else if (response?.role === "EXECUTIVE") {
        navigate("/management");
      } else {
        alert(
          "Thông tin tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!"
        );
      }
    } catch (error) {
      console.log("Error in Login: ", error);
      alert(
        "Thông tin tài khoản hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại!"
      );
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <CiUser />
        <div>Đăng nhập</div>
      </div>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "400px",
    margin: "100px auto",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    overflow: "hidden",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    backgroundColor: "rgb(173, 23, 28)",
    color: "white",
    height: "40px",
    fontSize: "20px",
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    padding: 20,
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "rgb(173, 23, 28)",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default LoginPage;
