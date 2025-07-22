import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiUser } from "react-icons/ci";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (email && password) {
      console.log("Đăng nhập thành công:", { email, password });
      navigate("/student");
    } else {
      alert("Vui lòng nhập đầy đủ email và mật khẩu.");
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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
