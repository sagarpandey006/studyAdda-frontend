import axios from 'axios';

// const BASE_URL = 'http://localhost:8080/api';
const BASE_URL = 'https://backend.studyadda.me/api';

// Axios instance with credentials (session cookie sent automatically)
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

// Normalize user/student object so frontend field names match
// Backend has: name, phone — Frontend expects: fullName, contactNumber
const normalizeStudent = (user) => {
  if (!user) return null;
  return {
    ...user,
    fullName: user.fullName || user.name,
    contactNumber: user.contactNumber || user.phone,
    availableBookLimit: user.availableBookLimit ?? Math.max(0, (user.maxBookLimit || 5) - (user.totalBooksIssued || 0))
  };
};

// ─── AUTH ────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.get('/auth/logout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password })
};

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats')
};

// ─── BOOKS ───────────────────────────────────────────────────────────────────

export const bookApi = {
  getAll: async () => {
    const res = await api.get('/book/getAll');
    return { booksList: res.data.booksList || [] };
  },
  getById: (id) => api.get(`/book/get/${id}`),
  add: async (bookData) => {
    const res = await api.post('/book/add', bookData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  },
  update: async (id, bookData) => {
    const res = await api.put(`/book/update/${id}`, bookData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/book/delete/${id}`);
    return res.data;
  }
};

// ─── AUTHORS ─────────────────────────────────────────────────────────────────

export const authorApi = {
  getAll: async () => {
    const res = await api.get('/author/getAll');
    return { authorsList: res.data.authorsList || [] };
  },
  add: (data) => api.post('/author/add', data),
  update: (id, data) => api.put(`/author/update/${id}`, data),
  delete: (id) => api.delete(`/author/delete/${id}`)
};

// ─── GENRES ──────────────────────────────────────────────────────────────────

export const genreApi = {
  getAll: async () => {
    const res = await api.get('/genre/getAll');
    return { genresList: res.data.genresList || [] };
  },
  add: (data) => api.post('/genre/add', data),
  update: (id, data) => api.put(`/genre/update/${id}`, data),
  delete: (id) => api.delete(`/genre/delete/${id}`)
};

// ─── USERS ───────────────────────────────────────────────────────────────────

export const userApi = {
  getAll: async () => {
    const res = await api.get('/user/getAll');
    return { usersList: res.data.usersList || [] };
  },
  getAllMembers: async () => {
    const res = await api.get('/user/getAllMembers');
    return { membersList: res.data.membersList || [] };
  },
  getById: async (id) => {
    const res = await api.get(`/user/get/${id}`);
    return normalizeStudent(res.data.user);
  },
  getMyProfile: async () => {
    const res = await api.get('/user/me');
    return normalizeStudent(res.data.user);
  },
  add: async (userData) => {
    const res = await api.post('/user/add', userData);
    return res.data;
  },
  update: async (id, userData) => {
    const res = await api.put(`/user/update/${id}`, userData);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/user/delete/${id}`);
    return res.data;
  },
  block: async (id, reason) => {
    const res = await api.patch(`/user/${id}/block`, { reason });
    return res.data;
  },
  unblock: async (id) => {
    const res = await api.patch(`/user/${id}/unblock`, {});
    return res.data;
  },
  searchByScholar: async (scholarNumber) => {
    const res = await api.get(`/user/search/scholar/${scholarNumber}`);
    return normalizeStudent(res.data.student);
  },
  searchByEnrollment: async (enrollmentNumber) => {
    const res = await api.get(`/user/search/enrollment/${enrollmentNumber}`);
    return normalizeStudent(res.data.student);
  },
  searchByRFID: async (rfidCard) => {
    const res = await api.get(`/user/search/rfid/${rfidCard}`);
    return normalizeStudent(res.data.student);
  }
};

// ─── BORROWALS ───────────────────────────────────────────────────────────────

export const borrowalApi = {
  getAll: async () => {
    const res = await api.get('/borrowal/getAll');
    return { borrowalsList: res.data.borrowalsList || [] };
  },
  getById: (id) => api.get(`/borrowal/get/${id}`),
  // Issue a book to a student
  issueBook: async ({ studentId, bookId, issueDate, dueDate }) => {
    const res = await api.post('/borrowal/add', {
      memberId: studentId,
      bookId,
      issueDate,
      dueDate
    });
    return res.data;
  },
  // Return a book — note: selectedBookId here is the borrowal _id
  returnBook: async ({ bookId: borrowalId, returnDate, fine }) => {
    const res = await api.post(`/borrowal/return/${borrowalId}`, { returnDate, fine });
    return res.data;
  },
  // Get active (issued) books for a student
  getIssuedByStudent: async (studentId) => {
    const res = await api.get(`/borrowal/student/${studentId}/issued`);
    return res.data.issuedBooks || [];
  },
  // Get full borrowal history for a student
  getHistoryByStudent: async (studentId) => {
    const res = await api.get(`/borrowal/student/${studentId}/history`);
    return res.data.borrowalsList || [];
  },
  // Search available books (for issue dialog)
  searchAvailableBooks: async (search) => {
    const res = await api.get('/borrowal/available-books', { params: { search } });
    return res.data.booksList || [];
  },
  update: async (id, data) => {
    const res = await api.put(`/borrowal/update/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/borrowal/delete/${id}`);
    return res.data;
  }
};

// ─── CHECK-IN / CHECK-OUT ────────────────────────────────────────────────────

export const checkInApi = {
  getAll: async ({ status, date, selectedDate } = {}) => {
    const params = {};

    if (status && status !== 'all') params.status = status;
    if (date && date !== 'all' && date !== 'custom') params.date = date;

    if (selectedDate) params.selectedDate = selectedDate;

    console.log("API PARAMS:", params); // debug

    const res = await api.get('/checkin', { params });

    return { checkInsList: res.data.checkInsList || [] };
  },
  checkIn: async (rfidCard) => {
    const res = await api.post('/checkin/checkin', { rfidCard });
    return res.data; // { success, message, student: { name, ... } }
  },
  checkOut: async (checkInId) => {
    const res = await api.post(`/checkin/checkout/${checkInId}`, {});
    return res.data; // { success, message, student: { name, ... } }
  },
  checkOutByRFID: async (rfidCard) => {
    const res = await api.post('/checkin/checkout-rfid', { rfidCard });
    return res.data;
  },
  getStudentHistory: async (studentId) => {
    const res = await api.get(`/checkin/student/${studentId}`);
    return res.data.history || [];
  }
};

// ─── PAYMENTS ────────────────────────────────────────────────────────────────

export const paymentApi = {
  getAll: async () => {
    const res = await api.get('/payment');
    return { paymentsList: res.data.paymentsList || [] };
  },
  getStats: async () => {
    const res = await api.get('/payment/stats');
    return res.data.data;
  },
  getByStudent: async (studentId) => {
    const res = await api.get(`/payment/student/${studentId}`);
    return res.data.paymentsList || [];
  },
  collectFine: async ({ studentId, amount, paymentMethod, receiptNumber, paymentDate, borrowalId, notes }) => {
    const res = await api.post('/payment/collect', {
      studentId,
      amount,
      paymentMethod,
      receiptNumber,
      paymentDate,
      borrowalId,
      notes
    });
    return res.data;
  }
};

// ─── SEATS ───────────────────────────────────────────────────────────────────

export const seatApi = {
  getAll: async ({ floor, section, status } = {}) => {
    const params = {};
    if (floor) params.floor = floor;
    if (section && section !== 'all') params.section = section;
    if (status && status !== 'all') params.status = status;
    const res = await api.get('/seat', { params });
    return res.data; // { success, count, data: [...] }
  },
  getStatistics: async () => {
    const res = await api.get('/seat/statistics');
    return res.data; // { success, data: { total, available, ... } }
  },
  getCurrentBooking: async () => {
    const res = await api.get('/seat/my-booking');
    return res.data; // { success, data: seat | null }
  },
  book: async (seatId, bookingData) => {
    const res = await api.post(`/seat/${seatId}/book`, bookingData);
    return res.data;
  },
  release: async (seatId) => {
    const res = await api.post(`/seat/${seatId}/release`, {});
    return res.data;
  },
  updateStatus: async (seatId, status) => {
    const res = await api.patch(`/seat/${seatId}/status`, { status });
    return res.data;
  },
  initialize: async () => {
    const res = await api.post('/seat/initialize', {});
    return res.data;
  }
};

// ─── MEMBER (Student self-service) ───────────────────────────────────────────

export const memberApi = {
  getDashboard: () => api.get('/member/dashboard'),
  getMyBorrowals: (params) => api.get('/member/my-borrowals', { params }),
  getMyIssuedBooks: () => api.get('/member/my-issued-books'),
  getMyCheckIns: (params) => api.get('/member/my-checkins', { params }),
  getMyCurrentCheckIn: () => api.get('/member/my-current-checkin'),
  getMyPayments: () => api.get('/member/my-payments'),
  getMyFines: () => api.get('/member/my-fines'),
  getMyProfile: () => api.get('/member/profile'),
  updateMyProfile: (data) => api.put('/member/profile', data),
  changeMyPassword: (data) => api.put('/member/change-password', data),
  getMySeat: () => api.get('/member/my-seat'),
  getMySeatHistory: () => api.get('/member/my-seat-history'),
  renewBook: (borrowalId) => api.post(`/member/renew/${borrowalId}`, {}),
};

export default api;
