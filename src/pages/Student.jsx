import { useEffect, useState } from "react";
import { logout } from "../services/Login";
import { sendFeedBack, studentGetFeedBack } from "../services/FeedBack";
import { useNavigate } from "react-router-dom";

export default function StudentPage() {
  const [accountId, setAccountId] = useState();
  const [hasSentSOS, setHasSentSOS] = useState(false);
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("normal");
  const [filter, setFilter] = useState("all");
  const [feedbacks, setFeedbacks] = useState([]);
  const [mode, setMode] = useState("send"); // "send" hoặc "view"

  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("role") !== "STUDENT") {
      navigate("/login");
      alert("Bạn cần phải đăng nhập!");
    }
  }, []);

  useEffect(() => {
    console.log(sessionStorage.getItem("sos"));
    if (sessionStorage.getItem("sos") === "1") {
      setHasSentSOS(false);
    } else {
      setHasSentSOS(true);
    }
    setAccountId(sessionStorage.getItem("id"));
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleSend = async () => {
    if (!content.trim() || !category.trim()) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (type === "urgent") {
      console.log(hasSentSOS);
      if (hasSentSOS) {
        alert("Bạn chỉ được gửi SOS một lần cho mỗi kỳ.");
        return;
      } else {
        setHasSentSOS(true);
      }
    }

    const response = await sendFeedBack(accountId, content, type, category);
    alert(response);
    setCategory("");
    setContent("");
    setType("normal");
  };

  const handleRating = (id, star) => {
    setFeedbacks((prev) =>
      prev.map((fb) => (fb.id === id ? { ...fb, rating: star } : fb))
    );
    alert(`Bạn đã đánh giá phản hồi ${star} sao.`);
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (filter === "all") return true;
    if (filter === "replied") return fb.status === "Đã phản hồi";
    if (filter === "unreplied") return fb.status === "Đang xử lý";
    return true;
  });

  const getDeadline = (sentTime) => {
    const deadline = new Date(sentTime);
    deadline.setDate(deadline.getDate() + 3);
    return deadline.toLocaleString();
  };

  const isExpired = (sentTime) => {
    const deadline = new Date(sentTime);
    deadline.setDate(deadline.getDate() + 3);
    return new Date() > deadline;
  };

  return (
    <div style={styles.container}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Trang sinh viên - Phản hồi</h2>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Đăng xuất
        </button>
      </div>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button
          style={mode === "send" ? styles.activeTab : styles.tab}
          onClick={() => setMode("send")}
        >
          Gửi phản hồi
        </button>
        <button
          style={mode === "view" ? styles.activeTab : styles.tab}
          onClick={async () => {
            setMode("view");
            const response = await studentGetFeedBack(
              accountId,
              "",
              "",
              "",
              ""
            );
            console.log(response);
            setFeedbacks(response);
          }}
        >
          Xem phản hồi
        </button>
      </div>

      {mode === "send" && (
        <div style={styles.form}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.select}
          >
            <option value="">Chọn nội dung</option>
            <option value="ACADEMIC_AFFAIRS">Học vụ</option>
            <option value="FACILITIES">Cơ sở vật chất</option>
            <option value="TUITION_FEES">Học phí</option>
            <option value="GRADUATION_SUPPORT">Hỗ trợ ra trường</option>
          </select>

          <textarea
            placeholder="Nhập nội dung phản hồi..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={styles.textarea}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => {
                if (type === "normal") {
                  setType("urgent");
                } else {
                  setType("normal");
                }
              }}
              style={{
                ...styles.sosButton,
                backgroundColor: type === "urgent" ? "#dc3545" : "#ffc107",
                color: type === "urgent" ? "white" : "#333",
              }}
            >
              {type === "urgent" ? "Đã bật SOS" : "Bật SOS"}
            </button>
            <button onClick={handleSend} style={styles.sendButton}>
              Gửi phản hồi
            </button>
          </div>
          {type === "urgent" && (
            <p style={{ color: "red", marginTop: "8px" }}>
              ⚠️ Lưu ý: Nếu bạn chọn chế độ SOS thì FeedBack sẽ được gửi trực
              tiếp lên Ban Lãnh đạo và bạn chỉ được gửi SOS một lần mỗi kỳ. Hãy
              chắc chắn về nội dung cần gửi.
            </p>
          )}
        </div>
      )}

      {mode === "view" && (
        <>
          <div style={styles.filter}>
            <label>Lọc: </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={styles.select}
            >
              <option value="all">Tất cả</option>
              <option value="replied">Đã phản hồi</option>
              <option value="unreplied">Chưa phản hồi</option>
            </select>
          </div>

          <div style={styles.feedbackList}>
            {filteredFeedbacks.map((fb) => {
              let expired = false;
              if (fb.status === "Quá hạn") {
                expired = true;
              }
              return (
                <div key={fb.id} style={styles.feedbackCard}>
                  <p>
                    <strong>Loại:</strong>{" "}
                    <span
                      style={{
                        color: fb.type === "SOS" ? "red" : "#007bff",
                        fontWeight: "bold",
                      }}
                    >
                      {fb.type}
                    </span>
                  </p>
                  <p>
                    <strong>Chủ đề:</strong> {fb.category}
                  </p>
                  <p>
                    <strong>Nội dung:</strong> {fb.content}
                  </p>
                  <p>
                    <strong>Thời gian gửi:</strong> {fb.createdAt}
                  </p>
                  <p>
                    <strong>Hạn phản hồi:</strong> {fb.deadline}
                  </p>
                  {fb.status === "Đã phản hồi" ? (
                    <>
                      <p>
                        <strong>Thời gian phản hồi:</strong> {fb.respondedAt}
                      </p>
                      <p>
                        <strong>Nội dung phản hồi:</strong>{" "}
                        {fb.respondedContent}
                      </p>
                      {/* {fb.status === "Đã phản hồi" && (
                        <div>
                          <strong>Đánh giá:</strong>{" "}
                          {fb.rating ? (
                            <span>
                              {"⭐".repeat(fb.rating)} ({fb.rating}/5)
                            </span>
                          ) : (
                            [1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                onClick={() => handleRating(fb.id, star)}
                                style={styles.starButton}
                              >
                                ⭐
                              </button>
                            ))
                          )}
                        </div>
                      )} */}
                      <p style={{ color: "green" }}>Đã phản hồi</p>
                    </>
                  ) : (
                    <>
                      <p>
                        <strong>Hạn phản hồi:</strong> {fb.deadline}
                      </p>
                      {expired && (
                        <p style={{ color: "red" }}>⚠️ Quá hạn phản hồi!</p>
                      )}
                      {!expired && (
                        <p style={{ color: "orange" }}>Đang xử lý</p>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            {currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                style={{
                  marginRight: "10px",
                  padding: "6px 10px",
                  borderRadius: "5px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                ◀
              </button>
            )}

            <span>Trang </span>
            <input
              type="number"
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (!isNaN(page)) {
                  if (page < 1) {
                    setCurrentPage(1);
                  } else if (page > numberPage) {
                    setCurrentPage(numberPage);
                  } else {
                    setCurrentPage(page);
                  }
                }
              }}
              style={{
                width: "60px",
                margin: "0 10px",
                padding: "5px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                textAlign: "center",
              }}
            />
            <span> / {numberPage}</span>

            {currentPage < numberPage && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                style={{
                  marginLeft: "10px",
                  padding: "6px 10px",
                  borderRadius: "5px",
                  backgroundColor: "#f0f0f0",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                ▶
              </button>
            )}
          </div> */}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Segoe UI, sans-serif",
    background: "#f4f4f4",
    borderRadius: "10px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px",
  },
  select: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  textarea: {
    minHeight: "100px",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  sosButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  sendButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  filter: {
    margin: "20px 0",
  },
  feedbackList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  feedbackCard: {
    backgroundColor: "white",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  starButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  tab: {
    padding: "10px 20px",
    background: "#e0e0e0",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  activeTab: {
    padding: "10px 20px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};
