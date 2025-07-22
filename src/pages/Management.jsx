import { useMemo, useState } from "react";

export default function ManagementPage() {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedReplyStatus, setSelectedReplyStatus] = useState("Tất cả");

  const [feedbacks] = useState([
    {
      id: 1,
      category: "Học vụ",
      content: "Lịch học không rõ ràng.",
      email: "sv1@example.com",
      replied: true,
      feedbackTime: "2025-07-19 09:00",
      replyTime: "2025-07-20 08:00",
    },
    {
      id: 2,
      category: "Cơ sở vật chất",
      content: "Phòng học nóng quá.",
      email: "sv2@example.com",
      replied: false,
      feedbackTime: "2025-07-10 10:30",
    },
    {
      id: 3,
      category: "Học phí",
      content: "Học phí tăng nhiều.",
      email: "sv3@example.com",
      replied: true,
      feedbackTime: "2025-07-17 14:20",
      replyTime: "2025-07-18 09:45",
    },
    {
      id: 4,
      category: "Hỗ trợ ra trường",
      content: "Cần tư vấn việc làm.",
      email: "sv4@example.com",
      replied: false,
      feedbackTime: "2025-07-12 16:50",
    },
    {
      id: 5,
      category: "Học vụ",
      content: "Cần thêm buổi học phụ đạo.",
      email: "sv5@example.com",
      replied: false,
      feedbackTime: "2025-07-19 11:15",
    },
  ]);

  const today = new Date();

  const stats = useMemo(() => {
    const total = feedbacks.length;
    const replied = feedbacks.filter((f) => f.replied).length;
    const notReplied = total - replied;
    const replyRate = total === 0 ? 0 : Math.round((replied / total) * 100);

    const categoryStats = feedbacks.reduce((acc, fb) => {
      acc[fb.category] = (acc[fb.category] || 0) + 1;
      return acc;
    }, {});

    return { total, replied, notReplied, replyRate, categoryStats };
  }, [feedbacks]);

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const matchCategory =
      selectedCategory === "Tất cả" || fb.category === selectedCategory;
    const matchReply =
      selectedReplyStatus === "Tất cả" ||
      (selectedReplyStatus === "Đã phản hồi" && fb.replied) ||
      (selectedReplyStatus === "Chưa phản hồi" && !fb.replied);
    return matchCategory && matchReply;
  });

  const isOverdue = (feedbackTime) => {
    const sent = new Date(feedbackTime);
    const due = new Date(sent);
    due.setDate(due.getDate() + 7);
    return today > due;
  };

  const getOverdueDays = (feedbackTime) => {
    const sent = new Date(feedbackTime);
    const overdueMs = today - sent - 7 * 24 * 60 * 60 * 1000;
    return Math.floor(overdueMs / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Quản lý phản hồi sinh viên</h2>

      <div style={styles.summary}>
        <div>
          Tổng phản hồi: <strong>{stats.total}</strong>
        </div>
        <div>
          Đã phản hồi: <strong>{stats.replied}</strong>
        </div>
        <div>
          Chưa phản hồi: <strong>{stats.notReplied}</strong>
        </div>
        <div>
          Tỷ lệ phản hồi: <strong>{stats.replyRate}%</strong>
        </div>
      </div>

      <div style={styles.filters}>
        <div>
          <label>
            Lọc theo nội dung:&nbsp;
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={styles.select}
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Học vụ">Học vụ</option>
              <option value="Cơ sở vật chất">Cơ sở vật chất</option>
              <option value="Học phí">Học phí</option>
              <option value="Hỗ trợ ra trường">Hỗ trợ ra trường</option>
            </select>
          </label>
        </div>

        <div>
          <label>
            Lọc theo trạng thái:&nbsp;
            <select
              value={selectedReplyStatus}
              onChange={(e) => setSelectedReplyStatus(e.target.value)}
              style={styles.select}
            >
              <option value="Tất cả">Tất cả</option>
              <option value="Đã phản hồi">Đã phản hồi</option>
              <option value="Chưa phản hồi">Chưa phản hồi</option>
            </select>
          </label>
        </div>
      </div>

      <div style={styles.feedbackList}>
        {filteredFeedbacks.length === 0 ? (
          <p>Không có phản hồi phù hợp với bộ lọc.</p>
        ) : (
          filteredFeedbacks.map((fb) => (
            <div key={fb.id} style={styles.feedbackCard}>
              <p>
                <strong>Email:</strong> {fb.email}
              </p>
              <p>
                <strong>Chủ đề:</strong> {fb.category}
              </p>
              <p>
                <strong>Nội dung:</strong> {fb.content}
              </p>
              <p>
                <strong>Thời gian gửi:</strong> {fb.feedbackTime}
              </p>
              {fb.replied && (
                <p>
                  <strong>Thời gian phản hồi:</strong> {fb.replyTime}
                </p>
              )}
              <p style={{ color: fb.replied ? "green" : "red" }}>
                <strong>Trạng thái:</strong>{" "}
                {fb.replied ? "Đã phản hồi" : "Chưa phản hồi"}
              </p>
              {!fb.replied && isOverdue(fb.feedbackTime) && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  ⚠️ Quá hạn phản hồi: {getOverdueDays(fb.feedbackTime)} ngày
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    textAlign: "center",
    fontSize: "26px",
    marginBottom: "20px",
  },
  summary: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: "12px 20px",
    borderRadius: "8px",
    fontSize: "16px",
  },
  filters: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
    marginBottom: "10px",
  },
  select: {
    padding: "6px 10px",
    fontSize: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  feedbackList: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  feedbackCard: {
    backgroundColor: "#fff",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
};
