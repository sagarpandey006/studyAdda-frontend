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
//     Link
// } from "@mui/material";
// import { Link as RouterLink } from "react-router-dom";
// import { authApi } from "../../../services/api";

// const PageWrapper = styled("div")({
//     display: "flex",
//     minHeight: "100vh",
//     backgroundColor: "#f5f5f5",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "1rem",
// });

// const Card = styled("div")({
//     display: "flex",
//     width: "100%",
//     maxWidth: 900,
//     minHeight: 560,
//     borderRadius: 16,
//     overflow: "hidden",
//     boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
//     backgroundColor: "#ffffff",
// });

// const LeftPanel = styled("div")({
//     flex: 1,
//     background: "#1a1a2e",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     padding: "3rem 2rem",
//     position: "relative",
//     overflow: "hidden",
//     "@media (max-width: 600px)": {
//         display: "none",
//     },
//     "&::before": {
//         content: '""',
//         position: "absolute",
//         width: 280,
//         height: 280,
//         borderRadius: "50%",
//         background: "rgba(99,102,241,0.12)",
//         top: -60,
//         left: -60,
//     },
//     "&::after": {
//         content: '""',
//         position: "absolute",
//         width: 200,
//         height: 200,
//         borderRadius: "50%",
//         background: "rgba(99,102,241,0.08)",
//         bottom: -40,
//         right: -40,
//     },
// });

// const BrandIcon = styled("div")({
//     width: 56,
//     height: 56,
//     background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
//     borderRadius: 16,
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: "1.5rem",
//     position: "relative",
//     zIndex: 1,
// });

// const RightPanel = styled("div")({
//     flex: 1.1,
//     padding: "3rem 2.5rem",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
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

// export default function ForgotPassword() {
//     const [email, setEmail] = useState("");
//     const [userNotFound, setUserNotFound] = useState(false);
//     const [mailSent, setMailSent] = useState(false);

//     const handleSubmit = async () => {
//         if (!email) {
//             toast.error("Please enter email");
//             return;
//         }

//         try {
//             const res = await authApi.forgotPassword(email);

//             setUserNotFound(false);
//             setMailSent(true);
//             setEmail("");

//             toast.success(res.data.message);
//         } catch (err) {
//             const message = err.response?.data?.message;

//             if (message === "User not found") {
//                 setUserNotFound(true);
//                 toast.error("Account not found. Please create one.");
//             } else {
//                 toast.error(message || "Something went wrong");
//             }
//         }
//     };

//     return (
//         <>
//             <Helmet>
//                 <title>Forgot Password | StudyAdda</title>
//             </Helmet>

//             <PageWrapper>
//                 <Card>
//                     {/* Left branding panel */}
//                     <LeftPanel>
//                         <BrandIcon>
//                             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
//                                 <path d="M12 2L2 7l10 5 10-5-10-5z" />
//                                 <path d="M2 17l10 5 10-5" />
//                                 <path d="M2 12l10 5 10-5" />
//                             </svg>
//                         </BrandIcon>

//                         <Typography variant="h5" sx={{ color: "#fff", fontWeight: 500, textAlign: "center", mb: 0.5, zIndex: 1, position: "relative" }}>
//                             StudyAdda
//                         </Typography>
//                         <Typography sx={{ color: "rgba(255,255,255,0.5)", fontSize: 14, textAlign: "center", lineHeight: 1.7, zIndex: 1, position: "relative" }}>
//                             Your smart library companion.<br />
//                             Access resources, track progress,<br />
//                             and learn better every day.
//                         </Typography>


//                     </LeftPanel>

//                     {/* RIGHT PANEL */}
//                     <RightPanel>

//                         {!mailSent ? (
//                             <>
//                                 <Typography sx={{ fontSize: 12, color: "#6366f1" }}>
//                                     Forgot password
//                                 </Typography>

//                                 <Typography variant="h5" sx={{ mb: 1 }}>
//                                     Reset your password
//                                 </Typography>

//                                 <Typography sx={{ fontSize: 14, color: "#888", mb: 3 }}>
//                                     Enter your email and we’ll send you a reset link
//                                 </Typography>

//                                 <TextField
//                                     label="Email address"
//                                     fullWidth
//                                     size="small"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     sx={{ mb: 2 }}
//                                 />

//                                 <PrimaryButton fullWidth onClick={handleSubmit}>
//                                     Send Reset Link
//                                 </PrimaryButton>

//                                 <Box sx={{ mt: 2 }}>
//                                     <Typography sx={{ fontSize: 13, color: "#888" }}>
//                                         Remember your password?{" "}
//                                         <Link component={RouterLink} to="/login">
//                                             Sign in
//                                         </Link>
//                                     </Typography>

//                                     {userNotFound && (
//                                         <Typography sx={{ fontSize: 13, color: "#ff4d4f", mt: 1 }}>
//                                             No account found.{" "}
//                                             <Link component={RouterLink} to="/register">
//                                                 Create account
//                                             </Link>
//                                         </Typography>
//                                     )}
//                                 </Box>
//                             </>
//                         ) : (
//                             <>
//                                 {/* SUCCESS SCREEN */}
//                                 <Typography variant="h5" sx={{ mb: 1 }}>
//                                     Check your email 📩
//                                 </Typography>

//                                 <Typography sx={{ fontSize: 14, color: "#888", mb: 3 }}>
//                                     We have sent a password reset link to your email.
//                                     Please check your inbox and follow the instructions.
//                                 </Typography>

//                                 <PrimaryButton
//                                     fullWidth
//                                     component={RouterLink}
//                                     to="/login"
//                                 >
//                                     Back to Login
//                                 </PrimaryButton>
//                             </>
//                         )}

//                     </RightPanel>
//                 </Card>
//             </PageWrapper>
//         </>
//     );
// }




import { Helmet } from "react-helmet-async";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link as RouterLink } from "react-router-dom";
import { authApi } from "../../../services/api";

// ─── Particles + SpeedLines (same as LoginPage) ───────────────
const Particles = () => {
    const pts = Array.from({ length: 20 }, (_, i) => ({
        id: i, left: `${(i * 41 + 13) % 100}%`, top: `${(i * 57 + 9) % 100}%`,
        size: i % 3 === 0 ? 3 : i % 3 === 1 ? 2 : 1.5,
        delay: `${(i * 0.35).toFixed(1)}s`, dur: `${3 + (i % 4)}s`,
    }));
    return (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
            {pts.map(p => (
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
const SpeedLines = () => (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {[12, 28, 45, 60, 74, 88].map((top, i) => (
            <div key={i} style={{
                position: "absolute", top: `${top}%`, left: "-100%",
                height: i % 2 === 0 ? "1px" : "0.5px", width: `${28 + i * 7}%`,
                background: `linear-gradient(90deg,transparent,rgba(20,184,166,${0.07 + i * 0.01}),transparent)`,
                animation: `sa-speed-line ${2.5 + i * 0.3}s ${i * 0.5}s linear infinite`,
            }} />
        ))}
    </div>
);

// ─── Component ────────────────────────────────────────────────
export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [userNotFound, setUserNotFound] = useState(false);
    const [mailSent, setMailSent] = useState(false);

    const handleSubmit = async () => {
        if (!email) { toast.error("Please enter email"); return; }
        try {
            const res = await authApi.forgotPassword(email);
            setUserNotFound(false);
            setMailSent(true);
            setEmail("");
            toast.success(res.data.message);
        } catch (err) {
            const message = err.response?.data?.message;
            if (message === "User not found") {
                setUserNotFound(true);
                toast.error("Account not found. Please create one.");
            } else {
                toast.error(message || "Something went wrong");
            }
        }
    };

    return (
        <>
            <Helmet><title>Forgot Password | StudyAdda</title></Helmet>

            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Rajdhani:wght@500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes sa-pulse-dot {
          from { opacity: 0.15; transform: scale(1); }
          to   { opacity: 0.75; transform: scale(1.7); }
        }
        @keyframes sa-speed-line { from { left:-100%; } to { left:200%; } }
        @keyframes sa-reveal-left {
          from { opacity:0; transform:translateX(-36px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes sa-reveal-up {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes sa-reveal-right {
          from { opacity:0; transform:translateX(36px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes sa-shimmer {
          0% { background-position:-200% center; }
          100% { background-position:200% center; }
        }
        @keyframes sa-float-orb {
          0%,100% { transform:translateY(0) scale(1); }
          50%      { transform:translateY(-20px) scale(1.05); }
        }
        @keyframes sa-success-pop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.1); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes sa-draw-check {
          from { stroke-dashoffset: 60; }
          to   { stroke-dashoffset: 0; }
        }

        .sa-fp-root {
          min-height: 100vh; display: grid;
          grid-template-columns: 1fr;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #080D14;
        }

        /* ── Left Panel (identical to login) ── */
        .sa-left-panel {
          background: linear-gradient(145deg,#060D18 0%,#091820 45%,#071510 100%);
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 60px 48px; position: relative; overflow: hidden;
        }
        .sa-left-panel::after {
          content:''; position:absolute;
          right:0; top:0; bottom:0; width:1px;
          background:linear-gradient(180deg,transparent,rgba(20,184,166,0.35),rgba(20,184,166,0.15),transparent);
        }
        .sa-orb { position:absolute; border-radius:50%; pointer-events:none; }
        .sa-orb-1 {
          width:320px; height:320px; top:-100px; left:-100px;
          background:radial-gradient(circle,rgba(20,184,166,0.14) 0%,transparent 70%);
          animation:sa-float-orb 7s ease-in-out infinite;
        }
        .sa-orb-2 {
          width:220px; height:220px; bottom:-70px; right:-70px;
          background:radial-gradient(circle,rgba(20,184,166,0.09) 0%,transparent 70%);
          animation:sa-float-orb 9s ease-in-out infinite 2s;
        }
        .sa-mesh {
          position:absolute; inset:0;
          background-image:
            linear-gradient(rgba(20,184,166,0.035) 1px,transparent 1px),
            linear-gradient(90deg,rgba(20,184,166,0.035) 1px,transparent 1px);
          background-size:42px 42px; pointer-events:none;
        }
        .sa-brand-reveal {
          opacity:0;
          animation:sa-reveal-left 0.8s 0.3s cubic-bezier(.22,1,.36,1) forwards;
          display:flex; flex-direction:column;
          align-items:center; text-align:center;
          position:relative; z-index:1; width:100%;
        }
        .sa-brand-icon {
          width:64px; height:64px;
          background:linear-gradient(135deg,#0F766E,#14B8A6);
          border-radius:18px;
          display:flex; align-items:center; justify-content:center;
          margin-bottom:20px;
          box-shadow:0 0 36px rgba(20,184,166,0.4),0 8px 24px rgba(0,0,0,0.4);
        }
        .sa-brand-name {
          font-family:'Rajdhani',sans-serif;
          font-size:32px; font-weight:700; color:#F1F5F9;
          letter-spacing:2px; text-transform:uppercase; line-height:1;
        }
        .sa-brand-tagline {
          font-family:'Rajdhani',sans-serif;
          font-size:11px; letter-spacing:4px; text-transform:uppercase;
          color:rgba(20,184,166,0.7); margin-top:8px;
        }
        .sa-brand-desc {
          font-size:13px; color:rgba(255,255,255,0.35);
          margin-top:12px; line-height:1.7; max-width:260px;
        }
        .sa-feature-list {
          margin-top:36px; width:100%; max-width:280px;
          position:relative; z-index:1;
          opacity:0;
          animation:sa-reveal-up 0.8s 0.6s cubic-bezier(.22,1,.36,1) forwards;
        }
        .sa-feature-item {
          display:flex; align-items:center; gap:12px;
          padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05);
          color:rgba(255,255,255,0.5); font-size:13px;
        }
        .sa-feature-item:last-child { border-bottom:none; }
        .sa-feature-icon {
          width:28px; height:28px;
          background:rgba(20,184,166,0.08);
          border:1px solid rgba(20,184,166,0.2);
          border-radius:7px;
          display:flex; align-items:center; justify-content:center; flex-shrink:0;
        }
        .sa-bottom-tag {
          margin-top:40px; font-size:10.5px;
          color:rgba(20,184,166,0.5);
          background:rgba(20,184,166,0.07);
          border:1px solid rgba(20,184,166,0.12);
          border-radius:20px; padding:5px 14px;
          letter-spacing:0.08em; font-weight:600;
          position:relative; z-index:1;
          opacity:0;
          animation:sa-reveal-up 0.7s 0.9s cubic-bezier(.22,1,.36,1) forwards;
        }

        /* ── Right Panel ── */
        .sa-right-panel {
          background:#ffffff;
          display:flex; flex-direction:column; justify-content:center;
          padding:60px 52px; position:relative; overflow:hidden;
        }
        .sa-right-panel::before {
          content:''; position:absolute;
          top:-120px; right:-120px;
          width:340px; height:340px;
          background:radial-gradient(circle,rgba(20,184,166,0.04) 0%,transparent 70%);
          border-radius:50%; pointer-events:none;
        }
        .sa-form-reveal {
          opacity:0;
          animation:sa-reveal-right 0.85s 0.2s cubic-bezier(.22,1,.36,1) forwards;
        }
        .sa-mobile-logo { display:none; justify-content:center; margin-bottom:24px; }
        .sa-form-greeting {
          font-family:'Rajdhani',sans-serif;
          font-size:11px; letter-spacing:3.5px; text-transform:uppercase;
          color:#0D9488; margin-bottom:6px;
          display:flex; align-items:center; gap:8px;
        }
        .sa-form-greeting::before {
          content:''; display:inline-block;
          width:20px; height:2px; background:#14B8A6; border-radius:2px;
        }
        .sa-form-title {
          font-family:'Rajdhani',sans-serif;
          font-size:38px; font-weight:700; color:#0F172A;
          line-height:1.05; margin-bottom:6px; letter-spacing:-0.5px;
        }
        .sa-form-subtitle { font-size:13.5px; color:#94A3B8; margin-bottom:10px; }
        .sa-divider-line {
          width:44px; height:3px;
          background:linear-gradient(90deg,#0F766E,#14B8A6);
          border-radius:2px; margin-bottom:32px;
        }

        /* Fields */
        .sa-field-group { margin-bottom:20px; }
        .sa-field-label {
          display:block; font-size:10.5px; font-weight:700;
          letter-spacing:1.5px; text-transform:uppercase;
          color:#64748B; margin-bottom:8px;
        }
        .sa-field-wrapper { position:relative; }
        .sa-field-input {
          width:100%; height:48px; padding:0 14px 0 44px;
          border:1.5px solid #E2E8F0; border-radius:10px;
          font-family:'Plus Jakarta Sans',sans-serif;
          font-size:14px; color:#0F172A;
          background:#F8FAFC; transition:all 0.2s ease; outline:none;
        }
        .sa-field-input:hover { border-color:#CBD5E1; }
        .sa-field-input:focus {
          border-color:#14B8A6; background:#fff;
          box-shadow:0 0 0 3px rgba(20,184,166,0.1);
        }
        .sa-field-icon-left {
          position:absolute; left:14px; top:50%; transform:translateY(-50%);
          color:#CBD5E1; pointer-events:none; display:flex; transition:color 0.2s;
        }

        /* Submit */
        .sa-submit-btn {
          width:100%; height:50px;
          background:linear-gradient(135deg,#0F766E 0%,#14B8A6 100%);
          color:#fff; border:none; border-radius:10px;
          font-family:'Rajdhani',sans-serif;
          font-size:15px; font-weight:700;
          letter-spacing:2px; text-transform:uppercase;
          cursor:pointer; position:relative; overflow:hidden;
          transition:all 0.25s ease;
          display:flex; align-items:center; justify-content:center; gap:10px;
          box-shadow:0 4px 20px rgba(20,184,166,0.3);
        }
        .sa-submit-btn::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,transparent 30%,rgba(255,255,255,0.1),transparent 70%);
          background-size:200% 100%;
          animation:sa-shimmer 2.5s infinite;
        }
        .sa-submit-btn:hover {
          background:linear-gradient(135deg,#0D6B64 0%,#0EA5E9 100%);
          box-shadow:0 8px 28px rgba(20,184,166,0.4);
          transform:translateY(-1px);
        }
        .sa-submit-btn:active { transform:translateY(0); }

        /* Error state */
        .sa-error-box {
          display:flex; align-items:flex-start; gap:10px;
          background:#FFF5F5; border:1px solid #FECACA;
          border-radius:10px; padding:12px 14px; margin-bottom:16px;
          font-size:13px; color:#DC2626;
          opacity:0; animation:sa-reveal-up 0.3s forwards;
        }

        /* Success screen */
        .sa-success-wrap {
          display:flex; flex-direction:column; align-items:center;
          text-align:center;
          opacity:0;
          animation:sa-reveal-right 0.6s 0.1s cubic-bezier(.22,1,.36,1) forwards;
        }
        .sa-success-icon-wrap {
          width:80px; height:80px; border-radius:50%;
          background:rgba(20,184,166,0.1);
          border:2px solid rgba(20,184,166,0.2);
          display:flex; align-items:center; justify-content:center;
          margin-bottom:24px;
          animation:sa-success-pop 0.5s 0.2s cubic-bezier(.22,1,.36,1) both;
        }
        .sa-success-check {
          stroke-dasharray:60; stroke-dashoffset:60;
          animation:sa-draw-check 0.5s 0.6s ease forwards;
        }
        .sa-success-title {
          font-family:'Rajdhani',sans-serif;
          font-size:34px; font-weight:700; color:#0F172A;
          letter-spacing:-0.5px; margin-bottom:8px;
        }
        .sa-success-desc { font-size:14px; color:#64748B; line-height:1.7; max-width:320px; margin-bottom:28px; }
        .sa-hint-box {
          background:#F0FDF9; border:1px solid rgba(20,184,166,0.2);
          border-radius:10px; padding:12px 16px; margin-bottom:28px;
          font-size:13px; color:#0F766E; text-align:left; width:100%;
        }
        .sa-hint-box strong { display:block; margin-bottom:4px; color:#0D5C52; }

        .sa-link-row { text-align:center; font-size:13px; color:#94A3B8; margin-top:16px; }
        .sa-link { color:#0F172A; font-weight:700; text-decoration:none; transition:color 0.2s; }
        .sa-link:hover { color:#14B8A6; }
        .sa-bottom-bar {
          position:absolute; bottom:0; left:0; right:0; height:3px;
          background:linear-gradient(90deg,#0F766E,#14B8A6,#0EA5E9);
        }

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

        @media (min-width:900px) {
          .sa-fp-root { grid-template-columns:5fr 7fr; }
          .sa-left-panel { display:flex; }
        }
        @media (max-width:900px) {
          .sa-left-panel { display:none; }
          .sa-fp-root { grid-template-columns:1fr; }
          .sa-mobile-logo { display:flex; }
          .sa-right-panel { padding:36px 24px; justify-content:flex-start; }
          .sa-form-title { font-size:30px; }
        }
      `}</style>

            <div className="sa-fp-root">

                {/* ══ Left Panel ══ */}
                <div className="sa-left-panel">
                    <Particles />
                    <SpeedLines />
                    <div className="sa-orb sa-orb-1" />
                    <div className="sa-orb sa-orb-2" />
                    <div className="sa-mesh" />

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

                    <div className="sa-feature-list">
                        {["RFID-Powered Book Issue & Return", "Real-time Seat Booking Grid", "Smart Check-in / Check-out", "Fine & Payment Tracking", "Activity Analytics Dashboard"].map((label, i) => (
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
                    {/* Mobile Logo */}
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

                    {!mailSent ? (
                        <div className="sa-form-reveal">
                            <p className="sa-form-greeting">Forgot Password</p>
                            <h1 className="sa-form-title">Reset Password</h1>
                            <p className="sa-form-subtitle">Enter your email and we'll send you a reset link</p>
                            <div className="sa-divider-line" />

                            {userNotFound && (
                                <div className="sa-error-box">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
                                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                    </svg>
                                    <span>
                                        No account found with this email.{" "}
                                        <RouterLink to="/register" style={{ color: "#DC2626", fontWeight: 700 }}>Create an account →</RouterLink>
                                    </span>
                                </div>
                            )}

                            <div className="sa-field-group">
                                <label className="sa-field-label">Email Address</label>
                                <div className="sa-field-wrapper">
                                    <input
                                        type="email" className="sa-field-input"
                                        placeholder="you@example.com"
                                        value={email} onChange={e => setEmail(e.target.value)}
                                        onKeyDown={e => e.key === "Enter" && handleSubmit()}
                                    />
                                    <span className="sa-field-icon-left">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <button className="sa-submit-btn" onClick={handleSubmit}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                                Send Reset Link
                            </button>

                            {/* Or divider */}
                            <div className="sa-or-divider">
                                <span className="line" />
                                <span className="text">or</span>
                                <span className="line" />
                            </div>

                            <p className="sa-link-row" style={{ marginTop: 20 }}>
                                Remember your password?{" "}
                                <RouterLink to="/login" className="sa-link">Sign in →</RouterLink>
                            </p>
                        </div>
                    ) : (
                        <div className="sa-success-wrap">
                            <div className="sa-success-icon-wrap">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <path
                                        className="sa-success-check"
                                        d="M10 20 L17 27 L30 14"
                                        stroke="#14B8A6" strokeWidth="3"
                                        strokeLinecap="round" strokeLinejoin="round"
                                    />
                                </svg>
                            </div>

                            <h1 className="sa-success-title">Check Your Email</h1>
                            <p className="sa-success-desc">
                                We've sent a password reset link to your email address.
                                Please check your inbox and follow the instructions.
                            </p>

                            <div className="sa-hint-box">
                                <strong>Didn't receive the email?</strong>
                                Check your spam folder, or wait a few minutes and try again.
                            </div>

                            <button className="sa-submit-btn" onClick={() => window.location.href = "/login"}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                    <polyline points="10 17 15 12 10 7" />
                                    <line x1="15" y1="12" x2="3" y2="12" />
                                </svg>
                                Back to Sign In
                            </button>

                            <p className="sa-link-row">
                                Wrong email?{" "}
                                <button onClick={() => setMailSent(false)}
                                    style={{ background: "none", border: "none", color: "#0F172A", fontWeight: 700, cursor: "pointer", fontSize: 13, fontFamily: "inherit", padding: 0 }}>
                                    Try again
                                </button>
                            </p>
                        </div>
                    )}

                    <div className="sa-bottom-bar" />
                </div>
            </div>
        </>
    );
}