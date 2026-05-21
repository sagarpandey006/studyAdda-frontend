// import { Helmet } from "react-helmet-async";
// import { useState } from "react";
// import { styled } from "@mui/material/styles";
// import axios from "axios";
// import toast from "react-hot-toast";
// import {
//   Box, Typography, TextField, Button, IconButton,
//   InputAdornment, Link, MenuItem, Stepper, Step, StepLabel
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { Navigate, useNavigate } from "react-router-dom";
// import { useAuth } from "../../hooks/useAuth";
// import { authApi } from "../../services/api";

// // ─── Styled components ───────────────────────────────────────────────────────

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
//   minHeight: 580,
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
//   "@media (max-width: 600px)": { display: "none" },
//   "&::before": {
//     content: '""', position: "absolute",
//     width: 280, height: 280, borderRadius: "50%",
//     background: "rgba(99,102,241,0.12)", top: -60, left: -60,
//   },
//   "&::after": {
//     content: '""', position: "absolute",
//     width: 200, height: 200, borderRadius: "50%",
//     background: "rgba(99,102,241,0.08)", bottom: -40, right: -40,
//   },
// });

// const BrandIcon = styled("div")({
//   width: 56, height: 56,
//   background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
//   borderRadius: 16,
//   display: "flex", alignItems: "center", justifyContent: "center",
//   marginBottom: "1.5rem", position: "relative", zIndex: 1,
// });

// const StatRow = styled("div")({
//   display: "flex", gap: "2rem",
//   marginTop: "2.5rem", position: "relative", zIndex: 1,
// });

// const RightPanel = styled("div")({
//   flex: 1.1,
//   backgroundColor: "#ffffff",
//   padding: "2.5rem",
//   display: "flex",
//   flexDirection: "column",
//   justifyContent: "center",
//   overflowY: "auto",
// });

// const PrimaryButton = styled(Button)({
//   height: 44,
//   backgroundColor: "#6366f1",
//   color: "#ffffff",
//   borderRadius: 8,
//   fontSize: 14,
//   fontWeight: 500,
//   textTransform: "none",
//   "&:hover": { backgroundColor: "#4f46e5" },
// });

// const OutlineButton = styled(Button)({
//   height: 44,
//   backgroundColor: "transparent",
//   color: "#6366f1",
//   border: "1px solid #6366f1",
//   borderRadius: 8,
//   fontSize: 14,
//   fontWeight: 500,
//   textTransform: "none",
//   "&:hover": { backgroundColor: "#f0f0ff" },
// });

// // ─── Field config per step ────────────────────────────────────────────────────

// const COURSES = ["B.Tech", "M.Tech", "BCA", "MCA", "B.Sc", "M.Sc", "MBA", "Other"];
// const BRANCHES = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil", "Electrical", "Other"];
// const YEARS = [1, 2, 3, 4, 5];
// const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
// const SECTIONS = ["A", "B", "C", "D", "E"];

// const steps = ["Account", "Personal", "Academic"];

// // ─── Component ────────────────────────────────────────────────────────────────

// export default function RegisterPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   const [activeStep, setActiveStep] = useState(0);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     // Step 0 — Account
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     // Step 1 — Personal
//     phone: "",
//     dob: "",
//     address: "",
//     // Step 2 — Academic
//     scholarNumber: "",
//     enrollmentNumber: "",
//     course: "",
//     branch: "",
//     year: "",
//     semester: "",
//     section: "",
//   });

//   if (user) {
//     return <Navigate to={user.isAdmin ? "/admin/dashboard" : "/member/dashboard"} replace />;
//   }

//   const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

//   // ── Validation per step ──
//   const validateStep = () => {
//     if (activeStep === 0) {
//       if (!form.name.trim()) { toast.error("Name is required"); return false; }
//       if (!form.email.trim()) { toast.error("Email is required"); return false; }
//       if (!/\S+@\S+\.\S+/.test(form.email)) { toast.error("Enter a valid email"); return false; }
//       if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return false; }
//       if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return false; }
//     }
//     if (activeStep === 1) {
//       if (form.phone && !/^\d{10}$/.test(form.phone)) { toast.error("Enter a valid 10-digit phone number"); return false; }
//     }
//     return true;
//   };

//   const handleNext = () => {
//     if (validateStep()) setActiveStep((s) => s + 1);
//   };

//   const handleBack = () => setActiveStep((s) => s - 1);

//   const handleSubmit = async () => {
//     if (!validateStep()) return;
//     setLoading(true);
//     try {
//       const payload = {
//         name: form.name,
//         email: form.email,
//         password: form.password,
//         ...(form.phone && { phone: form.phone }),
//         ...(form.dob && { dob: form.dob }),
//         ...(form.address && { address: form.address }),
//         ...(form.scholarNumber && { scholarNumber: form.scholarNumber }),
//         ...(form.enrollmentNumber && { enrollmentNumber: form.enrollmentNumber }),
//         ...(form.course && { course: form.course }),
//         ...(form.branch && { branch: form.branch }),
//         ...(form.year && { year: Number(form.year) }),
//         ...(form.semester && { semester: Number(form.semester) }),
//         ...(form.section && { section: form.section }),
//       };

//       const response = await authApi.register(payload);

//       if (response.status === 201) {
//         toast.success("Account created! Please sign in.");
//         navigate("/login");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Step content ──
//   const renderStep = () => {
//     const fieldSx = { mb: 2 };
//     const rowSx = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 };

//     if (activeStep === 0) return (
//       <>
//         <TextField label="Full name" fullWidth size="small" value={form.name} onChange={set("name")} sx={fieldSx} />
//         <TextField label="Email address" type="email" fullWidth size="small" value={form.email} onChange={set("email")} sx={fieldSx} />
//         <TextField
//           label="Password" size="small" fullWidth
//           type={showPassword ? "text" : "password"}
//           value={form.password} onChange={set("password")} sx={fieldSx}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton size="small" onClick={() => setShowPassword((v) => !v)} edge="end">
//                   {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
//                 </IconButton>
//               </InputAdornment>
//             )
//           }}
//         />
//         <TextField
//           label="Confirm password" size="small" fullWidth
//           type={showConfirm ? "text" : "password"}
//           value={form.confirmPassword} onChange={set("confirmPassword")} sx={fieldSx}
//           InputProps={{
//             endAdornment: (
//               <InputAdornment position="end">
//                 <IconButton size="small" onClick={() => setShowConfirm((v) => !v)} edge="end">
//                   {showConfirm ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
//                 </IconButton>
//               </InputAdornment>
//             )
//           }}
//         />
//       </>
//     );

//     if (activeStep === 1) return (
//       <>
//         <TextField label="Phone number" fullWidth size="small" value={form.phone} onChange={set("phone")} sx={fieldSx}
//           inputProps={{ maxLength: 10 }} placeholder="10-digit number" />
//         <TextField label="Date of birth" type="date" fullWidth size="small" value={form.dob} onChange={set("dob")}
//           InputLabelProps={{ shrink: true }} sx={fieldSx} />
//         <TextField label="Address" fullWidth size="small" multiline rows={3}
//           value={form.address} onChange={set("address")} sx={fieldSx} />
//       </>
//     );

//     if (activeStep === 2) return (
//       <>
//         <Box sx={rowSx}>
//           <TextField label="Scholar number" size="small" value={form.scholarNumber} onChange={set("scholarNumber")} />
//           <TextField label="Enrollment number" size="small" value={form.enrollmentNumber} onChange={set("enrollmentNumber")} />
//         </Box>
//         <Box sx={rowSx}>
//           <TextField select label="Course" size="small" value={form.course} onChange={set("course")}>
//             {COURSES.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
//           </TextField>
//           <TextField select label="Branch" size="small" value={form.branch} onChange={set("branch")}>
//             {BRANCHES.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
//           </TextField>
//         </Box>
//         <Box sx={rowSx}>
//           <TextField select label="Year" size="small" value={form.year} onChange={set("year")}>
//             {YEARS.map((y) => <MenuItem key={y} value={y}>Year {y}</MenuItem>)}
//           </TextField>
//           <TextField select label="Semester" size="small" value={form.semester} onChange={set("semester")}>
//             {SEMESTERS.map((s) => <MenuItem key={s} value={s}>Semester {s}</MenuItem>)}
//           </TextField>
//         </Box>
//         <TextField select label="Section" size="small" value={form.section} onChange={set("section")} sx={{ mb: 2, width: "calc(50% - 8px)" }}>
//           {SECTIONS.map((s) => <MenuItem key={s} value={s}>Section {s}</MenuItem>)}
//         </TextField>
//       </>
//     );

//     return null;
//   };

//   return (
//     <>
//       <Helmet><title>Register | StudyAdda</title></Helmet>

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
//               Get started
//             </Typography>
//             <Typography variant="h5" sx={{ fontWeight: 500, color: "#1a1a2e", mb: 0.5 }}>
//               Create your account
//             </Typography>
//             <Typography sx={{ fontSize: 14, color: "#888", mb: 2.5 }}>
//               Step {activeStep + 1} of {steps.length} — {steps[activeStep]}
//             </Typography>

//             {/* Stepper */}
//             <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
//               {steps.map((label) => (
//                 <Step key={label}>
//                   <StepLabel
//                     sx={{
//                       "& .MuiStepLabel-label": { fontSize: 13 },
//                       "& .MuiStepIcon-root.Mui-active": { color: "#6366f1" },
//                       "& .MuiStepIcon-root.Mui-completed": { color: "#6366f1" },
//                     }}
//                   >
//                     {label}
//                   </StepLabel>
//                 </Step>
//               ))}
//             </Stepper>

//             {/* Step fields */}
//             {renderStep()}

//             {/* Navigation */}
//             <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
//               {activeStep > 0 && (
//                 <OutlineButton fullWidth onClick={handleBack}>
//                   Back
//                 </OutlineButton>
//               )}
//               {activeStep < steps.length - 1 ? (
//                 <PrimaryButton fullWidth onClick={handleNext}>
//                   Continue
//                 </PrimaryButton>
//               ) : (
//                 <PrimaryButton fullWidth onClick={handleSubmit} disabled={loading}>
//                   {loading ? "Creating account..." : "Create account"}
//                 </PrimaryButton>
//               )}
//             </Box>

//             <Typography sx={{ textAlign: "center", fontSize: 13, color: "#888", mt: 2 }}>
//               Already have an account?{" "}
//               <Link href="/login" underline="hover" sx={{ color: "#6366f1", fontWeight: 500 }}>
//                 Sign in
//               </Link>
//             </Typography>
//           </RightPanel>
//         </Card>
//       </PageWrapper>
//     </>
//   );
// }



import { Helmet } from "react-helmet-async";
import { useState } from "react";
import toast from "react-hot-toast";
import { Box, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { Navigate, useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authApi } from "../../services/api";

// ─── Constants ────────────────────────────────────────────────
const COURSES = ["B.Tech", "M.Tech", "BCA", "MCA", "B.Sc", "M.Sc", "MBA", "Other"];
const BRANCHES = ["Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil", "Electrical", "Other"];
const YEARS = [1, 2, 3, 4, 5];
const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];
const SECTIONS = ["A", "B", "C", "D", "E"];
const STEPS = ["Account", "Personal", "Academic"];

// ─── Particles (reused from LoginPage) ───────────────────────
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

const SpeedLines = () => (
  <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
    {[12, 28, 45, 60, 74, 88].map((top, i) => (
      <div key={i} style={{
        position: "absolute", top: `${top}%`, left: "-100%",
        height: i % 2 === 0 ? "1px" : "0.5px",
        width: `${28 + i * 7}%`,
        background: `linear-gradient(90deg,transparent,rgba(20,184,166,${0.07 + i * 0.01}),transparent)`,
        animation: `sa-speed-line ${2.5 + i * 0.3}s ${i * 0.5}s linear infinite`,
      }} />
    ))}
  </div>
);

// ─── Component ────────────────────────────────────────────────
export default function RegisterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phone: "", dob: "", address: "",
    scholarNumber: "", enrollmentNumber: "",
    course: "", branch: "", year: "", semester: "", section: "",
  });

  if (user) {
    return <Navigate to={user.isAdmin ? "/admin/dashboard" : "/member/dashboard"} replace />;
  }

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validateStep = () => {
    if (activeStep === 0) {
      if (!form.name.trim()) { toast.error("Name is required"); return false; }
      if (!form.email.trim()) { toast.error("Email is required"); return false; }
      if (!/\S+@\S+\.\S+/.test(form.email)) { toast.error("Enter a valid email"); return false; }
      if (form.password.length < 6) { toast.error("Password must be at least 6 chars"); return false; }
      if (form.password !== form.confirmPassword) { toast.error("Passwords do not match"); return false; }
    }
    if (activeStep === 1) {
      if (form.phone && !/^\d{10}$/.test(form.phone)) { toast.error("Enter a valid 10-digit phone"); return false; }
    }
    return true;
  };

  const handleNext = () => { if (validateStep()) setActiveStep((s) => s + 1); };
  const handleBack = () => setActiveStep((s) => s - 1);

  const handleSubmit = async () => {
    if (!validateStep()) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name, email: form.email, password: form.password,
        ...(form.phone && { phone: form.phone }),
        ...(form.dob && { dob: form.dob }),
        ...(form.address && { address: form.address }),
        ...(form.scholarNumber && { scholarNumber: form.scholarNumber }),
        ...(form.enrollmentNumber && { enrollmentNumber: form.enrollmentNumber }),
        ...(form.course && { course: form.course }),
        ...(form.branch && { branch: form.branch }),
        ...(form.year && { year: Number(form.year) }),
        ...(form.semester && { semester: Number(form.semester) }),
        ...(form.section && { section: form.section }),
      };
      const response = await authApi.register(payload);
      if (response.status === 201) {
        toast.success("Account created! Please sign in.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // ── Step field renderers ──
  const renderStep = () => {
    if (activeStep === 0) return (
      <>
        <div className="sa-field-group">
          <label className="sa-field-label">Full Name</label>
          <div className="sa-field-wrapper">
            <input className="sa-field-input" placeholder="John Doe"
              value={form.name} onChange={set("name")} />
            <span className="sa-field-icon-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </span>
          </div>
        </div>

        <div className="sa-field-group">
          <label className="sa-field-label">Email Address</label>
          <div className="sa-field-wrapper">
            <input type="email" className="sa-field-input" placeholder="you@example.com"
              value={form.email} onChange={set("email")} />
            <span className="sa-field-icon-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
          </div>
        </div>

        <div className="sa-field-row">
          <div className="sa-field-group" style={{ flex: 1 }}>
            <label className="sa-field-label">Password</label>
            <div className="sa-field-wrapper">
              <input type={showPassword ? "text" : "password"} className="sa-field-input"
                placeholder="Min. 6 characters" value={form.password} onChange={set("password")} />
              <span className="sa-field-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <button type="button" className="sa-field-icon-right" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                {showPassword
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                }
              </button>
            </div>
          </div>

          <div className="sa-field-group" style={{ flex: 1 }}>
            <label className="sa-field-label">Confirm Password</label>
            <div className="sa-field-wrapper">
              <input type={showConfirm ? "text" : "password"} className="sa-field-input"
                placeholder="Re-enter password" value={form.confirmPassword} onChange={set("confirmPassword")} />
              <span className="sa-field-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <button type="button" className="sa-field-icon-right" onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                {showConfirm
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                }
              </button>
            </div>
          </div>
        </div>
      </>
    );

    if (activeStep === 1) return (
      <>
        <div className="sa-field-group">
          <label className="sa-field-label">Phone Number</label>
          <div className="sa-field-wrapper">
            <input className="sa-field-input" placeholder="10-digit number"
              maxLength={10} value={form.phone} onChange={set("phone")} />
            <span className="sa-field-icon-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8 8.09a16 16 0 0 0 6 6l.82-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
          </div>
        </div>

        <div className="sa-field-group">
          <label className="sa-field-label">Date of Birth</label>
          <div className="sa-field-wrapper">
            <input type="date" className="sa-field-input" style={{ paddingLeft: "44px", colorScheme: "light" }}
              value={form.dob} onChange={set("dob")} />
            <span className="sa-field-icon-left">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
          </div>
        </div>

        <div className="sa-field-group">
          <label className="sa-field-label">Address</label>
          <div className="sa-field-wrapper">
            <textarea className="sa-field-input sa-textarea"
              placeholder="Your full address..." rows={3}
              value={form.address} onChange={set("address")} />
            <span className="sa-field-icon-left" style={{ top: "16px", transform: "none" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
            </span>
          </div>
        </div>
      </>
    );

    if (activeStep === 2) return (
      <>
        <div className="sa-field-row">
          <div className="sa-field-group" style={{ flex: 1 }}>
            <label className="sa-field-label">Scholar Number</label>
            <div className="sa-field-wrapper">
              <input className="sa-field-input" placeholder="SCH/2024/001"
                value={form.scholarNumber} onChange={set("scholarNumber")} />
              <span className="sa-field-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" />
                </svg>
              </span>
            </div>
          </div>
          <div className="sa-field-group" style={{ flex: 1 }}>
            <label className="sa-field-label">Enrollment Number</label>
            <div className="sa-field-wrapper">
              <input className="sa-field-input" placeholder="EN/2024/001"
                value={form.enrollmentNumber} onChange={set("enrollmentNumber")} />
              <span className="sa-field-icon-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <div className="sa-field-row">
          <div className="sa-field-group" style={{ flex: 1 }}>
            <label className="sa-field-label">Course</label>
            <div className="sa-field-wrapper">
              <select className="sa-field-input sa-select" value={form.course} onChange={set("course")}>
                <option value="">Select course</option>
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="sa-field-group" style={{ flex: 1 }}>
            <label className="sa-field-label">Branch</label>
            <div className="sa-field-wrapper">
              <select className="sa-field-input sa-select" value={form.branch} onChange={set("branch")}>
                <option value="">Select branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="sa-field-row">
          <div className="sa-field-group" style={{ flex: 1 }}>
            <label className="sa-field-label">Year</label>
            <div className="sa-field-wrapper">
              <select className="sa-field-input sa-select" value={form.year} onChange={set("year")}>
                <option value="">Year</option>
                {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
          </div>
          <div className="sa-field-group" style={{ flex: 1 }}>
            <label className="sa-field-label">Semester</label>
            <div className="sa-field-wrapper">
              <select className="sa-field-input sa-select" value={form.semester} onChange={set("semester")}>
                <option value="">Semester</option>
                {SEMESTERS.map(s => <option key={s} value={s}>Sem {s}</option>)}
              </select>
            </div>
          </div>
          <div className="sa-field-group" style={{ flex: 1 }}>
            <label className="sa-field-label">Section</label>
            <div className="sa-field-wrapper">
              <select className="sa-field-input sa-select" value={form.section} onChange={set("section")}>
                <option value="">Section</option>
                {SECTIONS.map(s => <option key={s} value={s}>Section {s}</option>)}
              </select>
            </div>
          </div>
        </div>
      </>
    );
    return null;
  };

  return (
    <>
      <Helmet><title>Register | StudyAdda</title></Helmet>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Rajdhani:wght@500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes sa-pulse-dot {
          from { opacity: 0.15; transform: scale(1); }
          to   { opacity: 0.75; transform: scale(1.7); }
        }
        @keyframes sa-speed-line {
          from { left: -100%; } to { left: 200%; }
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
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes sa-float-orb {
          0%,100% { transform: translateY(0) scale(1); }
          50%      { transform: translateY(-20px) scale(1.05); }
        }

        .sa-reg-root {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: #080D14;
        }

        /* ── Left Panel ── */
        .sa-left-panel {
          background: linear-gradient(145deg, #060D18 0%, #091820 45%, #071510 100%);
          display: flex; flex-direction: column;
          justify-content: center; align-items: center;
          padding: 60px 48px;
          position: relative; overflow: hidden;
        }
        .sa-left-panel::after {
          content: ''; position: absolute;
          right: 0; top: 0; bottom: 0; width: 1px;
          background: linear-gradient(180deg, transparent, rgba(20,184,166,0.35), rgba(20,184,166,0.15), transparent);
        }
        .sa-orb { position: absolute; border-radius: 50%; pointer-events: none; }
        .sa-orb-1 {
          width: 320px; height: 320px; top: -100px; left: -100px;
          background: radial-gradient(circle, rgba(20,184,166,0.14) 0%, transparent 70%);
          animation: sa-float-orb 7s ease-in-out infinite;
        }
        .sa-orb-2 {
          width: 220px; height: 220px; bottom: -70px; right: -70px;
          background: radial-gradient(circle, rgba(20,184,166,0.09) 0%, transparent 70%);
          animation: sa-float-orb 9s ease-in-out infinite 2s;
        }
        .sa-mesh {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(20,184,166,0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(20,184,166,0.035) 1px, transparent 1px);
          background-size: 42px 42px; pointer-events: none;
        }
        .sa-brand-reveal {
          opacity: 0;
          animation: sa-reveal-left 0.8s 0.3s cubic-bezier(.22,1,.36,1) forwards;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          position: relative; z-index: 1; width: 100%;
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
          color: #F1F5F9; letter-spacing: 2px;
          text-transform: uppercase; line-height: 1;
        }
        .sa-brand-tagline {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px; letter-spacing: 4px;
          text-transform: uppercase;
          color: rgba(20,184,166,0.7); margin-top: 8px;
        }
        .sa-brand-desc {
          font-size: 13px; color: rgba(255,255,255,0.35);
          margin-top: 12px; line-height: 1.7; max-width: 260px;
        }
        .sa-feature-list {
          margin-top: 36px; width: 100%; max-width: 280px;
          position: relative; z-index: 1;
          opacity: 0;
          animation: sa-reveal-up 0.8s 0.6s cubic-bezier(.22,1,.36,1) forwards;
        }
        .sa-feature-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.5); font-size: 13px;
        }
        .sa-feature-item:last-child { border-bottom: none; }
        .sa-feature-icon {
          width: 28px; height: 28px;
          background: rgba(20,184,166,0.08);
          border: 1px solid rgba(20,184,166,0.2);
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .sa-bottom-tag {
          margin-top: 40px; font-size: 10.5px;
          color: rgba(20,184,166,0.5);
          background: rgba(20,184,166,0.07);
          border: 1px solid rgba(20,184,166,0.12);
          border-radius: 20px; padding: 5px 14px;
          letter-spacing: 0.08em; font-weight: 600;
          position: relative; z-index: 1;
          opacity: 0;
          animation: sa-reveal-up 0.7s 0.9s cubic-bezier(.22,1,.36,1) forwards;
        }

        /* ── Right Panel ── */
        .sa-right-panel {
          background: #ffffff;
          display: flex; flex-direction: column;
          justify-content: center;
          padding: 40px 52px;
          position: relative; overflow: hidden;
          overflow-y: auto;
        }
        .sa-right-panel::before {
          content: ''; position: absolute;
          top: -120px; right: -120px;
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(20,184,166,0.04) 0%, transparent 70%);
          border-radius: 50%; pointer-events: none;
        }
        .sa-form-reveal {
          opacity: 0;
          animation: sa-reveal-right 0.85s 0.2s cubic-bezier(.22,1,.36,1) forwards;
        }
        .sa-mobile-logo {
          display: none; justify-content: center; margin-bottom: 24px;
        }
        .sa-form-greeting {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px; letter-spacing: 3.5px;
          text-transform: uppercase; color: #0D9488;
          margin-bottom: 6px;
          display: flex; align-items: center; gap: 8px;
        }
        .sa-form-greeting::before {
          content: ''; display: inline-block;
          width: 20px; height: 2px;
          background: #14B8A6; border-radius: 2px;
        }
        .sa-form-title {
          font-family: 'Rajdhani', sans-serif;
          font-size: 38px; font-weight: 700; color: #0F172A;
          line-height: 1.05; margin-bottom: 4px; letter-spacing: -0.5px;
        }
        .sa-form-subtitle {
          font-size: 13.5px; color: #94A3B8; margin-bottom: 10px;
        }
        .sa-divider-line {
          width: 44px; height: 3px;
          background: linear-gradient(90deg, #0F766E, #14B8A6);
          border-radius: 2px; margin-bottom: 24px;
        }

        /* ── Custom Stepper ── */
        .sa-stepper {
          display: flex; align-items: center;
          margin-bottom: 28px; gap: 0;
        }
        .sa-step {
          display: flex; align-items: center; gap: 10px; flex: 1;
          position: relative;
        }
        .sa-step:not(:last-child)::after {
          content: ''; flex: 1; height: 1.5px;
          background: #E2E8F0; margin: 0 8px;
          transition: background 0.3s;
        }
        .sa-step.completed:not(:last-child)::after { background: #14B8A6; }
        .sa-step-circle {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px; font-weight: 700;
          flex-shrink: 0; transition: all 0.3s;
          border: 2px solid #E2E8F0; color: #94A3B8; background: #fff;
        }
        .sa-step.active .sa-step-circle {
          background: linear-gradient(135deg, #0F766E, #14B8A6);
          border-color: transparent; color: #fff;
          box-shadow: 0 0 16px rgba(20,184,166,0.35);
        }
        .sa-step.completed .sa-step-circle {
          background: #14B8A6; border-color: transparent; color: #fff;
        }
        .sa-step-label {
          font-size: 11px; font-weight: 600; color: #CBD5E1;
          text-transform: uppercase; letter-spacing: 0.8px;
          white-space: nowrap;
        }
        .sa-step.active .sa-step-label { color: #0F766E; }
        .sa-step.completed .sa-step-label { color: #14B8A6; }
        .sa-step-connector {
          flex: 1; height: 1.5px; background: #E2E8F0; margin: 0 6px;
          transition: background 0.3s;
        }
        .sa-step-connector.done { background: #14B8A6; }

        /* Step progress */
        .sa-step-progress {
          font-size: 12px; color: #94A3B8; margin-bottom: 20px;
          display: flex; align-items: center; gap: 8px;
        }
        .sa-step-progress-bar {
          flex: 1; height: 3px; background: #E2E8F0;
          border-radius: 2px; overflow: hidden;
        }
        .sa-step-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0F766E, #14B8A6);
          border-radius: 2px; transition: width 0.4s ease;
        }

        /* Fields */
        .sa-field-group { margin-bottom: 16px; }
        .sa-field-row {
          display: flex; gap: 14px; margin-bottom: 0;
        }
        .sa-field-label {
          display: block; font-size: 10.5px; font-weight: 700;
          letter-spacing: 1.5px; text-transform: uppercase;
          color: #64748B; margin-bottom: 7px;
        }
        .sa-field-wrapper { position: relative; }
        .sa-field-input {
          width: 100%; height: 44px;
          padding: 0 14px 0 44px;
          border: 1.5px solid #E2E8F0; border-radius: 10px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13.5px; color: #0F172A;
          background: #F8FAFC; transition: all 0.2s ease; outline: none;
          appearance: none;
        }
        .sa-field-input:hover { border-color: #CBD5E1; }
        .sa-field-input:focus {
          border-color: #14B8A6; background: #fff;
          box-shadow: 0 0 0 3px rgba(20,184,166,0.1);
        }
        .sa-textarea {
          height: auto !important; padding: 12px 14px 12px 44px;
          resize: none; line-height: 1.6;
        }
        .sa-select { cursor: pointer; padding-right: 32px; }
        .sa-select-arrow {
          position: absolute; right: 12px; top: 50%;
          transform: translateY(-50%); pointer-events: none; color: #94A3B8;
        }
        .sa-field-icon-left {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: #CBD5E1; pointer-events: none; display: flex; transition: color 0.2s;
        }
        .sa-field-icon-right {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          color: #94A3B8; cursor: pointer; transition: color 0.2s;
          background: none; border: none; display: flex; align-items: center; padding: 0;
        }
        .sa-field-icon-right:hover { color: #0F172A; }

        /* Buttons */
        .sa-btn-row { display: flex; gap: 12px; margin-top: 8px; }
        .sa-submit-btn {
          flex: 1; height: 48px;
          background: linear-gradient(135deg, #0F766E 0%, #14B8A6 100%);
          color: #fff; border: none; border-radius: 10px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          cursor: pointer; position: relative; overflow: hidden;
          transition: all 0.25s ease;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(20,184,166,0.3);
        }
        .sa-submit-btn::before {
          content: ''; position: absolute; inset: 0;
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
        .sa-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .sa-back-btn {
          height: 48px; padding: 0 20px;
          background: transparent; color: #64748B;
          border: 1.5px solid #E2E8F0; border-radius: 10px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 14px; font-weight: 600;
          letter-spacing: 1px; text-transform: uppercase;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; gap: 6px;
        }
        .sa-back-btn:hover { border-color: #14B8A6; color: #14B8A6; background: rgba(20,184,166,0.04); }

        .sa-bottom-bar {
          position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
          background: linear-gradient(90deg, #0F766E, #14B8A6, #0EA5E9);
        }
        .sa-register-row { text-align: center; font-size: 13px; color: #94A3B8; margin-top: 16px; }
        .sa-register-link { color: #0F172A; font-weight: 700; text-decoration: none; transition: color 0.2s; }
        .sa-register-link:hover { color: #14B8A6; }

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

        @media (min-width: 900px) {
          .sa-reg-root { grid-template-columns: 5fr 7fr; }
          .sa-left-panel { display: flex; }
        }
        @media (max-width: 900px) {
          .sa-left-panel { display: none; }
          .sa-reg-root { grid-template-columns: 1fr; }
          .sa-mobile-logo { display: flex; }
          .sa-right-panel { padding: 32px 20px; justify-content: flex-start; }
          .sa-form-title { font-size: 30px; }
          .sa-field-row { flex-direction: column; gap: 0; }
        }
      `}</style>

      <div className="sa-reg-root">

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
              Join thousands of students. Access resources, book seats,
              and manage your library journey seamlessly.
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
            <p className="sa-form-greeting">Get Started</p>
            <h1 className="sa-form-title">Create Account</h1>
            <p className="sa-form-subtitle">Step {activeStep + 1} of {STEPS.length} — {STEPS[activeStep]}</p>
            <div className="sa-divider-line" />

            {/* Custom Stepper */}
            <div className="sa-stepper">
              {STEPS.map((label, i) => (
                <div key={label}>
                  <div className={`sa-step ${i < activeStep ? "completed" : ""} ${i === activeStep ? "active" : ""}`}>
                    <div className="sa-step-circle">
                      {i < activeStep ? (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8L6.5 11.5L13 5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : i + 1}
                    </div>
                    <span className="sa-step-label">{label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`sa-step-connector ${i < activeStep ? "done" : ""}`} />
                  )}
                </div >
              ))}
            </div>

            {/* Step fields */}
            {renderStep()}

            {/* Navigation buttons */}
            <div className="sa-btn-row">
              {activeStep > 0 && (
                <button className="sa-back-btn" onClick={handleBack}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                  Back
                </button>
              )}
              {activeStep < STEPS.length - 1 ? (
                <button className="sa-submit-btn" onClick={handleNext}>
                  Continue
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ) : (
                <button className="sa-submit-btn" onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "sa-spin .7s linear infinite" }} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                      Create Account
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Or divider */}
            <div className="sa-or-divider">
              <span className="line" />
              <span className="text">or</span>
              <span className="line" />
            </div>

            <p className="sa-register-row">
              Already have an account?{" "}
              <RouterLink to="/login" className="sa-register-link">Sign in →</RouterLink>
            </p>
          </div>

          <div className="sa-bottom-bar" />
        </div>
      </div>
    </>
  );
}