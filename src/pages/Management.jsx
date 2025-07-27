import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { managementGetFeedBack, responseFeedBack } from "../services/FeedBack";
import { logout } from "../services/Login";

export default function Management() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("role") !== "EXECUTIVE") {
      alert("Bạn cần phải đăng nhập!");
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    managementGetFeedBack("", "", "sendTime_desc", "").then((res) => {
      console.log(res);
      setFeedbacks(res || []);
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
        `Phản hồi đã được gửi tới Sinh viên ${selectedFeedback.senderCode}:\n\n${replyMessage}`
      );

      setFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === selectedFeedback.id ? { ...fb, status: "Đã phản hồi" } : fb
        )
      );

      setSelectedFeedback(null);
      setReplyMessage("");
    } catch (error) {
      console.log("Error in sendFeedBack!", error);
    }
  };

  const parseCreatedAt = (str) => {
    const [time, date] = str.split(", ");
    const [hour, minute] = time.split(":").map(Number);
    const [day, month, year] = date.split("/").map(Number);
    return new Date(year, month - 1, day, hour, minute);
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const fbDate = parseCreatedAt(fb.createdAt);
    const matchType = filterType === "all" || fb.type === filterType;
    const matchStatus = filterStatus === "all" || fb.status === filterStatus;
    const matchCategory =
      filterCategory === "all" || fb.category === filterCategory;
    const matchDate =
      (!startDate || fbDate >= new Date(startDate)) &&
      (!endDate || fbDate <= new Date(endDate + "T23:59:59"));
    return matchType && matchStatus && matchCategory && matchDate;
  });

  const formatDate = (str) => str || "";

  // Thống kê
  const total = filteredFeedbacks.length;
  const categoryCounts = filteredFeedbacks.reduce((acc, fb) => {
    acc[fb.category] = (acc[fb.category] || 0) + 1;
    return acc;
  }, {});
  const replied = filteredFeedbacks.filter(
    (fb) => fb.status === "Đã phản hồi"
  ).length;
  const pending = filteredFeedbacks.filter(
    (fb) => fb.status === "Đang xử lý"
  ).length;
  const overdue = filteredFeedbacks.filter(
    (fb) => fb.status === "Quá hạn"
  ).length;

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

      {/* Bộ lọc */}
      <div
        style={{ marginBottom: 20, display: "flex", flexWrap: "wrap", gap: 12 }}
      >
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="all">Tất cả chủ đề</option>
          <option value="Học vụ">Học vụ</option>
          <option value="Cơ sở vật chất">Cơ sở vật chất</option>
          <option value="Học phí">Học phí</option>
          <option value="Hỗ trợ ra trường">Hỗ trợ ra trường</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Đã phản hồi">Đã phản hồi</option>
          <option value="Đang xử lý">Chưa phản hồi</option>
          <option value="Quá hạn">Quá hạn</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">Tất cả loại</option>
          <option value="Đặc biệt">SOS</option>
          <option value="Thông thường">Thường</option>
        </select>

        <div>
          <label>Từ ngày: </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label>Đến ngày: </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Thống kê */}
      <div style={{ marginBottom: 20 }}>
        <p>
          <strong>Tổng phản hồi:</strong> {total}
        </p>
        {Object.entries(categoryCounts).map(([cat, count]) => (
          <p key={cat}>
            <strong>{cat}:</strong> {count}
          </p>
        ))}
        <p>
          <strong>Đã phản hồi:</strong> {replied}
        </p>
        <p>
          <strong>Chưa phản hồi:</strong> {pending}
        </p>
        <p>
          <strong>Quá hạn (trên 7 ngày):</strong> {overdue}
        </p>
      </div>

      {/* Phản hồi chi tiết */}
      {selectedFeedback ? (
        <div style={styles.replyBox}>
          <h3>Phản hồi đến sinh viên</h3>
          <p>
            <strong>Mã sinh viên</strong> {selectedFeedback.senderCode}
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
            <p>Không có phản hồi nào.</p>
          ) : (
            filteredFeedbacks.map((fb) => (
              <div
                key={fb.id}
                style={{
                  ...styles.feedbackCard,
                  backgroundColor: fb.type === "Đặc biệt" ? "#ffe5e5" : "white",
                  borderLeft: fb.type === "Đặc biệt" ? "6px solid red" : "none",
                }}
              >
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
                  <strong>Thời gian gửi:</strong> {formatDate(fb.createdAt)}
                </p>
                <p>
                  <strong>Hạn phản hồi:</strong> {formatDate(fb.deadline)}
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
                    {fb.status === "Đã phản hồi"
                      ? "Đã phản hồi"
                      : fb.status === "Đang xử lý"
                      ? "Đang xử lý"
                      : "Quá hạn"}
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
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
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
  logoutButton: {
    padding: "8px 16px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
