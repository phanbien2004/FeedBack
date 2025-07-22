import { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { IoIosClose } from "react-icons/io";

export default function StudentPage() {
  const [showForm, setShowForm] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [showCodeBox, setShowCodeBox] = useState(false);

  const [category, setCategory] = useState("");
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const mockFeedback = [
    {
      id: 1,
      content: "Cần sửa đèn phòng học 302",
      status: "Đã xử lý",
      replyTime: "2025-07-19 14:30",
    },
    {
      id: 2,
      content: "Thêm ổ điện ở thư viện",
      status: "Đang xem xét",
      replyTime: null,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!category || !feedback || !email) {
      alert("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    alert("Feedback đã được gửi!");
    console.log("Gửi Feedback:", { category, feedback, email });
    setCategory("");
    setFeedback("");
    setEmail("");
    setShowForm(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Trang Feedback</h2>

      {!showForm && !showStatus && !showCodeBox && (
        <div style={styles.buttonGroup}>
          <button
            onClick={() => {
              setShowForm(true);
              setShowStatus(false);
              setShowCodeBox(false);
            }}
            style={styles.button}
          >
            Gửi Feedback
          </button>

          <button
            onClick={() => {
              setShowForm(false);
              setShowStatus(false);
              setShowCodeBox(true);
            }}
            style={{ ...styles.button, backgroundColor: "#17a2b8" }}
          >
            Kiểm tra trạng thái Feedback
          </button>
        </div>
      )}

      {showForm && (
        <div style={{ display: "flex", flexDirection: "column" }}>
          <button onClick={() => setShowForm(false)} style={styles.backButton}>
            <IoMdArrowBack style={{ marginRight: "6px" }} />
            Quay lại
          </button>

          <form onSubmit={handleSubmit} style={styles.form}>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              style={styles.select}
            >
              <option value="">-- Chọn nội dung phản hồi --</option>
              <option value="Học vụ">Học vụ</option>
              <option value="Cơ sở vật chất">Cơ sở vật chất</option>
              <option value="Học phí">Học phí</option>
              <option value="Hỗ trợ ra trường">Hỗ trợ ra trường</option>
            </select>

            <textarea
              placeholder="Nhập nội dung feedback..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              required
              style={styles.textarea}
            />

            <input
              type="email"
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.emailInput}
            />

            <button type="submit" style={styles.submitButton}>
              Gửi
            </button>
          </form>
        </div>
      )}

      {showStatus && (
        <div>
          <button
            onClick={() => {
              setShowStatus(false);
              setShowCodeBox(false);
            }}
            style={styles.backButton}
          >
            <IoMdArrowBack style={{ marginRight: "6px" }} />
            Quay lại
          </button>

          <div style={styles.statusBox}>
            <h3 style={styles.subTitle}>Trạng thái Feedback</h3>
            {mockFeedback.map((fb) => (
              <div key={fb.id} style={styles.card}>
                <p>
                  <strong>Nội dung:</strong> {fb.content}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  <span
                    style={{
                      color:
                        fb.status === "Đã xử lý"
                          ? "green"
                          : fb.status === "Đang xem xét"
                          ? "#ffc107"
                          : "red",
                    }}
                  >
                    {fb.status}
                  </span>
                </p>
                {fb.replyTime && (
                  <p>
                    <strong>Thời gian phản hồi:</strong> {fb.replyTime}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showCodeBox && (
        <div style={styles.codeBox}>
          <IoIosClose
            size={24}
            style={styles.closeIcon}
            onClick={() => {
              setShowCodeBox(false);
              setCode("");
            }}
          />
          <h3 style={{ marginBottom: "10px" }}>Nhập mã Feedback</h3>
          <input
            placeholder="Mã Feedback"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={styles.codeInput}
          />
          <button
            style={styles.codeButton}
            onClick={() => {
              setShowCodeBox(false);
              setCode("");
              setShowForm(false);
              setShowStatus(true);
            }}
          >
            OK
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "80px auto",
    padding: "20px",
    textAlign: "center",
    borderRadius: "10px",
    backgroundColor: "#f0f4f8",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    marginBottom: "30px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
  },
  button: {
    padding: "12px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    width: "80%",
    maxWidth: "300px",
  },
  backButton: {
    display: "flex",
    alignItems: "center",
    marginBottom: "16px",
    cursor: "pointer",
    backgroundColor: "#6c757d",
    color: "white",
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    alignSelf: "flex-start",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  select: {
    width: "100%",
    maxWidth: "530px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  },
  textarea: {
    width: "100%",
    maxWidth: "500px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "vertical",
    outline: "none",
  },
  emailInput: {
    width: "100%",
    maxWidth: "500px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    marginTop: "8px",
    boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)",
  },
  submitButton: {
    padding: "10px 24px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  statusBox: {
    marginTop: "20px",
    textAlign: "left",
  },
  subTitle: {
    marginBottom: "10px",
  },
  card: {
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "#fff",
    marginBottom: "10px",
  },
  codeBox: {
    position: "fixed",
    top: "150px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "#ffffff",
    padding: "30px 20px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 999,
    width: "90%",
    maxWidth: "400px",
  },
  codeInput: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "100%",
    maxWidth: "300px",
    outline: "none",
    marginTop: "10px",
  },
  codeButton: {
    marginTop: "16px",
    padding: "10px 24px",
    backgroundColor: "#007bff",
    color: "white",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  closeIcon: {
    cursor: "pointer",
    alignSelf: "flex-end",
    marginBottom: "10px",
  },
};
