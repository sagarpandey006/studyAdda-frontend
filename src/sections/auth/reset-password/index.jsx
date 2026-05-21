// import { Helmet } from "react-helmet-async";
// import { useState } from "react";
// import { styled } from "@mui/material/styles";
// import axios from "axios";
// import toast from "react-hot-toast";
// import {
//     Box,
//     Typography,
//     TextField,
//     Button,
//     IconButton,
//     InputAdornment,
//     Link
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
// import { authApi } from "../../../services/api";

// const PageWrapper = styled("div")({
//     display: "flex",
//     minHeight: "100vh",
//     backgroundColor: "#f5f5f5",
//     alignItems: "center",
//     justifyContent: "center",
// });

// const Card = styled("div")({
//     width: "100%",
//     maxWidth: 500,
//     padding: "2.5rem",
//     borderRadius: 16,
//     boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
//     backgroundColor: "#fff",
// });

// const PrimaryButton = styled(Button)({
//     height: 44,
//     backgroundColor: "#6366f1",
//     color: "#fff",
//     borderRadius: 8,
//     textTransform: "none",
//     "&:hover": {
//         backgroundColor: "#4f46e5",
//     },
// });

// export default function ResetPassword() {
//     const { token } = useParams();
//     const navigate = useNavigate();

//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [showPassword, setShowPassword] = useState(false);
//     const [success, setSuccess] = useState(false);

//     const handleSubmit = async () => {
//         if (!password || !confirmPassword) {
//             toast.error("Please fill all fields");
//             return;
//         }

//         if (password !== confirmPassword) {
//             toast.error("Passwords do not match");
//             return;
//         }

//         try {
//             const res = await authApi.resetPassword(token, password);

//             toast.success(res.data.message);
//             setSuccess(true);
//         } catch (err) {
//             toast.error(err.response?.data?.message || "Something went wrong");
//         }
//     };

//     return (
//         <>
//             <Helmet>
//                 <title>Reset Password | StudyAdda</title>
//             </Helmet>

//             <PageWrapper>
//                 <Card>

//                     {!success ? (
//                         <>
//                             <Typography variant="h5" sx={{ mb: 1 }}>
//                                 Set new password
//                             </Typography>

//                             <Typography sx={{ fontSize: 14, color: "#888", mb: 3 }}>
//                                 Enter your new password below
//                             </Typography>

//                             <TextField
//                                 label="New Password"
//                                 type={showPassword ? "text" : "password"}
//                                 fullWidth
//                                 size="small"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 sx={{ mb: 2 }}
//                                 InputProps={{
//                                     endAdornment: (
//                                         <InputAdornment position="end">
//                                             <IconButton onClick={() => setShowPassword((v) => !v)}>
//                                                 {showPassword ? <VisibilityOff /> : <Visibility />}
//                                             </IconButton>
//                                         </InputAdornment>
//                                     ),
//                                 }}
//                             />

//                             <TextField
//                                 label="Confirm Password"
//                                 type={showPassword ? "text" : "password"}
//                                 fullWidth
//                                 size="small"
//                                 value={confirmPassword}
//                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                 sx={{ mb: 2 }}
//                             />

//                             <PrimaryButton fullWidth onClick={handleSubmit}>
//                                 Reset Password
//                             </PrimaryButton>
//                         </>
//                     ) : (
//                         <>
//                             {/* SUCCESS SCREEN */}
//                             <Box
//                                 sx={{
//                                     display: "flex",
//                                     justifyContent: "center",
//                                     alignItems: "center",
//                                     height: "100%"
//                                 }}
//                             >
//                                 <Typography variant="h5" sx={{ mb: 1 }}>
//                                     Password Updated
//                                 </Typography>
//                             </Box>

//                             <Typography
//                                 sx={{
//                                     fontSize: 14,
//                                     color: "#888",
//                                     mb: 3,
//                                     textAlign: "center"
//                                 }}
//                             >
//                                 Your password has been successfully reset. You can now login with your new password.
//                             </Typography>

//                             <PrimaryButton
//                                 fullWidth
//                                 component={RouterLink}
//                                 to="/login"
//                             >
//                                 Go to Login
//                             </PrimaryButton>
//                         </>
//                     )}

//                 </Card>
//             </PageWrapper>
//         </>
//     );
// }



import { Helmet } from "react-helmet-async";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link as RouterLink, useParams, useNavigate } from "react-router-dom";
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
export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!password || !confirmPassword) {
            toast.error("Please fill all fields");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            const res = await authApi.resetPassword(token, password);
            toast.success(res.data.message);
            setSuccess(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSubmit();
    };

    return (
        <>
            <Helmet><title>Reset Password | StudyAdda</title></Helmet>

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
        @keyframes sa-float-orb {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-20px) scale(1.05); }
        }
        @keyframes sa-success-pop {
          0%   { opacity: 0; transform: scale(0.6); }
          70%  { transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes sa-check-draw {
          from { stroke-dashoffset: 50; }
          to   { stroke-dashoffset: 0; }
        }

        .sa-rp-root {
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

        /* Security steps list */
        .sa-steps-list {
          margin-top: 40px;
          width: 100%; max-width: 280px;
          position: relative; z-index: 1;
          opacity: 0;
          animation: sa-reveal-up 0.8s 0.6s cubic-bezier(.22,1,.36,1) forwards;
        }
        .sa-step-item {
          display: flex; align-items: flex-start; gap: 14px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .sa-step-item:last-child { border-bottom: none; }
        .sa-step-num {
          width: 24px; height: 24px; min-width: 24px;
          background: rgba(20,184,166,0.1);
          border: 1px solid rgba(20,184,166,0.25);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px; font-weight: 700;
          color: #14B8A6;
          margin-top: 1px;
        }
        .sa-step-content { display: flex; flex-direction: column; gap: 2px; }
        .sa-step-title {
          font-size: 12.5px; font-weight: 600;
          color: rgba(255,255,255,0.65);
        }
        .sa-step-sub {
          font-size: 11px;
          color: rgba(255,255,255,0.28);
          line-height: 1.5;
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

        /* Password strength bar */
        .sa-strength-bar {
          display: flex; gap: 4px;
          margin-top: 8px; margin-bottom: 4px;
        }
        .sa-strength-seg {
          flex: 1; height: 3px;
          border-radius: 2px;
          background: #E2E8F0;
          transition: background 0.3s ease;
        }
        .sa-strength-label {
          font-size: 11px;
          color: #94A3B8;
          margin-bottom: 12px;
          min-height: 16px;
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
          margin-top: 4px;
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

        /* ── Success State ── */
        .sa-success-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          opacity: 0;
          animation: sa-reveal-right 0.85s 0.1s cubic-bezier(.22,1,.36,1) forwards;
          padding: 20px 0;
        }

        .sa-success-icon-wrap {
          width: 84px; height: 84px;
          background: linear-gradient(135deg, rgba(15,118,110,0.12), rgba(20,184,166,0.08));
          border: 2px solid rgba(20,184,166,0.25);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          animation: sa-success-pop 0.5s 0.3s cubic-bezier(.22,1,.36,1) both;
        }

        .sa-success-check {
          stroke-dasharray: 50;
          stroke-dashoffset: 50;
          animation: sa-check-draw 0.5s 0.7s ease forwards;
        }

        .sa-success-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: 34px; font-weight: 700;
          color: #0F172A;
          letter-spacing: -0.5px;
          margin-bottom: 8px;
        }
        .sa-success-subtitle {
          font-size: 13.5px;
          color: #94A3B8;
          line-height: 1.7;
          max-width: 300px;
          margin-bottom: 32px;
        }

        .sa-back-link-row {
          margin-top: 20px;
          text-align: center; font-size: 13px; color: #94A3B8;
        }
        .sa-back-link {
          color: #0F172A; font-weight: 700;
          text-decoration: none; transition: color 0.2s;
        }
        .sa-back-link:hover { color: #14B8A6; }

        .sa-security-note {
          display: flex; align-items: center;
          justify-content: center; gap: 6px;
          margin-top: 20px;
          font-size: 11.5px; color: #CBD5E1;
        }

        .sa-bottom-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #0F766E, #14B8A6, #0EA5E9);
        }

        /* Responsive */
        @media (min-width: 900px) {
          .sa-rp-root { grid-template-columns: 5fr 7fr; }
          .sa-left-panel { display: flex; }
        }
        @media (max-width: 900px) {
          .sa-left-panel { display: none; }
          .sa-rp-root { grid-template-columns: 1fr; }
          .sa-mobile-logo { display: flex; }
          .sa-right-panel { padding: 36px 24px; justify-content: flex-start; }
          .sa-form-title { font-size: 30px; }
          .sa-success-title { font-size: 26px; }
        }
      `}</style>

            <div className="sa-rp-root">

                {/* ══ Left Panel ══ */}
                <div className="sa-left-panel">
                    <Particles />
                    <SpeedLines />
                    <div className="sa-orb sa-orb-1" />
                    <div className="sa-orb sa-orb-2" />
                    <div className="sa-mesh" />

                    <div className="sa-brand-reveal">
                        <div style={{
                            width: "120px", height: "120px",
                            borderRadius: "50%", overflow: "hidden",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            marginBottom: "10px"
                        }}>
                            <img
                                src="/assets/studyadda-main.png"
                                alt="StudyAdda Logo"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                        <p className="sa-brand-tagline">Your Library · Your Space</p>
                        <p className="sa-brand-desc">
                            Keep your account safe. Choose a strong password to protect your library access.
                        </p>
                    </div>

                    <div className="sa-steps-list">
                        {[
                            { num: "1", title: "Enter New Password", sub: "Choose a strong, unique password" },
                            { num: "2", title: "Confirm Password", sub: "Re-enter to avoid typos" },
                            { num: "3", title: "Reset & Login", sub: "Access your dashboard instantly" },
                        ].map((s) => (
                            <div className="sa-step-item" key={s.num}>
                                <div className="sa-step-num">{s.num}</div>
                                <div className="sa-step-content">
                                    <span className="sa-step-title">{s.title}</span>
                                    <span className="sa-step-sub">{s.sub}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="sa-bottom-tag">SMART LIBRARY MANAGEMENT SYSTEM</p>
                </div>

                {/* ══ Right Panel ══ */}
                <div className="sa-right-panel">

                    {/* Mobile logo */}
                    <div className="sa-mobile-logo">
                        <div style={{ width: "160px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <img
                                src="/assets/studyadda-rect.png"
                                alt="StudyAdda Logo"
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                        </div>
                    </div>

                    {!success ? (
                        <div className="sa-form-reveal">
                            <p className="sa-form-greeting">Account Recovery</p>
                            <h1 className="sa-form-title">Reset Password</h1>
                            <p className="sa-form-subtitle">Set a new password for your account</p>
                            <div className="sa-divider-line" />

                            {/* New Password */}
                            <div className="sa-field-group">
                                <label className="sa-field-label">
                                    New Password
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

                                {/* Password Strength Indicator */}
                                {password.length > 0 && (() => {
                                    const len = password.length;
                                    const hasUpper = /[A-Z]/.test(password);
                                    const hasNum = /[0-9]/.test(password);
                                    const hasSpec = /[^A-Za-z0-9]/.test(password);
                                    const score = (len >= 8 ? 1 : 0) + (hasUpper ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpec ? 1 : 0);
                                    const colors = ["#EF4444", "#F97316", "#EAB308", "#14B8A6"];
                                    const labels = ["Weak", "Fair", "Good", "Strong"];
                                    return (
                                        <>
                                            <div className="sa-strength-bar">
                                                {[0, 1, 2, 3].map((i) => (
                                                    <div key={i} className="sa-strength-seg" style={{ background: i < score ? colors[score - 1] : "#E2E8F0" }} />
                                                ))}
                                            </div>
                                            <p className="sa-strength-label" style={{ color: colors[score - 1] }}>
                                                {labels[score - 1]} password
                                            </p>
                                        </>
                                    );
                                })()}
                            </div>

                            {/* Confirm Password */}
                            <div className="sa-field-group">
                                <label className="sa-field-label">
                                    Confirm Password
                                    <div className="sa-field-wrapper">
                                        <input
                                            type={showConfirm ? "text" : "password"}
                                            className="sa-field-input"
                                            placeholder="••••••••"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            style={{
                                                borderColor: confirmPassword.length > 0
                                                    ? confirmPassword === password ? "rgba(20,184,166,0.6)" : "rgba(239,68,68,0.5)"
                                                    : undefined
                                            }}
                                        />
                                        <span className="sa-field-icon-left">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                            </svg>
                                        </span>
                                        <button
                                            type="button"
                                            className="sa-field-icon-right"
                                            onClick={() => setShowConfirm((v) => !v)}
                                            tabIndex={-1}
                                        >
                                            {showConfirm ? (
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
                                {confirmPassword.length > 0 && (
                                    <p style={{
                                        fontSize: 11.5,
                                        marginTop: 6,
                                        color: confirmPassword === password ? "#14B8A6" : "#EF4444"
                                    }}>
                                        {confirmPassword === password ? "✓ Passwords match" : "✗ Passwords do not match"}
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <button className="sa-submit-btn" onClick={handleSubmit}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                Reset Password
                            </button>

                            <p className="sa-back-link-row" style={{ marginTop: 20 }}>
                                Remember your password?{" "}
                                <RouterLink to="/login" className="sa-back-link">
                                    Back to Sign In →
                                </RouterLink>
                            </p>

                            <p className="sa-security-note">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Secured with end-to-end encryption
                            </p>
                        </div>
                    ) : (
                        /* ══ Success State ══ */
                        <div className="sa-success-wrap">
                            <div className="sa-success-icon-wrap">
                                <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                                    <path
                                        className="sa-success-check"
                                        d="M5 12L9.5 16.5L19 7"
                                        stroke="#14B8A6"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            <p className="sa-form-greeting" style={{ justifyContent: "center" }}>All Done</p>
                            <h1 className="sa-success-title">Password Updated!</h1>
                            <p className="sa-success-subtitle">
                                Your password has been successfully reset. You can now sign in with your new password.
                            </p>

                            <RouterLink
                                to="/login"
                                style={{ width: "100%", textDecoration: "none" }}
                            >
                                <button className="sa-submit-btn" style={{ width: "100%" }}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                        <polyline points="10 17 15 12 10 7" />
                                        <line x1="15" y1="12" x2="3" y2="12" />
                                    </svg>
                                    Go to Sign In
                                </button>
                            </RouterLink>

                            <p className="sa-security-note" style={{ marginTop: 24 }}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                Secured with end-to-end encryption
                            </p>
                        </div>
                    )}

                    <div className="sa-bottom-bar" />
                </div>
            </div>
        </>
    );
}