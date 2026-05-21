import { Navigate, useRoutes } from "react-router-dom";
import LibraryApp from "./layouts/dashboard";
import LoginPage from "./sections/auth/login/LoginPage";
import RegisterPage from "./sections/auth/register";
import Page404 from "./pages/Page404";
import ForgotPassword from "./sections/auth/forget-password/index"
import ResetPassword from "./sections/auth/reset-password/index"

// Admin Components
import BookPage from "./sections/@dashboard/admin/books/BookPage";
import DashboardAppPage from "./sections/@dashboard/admin/dashboard/DashboardAppPage";
import UsersPage from "./sections/@dashboard/admin/users/UserPage";
import SeatPage from "./sections/@dashboard/admin/seats/SeatPage";
import StudentPage from "./sections/@dashboard/admin/students/StudentPage";
import StudentProfilePage from "./sections/@dashboard/admin/students/StudentProfilePage";
import CheckInOutPage from "./sections/@dashboard/admin/checkin-checkout/CheckInOutPage";

import ReservationPage from "./sections/@dashboard/admin/reservations/ReservationPage";
import IssueReturnManagementPage from "./sections/@dashboard/admin/issue-return/IssueReturnManagementPage";

// Member Components
import StudentDashboard from "./sections/@dashboard/member/StudentDashboard";
import BrowseBooksPage from "./sections/@dashboard/member/BrowseBooksPage";
import MyIssuedBooksPage from "./sections/@dashboard/member/MyIssuedBooksPage";
import MyReservationsPage from "./sections/@dashboard/member/MyReservationsPage";
import MemberSeatBookingPage from "./sections/@dashboard/member/MemberSeatBookingPage";
import MemberProfilePage from "./sections/@dashboard/member/MemberProfilePage";

import { useAuth } from "./hooks/useAuth";

// 

export default function Router() {
  const { user } = useAuth();
  const adminRoutes = useRoutes([
    {
      path: "/admin",
      element: <LibraryApp />,
      children: [
        { element: <Navigate to="/admin/dashboard" />, index: true },
        { path: "dashboard", element: <DashboardAppPage /> },
        { path: "users", element: <UsersPage /> },
        { path: "students", element: <StudentPage /> },
        { path: "students/profile/:studentId", element: <StudentProfilePage /> },
        { path: "books", element: <BookPage /> },
        { path: "seats", element: <SeatPage /> },
        { path: "checkin-checkout", element: <CheckInOutPage /> },

        { path: "reservations", element: <ReservationPage /> },
        { path: "issue-return", element: <IssueReturnManagementPage /> },

      ]
    },
    {
      path: "/",
      element: <Navigate to="/admin/dashboard" replace />
    },
    {
      path: "login",
      element: <LoginPage />
    },
    {
      path: "register",
      element: <RegisterPage />
    },
    {
      path: "404",
      element: <Page404 />
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />
    }
  ]);

  const memberRoutes = useRoutes([
    {
      path: "/member",
      element: <LibraryApp />,
      children: [
        { element: <Navigate to="/member/dashboard" />, index: true },
        { path: "dashboard", element: <StudentDashboard /> },
        { path: "browse-books", element: <BrowseBooksPage /> },
        { path: "seat-booking", element: <MemberSeatBookingPage /> },
        { path: "my-reservations", element: <MyReservationsPage /> },
        { path: "my-issued-books", element: <MyIssuedBooksPage /> },
        { path: "profile", element: <MemberProfilePage /> }
      ]
    },
    {
      path: "/",
      element: <Navigate to="/member/dashboard" replace />
    },
    {
      path: "login",
      element: <LoginPage />
    },
    {
      path: "register",
      element: <RegisterPage />
    },
    {
      path: "404",
      element: <Page404 />
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />
    }
  ]);

  const guestRoutes = useRoutes([
    {
      path: "login",
      element: <LoginPage />
    },
    {
      path: "register",
      element: <RegisterPage />
    },
    {
      path: "forgetpassword",
      element: <ForgotPassword />
    },
    {
      path: "resetpassword/:token",
      element: <ResetPassword />
    },
    {
      path: "404",
      element: <Page404 />
    },
    {
      path: "*",
      element: <Navigate to="/login" replace />
    }
  ]);

  if (user) {
    if (user.isAdmin) {
      return adminRoutes;

    }
    return memberRoutes;
  }
  return guestRoutes;
}
