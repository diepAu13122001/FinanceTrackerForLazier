import toast from "react-hot-toast";

// Wrapper với message tiếng Việt chuẩn
export const notify = {
  ssuccess: (msg: string) => toast.success(msg),
  error: (msg: string) => toast.error(msg),
  loading: (msg: string) => toast.loading(msg),
  dismiss: (id?: string) => toast.dismiss(id),

  // Dùng cho async action — tự show loading → success/error
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) => toast.promise(promise, messages),
};

// Messages chuẩn tái sử dụng
export const TOAST_MESSAGES = {
  transaction: {
    created: "Thêm giao dịch thành công",
    updated: "Cập nhật giao dịch thành công",
    deleted: "Đã xóa giao dịch",
    error: "Có lỗi xảy ra, vui lòng thử lại",
  },
  auth: {
    loggedOut: "Đã đăng xuất",
    sessionExpired: "Phiên đăng nhập đã hết hạn",
    profileUpdated: "Cập nhật hồ sơ thành công",
    passwordChanged: "Đổi mật khẩu thành công",
  },
};
