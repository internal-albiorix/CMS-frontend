import React, { lazy, Suspense } from "react";
import { CircularProgress } from "@mui/material";
import BaseLayout from "../common/BaseLayout/BaseLayout";
import { RouteObject, Navigate } from "react-router-dom";
import { ProtectedRoute } from "../helpers/CheckAuth";


const LazyLoader = (Component: React.FC) => (props: any) =>
  (
    <Suspense fallback={<CircularProgress />}>
      <Component {...props} />
    </Suspense>
  );

//All Lazy loaded components
const Dashboard = LazyLoader(
  lazy(() => import("../components/Dashboard/Dashboard"))
);
const Inquiries = LazyLoader(
  lazy(() => import("../components/Inquiries/Inquiries"))
);
const Candidate = LazyLoader(
  lazy(() => import("../components/Candidates/Candidate"))
);
const ScheduleInterview = LazyLoader(
  lazy(() => import("../components/ScheduleInterview/ScheduleInterview"))
);
const FeedBackForm = LazyLoader(
  lazy(() => import("../components/Candidates/FeedBackForm"))
);
const Users = LazyLoader(lazy(() => import("../components/Users/Users")));
const CurrentOpenings = LazyLoader(
  lazy(() => import("../components/CurrentOpenings/CurrentOpenings"))
);
const ReferEmployee = LazyLoader(
  lazy(() => import("../components/ReferEmployee/ReferEmployee"))
);
const Reports = LazyLoader(lazy(() => import("../components/Reports/Reports")));
const Profile = LazyLoader(lazy(() => import("../components/Profile/Profile")));
const Status = LazyLoader(
  lazy(() => import("../components/Master/Status/Status"))
);
const Login = LazyLoader(lazy(() => import("../components/Login/LoginPage")));
const ForgotPassword = LazyLoader(lazy(() => import("../components/ForgotPassword/ForgotPassword")));
const ResetPassword = LazyLoader(lazy(() => import("../components/ForgotPassword/ResetPassword")));
const AddReferEmployee = LazyLoader(
  lazy(() => import("../components/ReferEmployee/AddReferEmployee"))
);
const Technology = LazyLoader(
  lazy(() => import("../components/Master/Technology/Technology"))
);
const InterviewRound = LazyLoader(
  lazy(() => import("../components/Master/InterviewRound/InterviewRound"))
);
const Designation = LazyLoader(
  lazy(() => import("../components/Master/Designation/Designation"))
);
const EmailTemplate = LazyLoader(
  lazy(() => import("../components/Master/EmailTemplate/EmailTemplate"))
);
const EmailLog = LazyLoader(
  lazy(() => import("../components/Master/EmailLog/EmailLog"))
);

const routes: RouteObject[] = [
  {
    path: "/",
    children: [
      {
        path: "/",
        element: <Navigate to="login" replace />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/add-refer-employee",
        element: <AddReferEmployee />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/",
    element: <BaseLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute Roles="1,2,3">
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "inquiries",
        element: (
          <ProtectedRoute Roles="1,2">
            <Inquiries />
          </ProtectedRoute>
        ),
      },
      {
        path: "candidates",
        element: (
          <ProtectedRoute Roles="1,2,3">
            <Candidate />
          </ProtectedRoute>
        ),
      },
      {
        path: "users",
        element: (
          <ProtectedRoute Roles="1,2">
            <Users />
          </ProtectedRoute>
        ),
      },
      {
        path: "scheduleInterview",
        element: (
          <ProtectedRoute Roles="1,2,3">
            <ScheduleInterview />
          </ProtectedRoute>
        ),
      },
      {
        path: "feedbackForm",
        element: (
          <ProtectedRoute Roles="1,2,3">
            <FeedBackForm />
          </ProtectedRoute>
        ),
      },
      {
        path: "current-openings",
        element: (
          <ProtectedRoute Roles="1,2,3">
            <CurrentOpenings />
          </ProtectedRoute>
        ),
      },
      {
        path: "refer-employee",
        element: (
          <ProtectedRoute>
            <ReferEmployee />
          </ProtectedRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <ProtectedRoute Roles="1,2">
            <Reports />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute Roles="1,2,3">
            {" "}
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "status",
        element: (
          <ProtectedRoute Roles="1">
            <Status />
          </ProtectedRoute>
        ),
      },
      {
        path: "interviewRound",
        element: (
          <ProtectedRoute Roles="1">
            <InterviewRound />
          </ProtectedRoute>
        ),
      },
      {
        path: "technology",
        element: (
          <ProtectedRoute Roles="1">
            <Technology />
          </ProtectedRoute>
        ),
      },
      {
        path: "designation",
        element: (
          <ProtectedRoute Roles="1">
            <Designation />
          </ProtectedRoute>
        ),
      },
      {
        path: "emailtemplate",
        element: (
          <ProtectedRoute Roles="1,2">
            <EmailTemplate />
          </ProtectedRoute>
        ),
      },
      {
        path: "emaillog",
        element: (
          <ProtectedRoute Roles="1,2">
            <EmailLog />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <h1>404 Not Found!!!</h1>,
  },
];

export default routes;
