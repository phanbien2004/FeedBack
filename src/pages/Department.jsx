import { useState } from "react";

export default function DepartmentPage() {
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      category: "Cơ sở vật chất",
      content: "Cần sửa máy lạnh phòng A201",
      email: "sinhvien1@example.com",
      createdAt: "2025-07-10T10:00:00",
      replied: false,
    },
    {
      id: 2,
      category: "Học phí",
      content: "Mong nhà trường xem xét giảm học phí kỳ này",
      email: "sinhvien2@example.com",
      createdAt: "2025-07-05T14:30:00",
      replied: true,
    },
  ]);

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const handleSendReply = () => {
    if (!replyMessage.trim()) {
      alert("Vui lòng nhập nội dung phản hồi.");
      return;
    }

    alert(
      `Phản hồi đã được gửi tới ${selectedFeedback.email}:\n\n${replyMessage}`
    );

    setFeedbacks((prev) =>
      prev.map((fb) =>
        fb.id === selectedFeedback.id ? { ...fb, replied: true } : fb
      )
    );

    setSelectedFeedback(null);
    setReplyMessage("");
  };

  const formatDate = (iso) => {
    const date = new Date(iso);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
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
          filterStatus === "replied" ? fb.replied : !fb.replied
        );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Phản hồi từ sinh viên</h2>

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
            filteredFeedbacks.map((fb) => {
              const deadline = getDeadlineDate(fb.createdAt);
              return (
                <div key={fb.id} style={styles.feedbackCard}>
                  <p>
                    <strong>Chủ đề:</strong> {fb.category}
                  </p>
                  <p>
                    <strong>Nội dung:</strong> {fb.content}
                  </p>
                  <p>
                    <strong>Email:</strong> {fb.email}
                  </p>
                  <p>
                    <strong>Thời gian gửi:</strong> {formatDate(fb.createdAt)}
                  </p>
                  <p>
                    <strong>Hạn phản hồi:</strong>{" "}
                    <span style={{ color: isOverdue(fb) ? "red" : "#333" }}>
                      {formatDate(deadline.toISOString())}
                    </span>
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    <span
                      style={{
                        color: fb.replied
                          ? "green"
                          : isOverdue(fb)
                          ? "orange"
                          : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {fb.replied
                        ? "Đã phản hồi"
                        : isOverdue(fb)
                        ? "Quá hạn chưa phản hồi"
                        : "Chưa phản hồi"}
                    </span>
                  </p>
                  {!fb.replied && (
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
