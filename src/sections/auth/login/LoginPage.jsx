// import { Helmet } from "react-helmet-async";
// import { useState } from "react";
// import { styled } from "@mui/material/styles";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, Link } from "@mui/material";
// import { Navigate, Link as RouterLink } from "react-router-dom";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { useAuth } from "../../../hooks/useAuth";
// import { authApi } from "../../../services/api";

// const PageWrapper = styled("div")({
//   display: "flex",
//   minHeight: "100vh",
//   backgroundColor: "#f5f5f5",
//   alignItems: "center",
//   justifyContent: "center",
//   padding: "1rem",
// });

// const Card = styled("div")({
//   display: "flex",
//   width: "100%",
//   maxWidth: 900,
//   minHeight: 560,
//   borderRadius: 16,
//   overflow: "hidden",
//   boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
//   backgroundColor: "#ffffff",
// });

// const LeftPanel = styled("div")({
//   flex: 1,
//   background: "#1a1a2e",
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   padding: "3rem 2rem",
//   position: "relative",
//   overflow: "hidden",
//   "@media (max-width: 600px)": {
//     display: "none",
//   },
//   "&::before": {
//     content: '""',
//     position: "absolute",
//     width: 280,
//     height: 280,
//     borderRadius: "50%",
//     background: "rgba(99,102,241,0.12)",
//     top: -60,
//     left: -60,
//   },
//   "&::after": {
//     content: '""',
//     position: "absolute",
//     width: 200,
//     height: 200,
//     borderRadius: "50%",
//     background: "rgba(99,102,241,0.08)",
//     bottom: -40,
//     right: -40,
//   },
// });

// const BrandIcon = styled("div")({
//   width: 56,
//   height: 56,
//   background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
//   borderRadius: 16,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   marginBottom: "1.5rem",
//   position: "relative",
//   zIndex: 1,
// });

// const StatRow = styled("div")({
//   display: "flex",
//   gap: "2rem",
//   marginTop: "2.5rem",
//   position: "relative",
//   zIndex: 1,
// });

// const RightPanel = styled("div")({
//   flex: 1.1,
//   backgroundColor: "#ffffff",
//   padding: "3rem 2.5rem",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
// });

// const PrimaryButton = styled(Button)({
//   height: 44,
//   backgroundColor: "#6366f1",
//   color: "#ffffff",
//   borderRadius: 8,
//   fontSize: 14,
//   fontWeight: 500,
//   textTransform: "none",
//   "&:hover": {
//     backgroundColor: "#4f46e5",
//   },
// });



// export default function LoginPage() {
//   const { login, user } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   if (user) {
//     return <Navigate to={user.isAdmin ? "/admin/dashboard" : "/member/dashboard"} replace />;
//   }

//   const loginUser = async () => {
//     if (!email || !password) {
//       toast.error("Please enter email and password");
//       return;
//     }

//     try {
//       const response = await authApi.login({ email, password });

//       if (response.status === 200) {
//         toast.success(`Successfully logged in as ${response.data.user.name}`);
//         login(response.data.user);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Login failed");
//       console.log(error);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") loginUser();
//   };

//   return (
//     <>
//       <Helmet>
//         <title>Login | StudyAdda</title>
//       </Helmet>

//       <PageWrapper>
//         <Card>
//           {/* Left branding panel */}
//           <LeftPanel>
//             <BrandIcon>
//               <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
//                 <path d="M12 2L2 7l10 5 10-5-10-5z" />
//                 <path d="M2 17l10 5 10-5" />
//                 <path d="M2 12l10 5 10-5" />
//               </svg>
//             </BrandIcon>

//             <Typography variant="h5" sx={{ color: "#fff", fontWeight: 500, textAlign: "center", mb: 0.5, zIndex: 1, position: "relative" }}>
//               StudyAdda
//             </Typography>
//             <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 14, textAlign: "center", lineHeight: 1.7, zIndex: 1, position: "relative" }}>
//               Your smart library companion.<br />
//               Access resources, track progress,<br />
//               and learn better every day.
//             </Typography>


//           </LeftPanel>

//           {/* Right form panel */}
//           <RightPanel>
//             <Typography sx={{ fontSize: 12, fontWeight: 500, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.08em", mb: 0.5 }}>
//               Welcome back
//             </Typography>
//             <Typography variant="h5" sx={{ fontWeight: 500, color: "#1a1a2e", mb: 0.5 }}>
//               Sign in to your account
//             </Typography>
//             <Typography sx={{ fontSize: 14, color: "#888", mb: 3 }}>
//               Enter your credentials to continue
//             </Typography>

//             <TextField
//               label="Email address"
//               type="email"
//               fullWidth
//               size="small"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               onKeyDown={handleKeyDown}
//               sx={{ mb: 2 }}
//             />

//             <TextField
//               label="Password"
//               type={showPassword ? "text" : "password"}
//               fullWidth
//               size="small"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               onKeyDown={handleKeyDown}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton size="small" onClick={() => setShowPassword((v) => !v)} edge="end">
//                       {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{ mb: 1.5 }}
//             />

//             <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
//               <FormControlLabel
//                 control={
//                   <Checkbox
//                     size="small"
//                     checked={rememberMe}
//                     onChange={(e) => setRememberMe(e.target.checked)}
//                     sx={{ color: "#6366f1", "&.Mui-checked": { color: "#6366f1" } }}
//                   />
//                 }
//                 label={<Typography sx={{ fontSize: 13, color: "#888" }}>Remember me</Typography>}
//               />
//               <Link href="forgetpassword" underline="hover" sx={{ fontSize: 13, color: "#6366f1" }}>
//                 Forgot password?
//               </Link>
//             </Box>

//             <PrimaryButton fullWidth onClick={loginUser}>
//               Sign in
//             </PrimaryButton>

//             <Typography sx={{ textAlign: "center", fontSize: 13, color: "#888", mt: 2.5 }}>
//               Don't have an account?{" "}
//               <Link component={RouterLink} to="/register" underline="hover" sx={{ color: "#6366f1", fontWeight: 500 }}>
//                 Create account
//               </Link>
//             </Typography>
//           </RightPanel>
//         </Card>
//       </PageWrapper>
//     </>
//   );
// }



import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { Navigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { authApi } from "../../../services/api";

// ─── Animated background particles (left panel) ───────────────
const Particles = () => {
  const pts = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${(i * 41 + 13) % 100}%`,
    top: `${(i * 57 + 9) % 100}%`,
    size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
    delay: `${(i * 0.35).toFixed(1)}s`,
    dur: `${3 + (i % 4)}s`,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      {pts.map((p) => (
        <div key={p.id} style={{
          position: "absolute", left: p.left, top: p.top,
          width: p.size, height: p.size, borderRadius: "50%",
          background: "rgba(20,184,166,0.5)",
          animation: `sa-pulse-dot ${p.dur} ${p.delay} ease-in-out infinite alternate`,
        }} />
      ))}
    </div>
  );
};

// ─── Speed lines (left panel) ─────────────────────────────────
const SpeedLines = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {[12, 28, 45, 60, 74, 88].map((top, i) => (
      <div key={i} style={{
        position: "absolute", top: `${top}%`, left: "-100%",
        height: i % 2 === 0 ? "1px" : "0.5px",
        width: `${28 + i * 7}%`,
        background: `linear-gradient(90deg, transparent, rgba(20,184,166,${0.07 + i * 0.01}), transparent)`,
        animation: `sa-speed-line ${2.5 + i * 0.3}s ${i * 0.5}s linear infinite`,
      }} />
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────
export default function LoginPage() {
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  if (user) {
    return <Navigate to={user.isAdmin ? "/admin/dashboard" : "/member/dashboard"} replace />;
  }

  const loginUser = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    try {
      const response = await authApi.login({ email, password });
      if (response.status === 200) {
        toast.success(`Welcome back, ${response.data.user.name}!`);
        login(response.data.user);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.log(error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") loginUser();
  };

  return (
    <>
      <Helmet><title>Login | StudyAdda</title></Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Rajdhani:wght@500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes sa-pulse-dot {
          from { opacity: 0.15; transform: scale(1); }
          to   { opacity: 0.75; transform: scale(1.7); }
        }
        @keyframes sa-speed-line {
          from { left: -100%; }
          to   { left: 200%; }
        }
        @keyframes sa-reveal-left {
          from { opacity: 0; transform: translateX(-36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes sa-reveal-up {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sa-reveal-right {
          from { opacity: 0; transform: translateX(36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes sa-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes sa-load-spin {
          to { transform: rotate(360deg); }
        }
        @keyframes sa-float-orb {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-20px) scale(1.05); }
        }

        .sa-login-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #080D14;
        }

        /* ── Left Panel ── */
        .sa-left-panel {
          background: linear-gradient(145deg, #060D18 0%, #091820 45%, #071510 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 60px 48px;
          position: relative;
          overflow: hidden;
        }
        .sa-left-panel::after {
          content: '';
          position: absolute;
          right: 0; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(180deg, transparent, rgba(20,184,166,0.35), rgba(20,184,166,0.15), transparent);
        }

        .sa-orb {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .sa-orb-1 {
          width: 320px; height: 320px;
          top: -100px; left: -100px;
          background: radial-gradient(circle, rgba(20,184,166,0.14) 0%, transparent 70%);
          animation: sa-float-orb 7s ease-in-out infinite;
        }
        .sa-orb-2 {
          width: 220px; height: 220px;
          bottom: -70px; right: -70px;
          background: radial-gradient(circle, rgba(20,184,166,0.09) 0%, transparent 70%);
          animation: sa-float-orb 9s ease-in-out infinite 2s;
        }

        .sa-mesh {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(20,184,166,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,184,166,0.035) 1px, transparent 1px);
          background-size: 42px 42px;
          pointer-events: none;
        }

        .sa-brand-reveal {
          opacity: 0;
          animation: sa-reveal-left 0.8s 0.3s cubic-bezier(.22,1,.36,1) forwards;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          z-index: 1;
          width: 100%;
        }

        .sa-brand-icon {
          width: 64px; height: 64px;
          background: linear-gradient(135deg, #0F766E, #14B8A6);
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 0 36px rgba(20,184,166,0.4), 0 8px 24px rgba(0,0,0,0.4);
        }

        .sa-brand-name {
          font-family: 'Rajdhani', sans-serif;
          font-size: 32px; font-weight: 700;
          color: #F1F5F9;
          letter-spacing: 2px;
          text-transform: uppercase;
          line-height: 1;
        }
        .sa-brand-tagline {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(20,184,166,0.7);
          margin-top: 8px;
        }
        .sa-brand-desc {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-top: 12px;
          line-height: 1.7;
          max-width: 260px;
        }

        .sa-feature-list {
          margin-top: 40px;
          width: 100%; max-width: 280px;
          position: relative; z-index: 1;
          opacity: 0;
          animation: sa-reveal-up 0.8s 0.6s cubic-bezier(.22,1,.36,1) forwards;
        }
        .sa-feature-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.5);
          font-size: 13px; letter-spacing: 0.3px;
        }
        .sa-feature-item:last-child { border-bottom: none; }
        .sa-feature-icon {
          width: 28px; height: 28px;
          background: rgba(20,184,166,0.08);
          border: 1px solid rgba(20,184,166,0.2);
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .sa-bottom-tag {
          margin-top: 44px;
          font-size: 10.5px;
          color: rgba(20,184,166,0.5);
          background: rgba(20,184,166,0.07);
          border: 1px solid rgba(20,184,166,0.12);
          border-radius: 20px;
          padding: 5px 14px;
          letter-spacing: 0.08em; font-weight: 600;
          position: relative; z-index: 1;
          opacity: 0;
          animation: sa-reveal-up 0.7s 0.9s cubic-bezier(.22,1,.36,1) forwards;
        }

        /* ── Right Panel ── */
        .sa-right-panel {
          background: #ffffff;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 52px;
          position: relative;
          overflow: hidden;
        }
        .sa-right-panel::before {
          content: '';
          position: absolute;
          top: -120px; right: -120px;
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(20,184,166,0.04) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }

        .sa-form-reveal {
          opacity: 0;
          animation: sa-reveal-right 0.85s 0.2s cubic-bezier(.22,1,.36,1) forwards;
        }

        .sa-mobile-logo {
          display: none;
          justify-content: center;
          margin-bottom: 24px;
        }

        .sa-form-greeting {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          letter-spacing: 3.5px;
          text-transform: uppercase;
          color: #0D9488;
          margin-bottom: 6px;
          display: flex; align-items: center; gap: 8px;
        }
        .sa-form-greeting::before {
          content: '';
          display: inline-block;
          width: 20px; height: 2px;
          background: #14B8A6;
          border-radius: 2px;
        }

        .sa-form-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: 38px; font-weight: 700;
          color: #0F172A;
          line-height: 1.05;
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }
        .sa-form-subtitle {
          font-size: 13.5px;
          color: #94A3B8;
          margin-bottom: 10px;
        }
        .sa-divider-line {
          width: 44px; height: 3px;
          background: linear-gradient(90deg, #0F766E, #14B8A6);
          border-radius: 2px;
          margin-bottom: 32px;
        }

        /* Fields */
        .sa-field-group { margin-bottom: 20px; }
        .sa-field-label {
          display: block;
          font-size: 10.5px; font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #64748B;
          margin-bottom: 8px;
        }
        .sa-field-wrapper { position: relative; }
        .sa-field-input {
          width: 100%; height: 48px;
          padding: 0 44px;
          border: 1.5px solid #E2E8F0;
          border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 14px; color: #0F172A;
          background: #F8FAFC;
          transition: all 0.2s ease;
          outline: none;
        }
        .sa-field-input:hover { border-color: #CBD5E1; }
        .sa-field-input:focus {
          border-color: #14B8A6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
        }
        .sa-field-icon-left {
          position: absolute;
          left: 14px; top: 50%; transform: translateY(-50%);
          color: #CBD5E1; pointer-events: none;
          transition: color 0.2s;
          display: flex;
        }
        .sa-field-icon-right {
          position: absolute;
          right: 14px; top: 50%; transform: translateY(-50%);
          color: #94A3B8; cursor: pointer;
          transition: color 0.2s;
          background: none; border: none;
          display: flex; align-items: center; padding: 0;
        }
        .sa-field-icon-right:hover { color: #0F172A; }

        .sa-forgot-link {
          font-size: 12.5px; color: #94A3B8;
          text-decoration: none;
          transition: color 0.2s; font-weight: 500;
        }
        .sa-forgot-link:hover { color: #14B8A6; }

        .sa-submit-btn {
          width: 100%; height: 50px;
          background: linear-gradient(135deg, #0F766E 0%, #14B8A6 100%);
          color: #fff; border: none;
          border-radius: 10px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer;
          position: relative; overflow: hidden;
          transition: all 0.25s ease;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          box-shadow: 0 4px 20px rgba(20,184,166,0.3);
        }
        .sa-submit-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.1), transparent 70%);
          background-size: 200% 100%;
          animation: sa-shimmer 2.5s infinite;
        }
        .sa-submit-btn:hover {
          background: linear-gradient(135deg, #0D6B64 0%, #0EA5E9 100%);
          box-shadow: 0 8px 28px rgba(20,184,166,0.4);
          transform: translateY(-1px);
        }
        .sa-submit-btn:active { transform: translateY(0); }

        .sa-or-divider {
          display: flex;
          align-items: center;
          margin: 20px 0;
          color: #64748B; /* slightly better contrast */
          font-size: 12px;
          font-weight: 500;
        }

        .sa-or-divider .line {
          flex: 1;
          height: 1px;
          background: #E2E8F0;
        }

        .sa-or-divider .text {
          margin: 0 12px;
          white-space: nowrap;
        }

        .sa-register-row {
          text-align: center; font-size: 13px; color: #94A3B8;
        }
        .sa-register-link {
          color: #0F172A; font-weight: 700;
          text-decoration: none; transition: color 0.2s;
        }
        .sa-register-link:hover { color: #14B8A6; }

        .sa-bottom-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #0F766E, #14B8A6, #0EA5E9);
        }

        .sa-security-note {
          display: flex; align-items: center;
          justify-content: center; gap: 6px;
          margin-top: 20px;
          font-size: 11.5px; color: #CBD5E1;
        }

        /* Responsive */
        @media (min-width: 900px) {
          .sa-login-root { grid-template-columns: 5fr 7fr; }
          .sa-left-panel { display: flex; }
        }
        @media (max-width: 900px) {
          .sa-left-panel { display: none; }
          .sa-login-root { grid-template-columns: 1fr; }
          .sa-mobile-logo { display: flex; }
          .sa-right-panel { padding: 36px 24px; justify-content: flex-start; }
          .sa-form-title { font-size: 30px; }
        }
      `}</style>

      <div className="sa-login-root">

        {/* ══ Left Panel ══ */}
        <div className="sa-left-panel">
          <Particles />
          <SpeedLines />
          <div className="sa-orb sa-orb-1" />
          <div className="sa-orb sa-orb-2" />
          <div className="sa-mesh" />

          <div className="sa-brand-reveal">
            <div
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "10px"
              }}
            >
              <img
                src="/assets/studyadda-main.png"
                alt="StudyAdda Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover"
                }}
              />
            </div>
            {/* <p className="sa-brand-name">StudyAdda</p> */}
            <p className="sa-brand-tagline">Your Library · Your Space</p>
            <p className="sa-brand-desc">
              Your smart library companion. Access resources, track progress,
              and learn better every day.
            </p>
          </div>

          <div className="sa-feature-list">
            {[
              "RFID-Powered Book Issue & Return",
              "Real-time Seat Booking Grid",
              "Smart Check-in / Check-out",
              "Fine & Payment Tracking",
              "Activity Analytics Dashboard",
            ].map((label, i) => (
              <div className="sa-feature-item" key={i}>
                <div className="sa-feature-icon">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8L6.5 11.5L13 5" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {label}
              </div>
            ))}
          </div>

          <p className="sa-bottom-tag">SMART LIBRARY MANAGEMENT SYSTEM</p>
        </div>

        {/* ══ Right Panel ══ */}
        <div className="sa-right-panel">

          {/* Mobile logo */}
          <div className="sa-mobile-logo">
            <div
              style={{
                width: "160px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src="/assets/studyadda-rect.png"
                alt="StudyAdda Logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain"
                }}
              />
            </div>
          </div>

          <div className="sa-form-reveal">
            <p className="sa-form-greeting">Welcome Back</p>
            <h1 className="sa-form-title">Sign In</h1>
            <p className="sa-form-subtitle">Access your library dashboard</p>
            <div className="sa-divider-line" />

            {/* Email */}
            <div className="sa-field-group">
              <label className="sa-field-label">
                Email Address
                <div className="sa-field-wrapper">
                  <input
                    type="email"
                    className="sa-field-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <span className="sa-field-icon-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </span>
                </div>
              </label>
            </div>

            {/* Password */}
            <div className="sa-field-group">
              <label className="sa-field-label">
                Password
                <div className="sa-field-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="sa-field-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <span className="sa-field-icon-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <button
                    type="button"
                    className="sa-field-icon-right"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>
            </div>

            {/* Remember + Forgot */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: -0.5, mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    sx={{ color: "#CBD5E1", "&.Mui-checked": { color: "#14B8A6" }, padding: "4px" }}
                  />
                }
                label={<span style={{ fontSize: 13, color: "#64748B" }}>Remember me</span>}
                sx={{ margin: 0 }}
              />
              <a href="forgetpassword" className="sa-forgot-link">Forgot password?</a>
            </Box>

            {/* Submit */}
            <button className="sa-submit-btn" onClick={loginUser}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign In
            </button>

            {/* Or divider */}
            <div className="sa-or-divider">
              <span className="line" />
              <span className="text">or</span>
              <span className="line" />
            </div>

            {/* Register */}
            <p className="sa-register-row">
              Don't have an account?{" "}
              <RouterLink to="/register" className="sa-register-link">
                Create account →
              </RouterLink>
            </p>

            {/* Security note */}
            <p className="sa-security-note">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Secured with end-to-end encryption
            </p>
          </div>

          <div className="sa-bottom-bar" />
        </div>
      </div>
    </>
  );
}