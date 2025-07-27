import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { departmentGetFeedBack, responseFeedBack } from "../services/FeedBack";
import { logout } from "../services/Login";

export default function DepartmentPage() {
  const [feedbacks, setFeedbacks] = useState([]);

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategpry] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("role") !== "DEPARTMENT") {
      alert("Bạn cần phải đăng nhập!");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    departmentGetFeedBack("", "sendTime_desc", "").then((res) => {
      console.log(res);
      setFeedbacks(res);
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSendReply = async () => {
    if (!replyMessage.trim()) {
      alert("Vui lòng nhập nội dung phản hồi.");
      return;
    }
    try {
      const response = await responseFeedBack(
        selectedFeedback.id,
        replyMessage
      );
      console.log(response);

      alert(
        `Phản hồi đã được gửi tới ${selectedFeedback.senderCode}:\n\n${replyMessage}`
      );

      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === selectedFeedback.id ? { ...fb, status: "Đã phản hồi" } : fb
        )
      );

      setSelectedFeedback(null);
      setReplyMessage("");
    } catch (error) {
      console.log("Error in handleSendreply", error);
    }
  };

  const getDeadlineDate = (createdAt) => {
    const deadline = new Date(createdAt);
    deadline.setDate(deadline.getDate() + 7);
    return deadline;
  };

  const isOverdue = (fb) => {
    return !fb.replied && new Date() > getDeadlineDate(fb.createdAt);
  };

  const filteredFeedbacks =
    filterStatus === "all"
      ? feedbacks
      : feedbacks.filter((fb) =>
          filterStatus === "replied"
            ? fb.status === "Đã phản hồi"
            : fb.status === "Đang xử lý"
        );

  return (
    <div style={styles.container}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <h2 style={styles.title}>Phản hồi từ sinh viên</h2>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Đăng xuất
        </button>
      </div>

      {!selectedFeedback && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ marginRight: 8 }}>Lọc phản hồi: </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.select}
          >
            <option value="all">Tất cả</option>
            <option value="unreplied">Chưa phản hồi</option>
            <option value="replied">Đã phản hồi</option>
          </select>
        </div>
      )}

      {selectedFeedback ? (
        <div style={styles.replyBox}>
          <h3>Phản hồi đến sinh viên</h3>
          <p>
            <strong>Email:</strong> {selectedFeedback.email}
          </p>
          <p>
            <strong>Chủ đề:</strong> {selectedFeedback.category}
          </p>
          <p>
            <strong>Nội dung:</strong> {selectedFeedback.content}
          </p>
          <textarea
            style={styles.textarea}
            placeholder="Nhập phản hồi gửi sinh viên..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
          />
          <button onClick={handleSendReply} style={styles.sendButton}>
            Gửi phản hồi
          </button>
          <button
            onClick={() => setSelectedFeedback(null)}
            style={styles.cancelButton}
          >
            Hủy
          </button>
        </div>
      ) : (
        <div style={styles.feedbackList}>
          {filteredFeedbacks.length === 0 ? (
            <p>Không có phản hồi phù hợp.</p>
          ) : (
            Array.isArray(filteredFeedbacks) &&
            filteredFeedbacks.map((fb) => {
              return (
                <div key={fb.id} style={styles.feedbackCard}>
                  <p>
                    <strong>Chủ đề:</strong> {fb.category}
                  </p>
                  <p>
                    <strong>Nội dung:</strong> {fb.content}
                  </p>
                  <p>
                    <strong>Mã sinh viên:</strong> {fb.senderCode}
                  </p>
                  <p>
                    <strong>Thời gian gửi:</strong> {fb.createdAt}
                  </p>
                  <p>
                    <strong>Hạn phản hồi:</strong>{" "}
                    <span style={{ color: isOverdue(fb) ? "red" : "#333" }}>
                      {fb.deadline}
                    </span>
                  </p>
                  {fb.status === "Đã phản hồi" && (
                    <>
                      <p>
                        <strong>Thời gian phản hồi:</strong>{" "}
                        {fb.respondedAt || "Chưa rõ"}
                      </p>
                      <p>
                        <strong>Nội dung phản hồi:</strong>{" "}
                        {fb.respondedContent || "Chưa rõ"}
                      </p>
                    </>
                  )}
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    <span
                      style={{
                        color:
                          fb.status === "Đã phản hồi"
                            ? "green"
                            : fb.status === "Đang xử lý"
                            ? "orange"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {fb.status}
                    </span>
                  </p>
                  {fb.status !== "Đã phản hồi" && (
                    <button
                      onClick={() => setSelectedFeedback(fb)}
                      style={styles.replyButton}
                    >
                      Gửi phản hồi
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "60px auto",
    padding: "20px",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
  },
  select: {
    padding: "6px 12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  feedbackList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  feedbackCard: {
    padding: "16px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  replyButton: {
    marginTop: "10px",
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  replyBox: {
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  textarea: {
    width: "100%",
    height: "100px",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "vertical",
    outline: "none",
  },
  sendButton: {
    marginTop: "12px",
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "10px",
  },
  cancelButton: {
    marginTop: "12px",
    padding: "10px 20px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
