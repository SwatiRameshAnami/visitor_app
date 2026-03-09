import { useState, useRef, useCallback, useEffect } from "react";
import CameraCapture from "../components/CameraCapture";
import SuccessPopup from "../components/SuccessPopup";
import BackButton from "../components/BackButton";
import { checkInVisitor } from "../services/apiServices";
import axios from "axios";

const EMPLOYEES = [
  { id: 1, name: "Rajendra", dept: "Development", email: "rajendra18raj@gmail.com", phone: "808852627", avatar: "👨‍💼", isHost: true },
  { id: 2, name: "Kavyashree", dept: "Development", email: "srieekavya992@gmail.com", phone: "9100698162", avatar: "👩‍💼", isHost: true },
  { id: 3, name: "Swati", dept: "Development", email: "swatianami487@gmail.com", phone: "9110278500", avatar: "👩‍💼", isHost: true },
  { id: 4, name: "Thejas", dept: "Development", email: "thejasr2003@gmail.com", phone: "8618200459", avatar: "👨‍💼", isHost: true },
  { id: 5, name: "raaghu", dept: "testing", email: "raaghu2002@gmail.com", phone: "8618200456", avatar: "👨‍💼", isHost: true },
];

const PURPOSE_MAP = {
  nammaqa: ["Training Session", "Course Inquiry", "Enrollment", "Assessment", "Certificate Collection", "Workshop Participation", "Trainer Meeting", "Other"],
  wizzybox: ["Client Meeting", "Project Discussion", "HR Discussion", "IT Support", "Delivery", "Product Demo", "Partnership Discussion", "Other"],
  default: ["Business Meeting", "Interview", "Vendor Discussion", "Delivery", "Support / Maintenance", "Personal Visit", "Other"],
};

const initialForm = {
  visitorName: "",
  phone: "",
  email: "",
  company: "",
  purpose: "",
  whomToMeet: "",
  photo: null,
};

export default function VisitorFormPage({ onSubmit, onBack }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [showCamera, setShowCamera] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const [step, setStep] = useState(1);
  const [availablePurposes, setAvailablePurposes] = useState(PURPOSE_MAP.default);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key, value) => {
    let formattedValue = value;

    if (key === "company") {
      const companyKey = value.toLowerCase().trim();
      if (companyKey.includes("wizzybox")) {
        formattedValue = "WizzyBox";
        setAvailablePurposes(PURPOSE_MAP.wizzybox);
      } else if (companyKey.includes("nammaqa")) {
        formattedValue = "NammaQa";
        setAvailablePurposes(PURPOSE_MAP.nammaqa);
      } else {
        setAvailablePurposes(PURPOSE_MAP.default);
      }
    }

    setForm((p) => ({ ...p, [key]: formattedValue }));
    setErrors((p) => ({ ...p, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.visitorName.trim()) e.visitorName = "Name is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) e.phone = "Valid 10-digit number required";
    if (!form.purpose) e.purpose = "Select a purpose";
    if (!form.whomToMeet) e.whomToMeet = "Select person to meet";
    if (!form.photo) e.photo = "Please capture your photo";
    return e;
  };

  const uploadToCloudinary = async (base64Data) => {
    const formData = new FormData();
    formData.append("file", base64Data);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData
    );
    return response.data.secure_url;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      if (["visitorName", "phone", "purpose", "whomToMeet"].some(f => e[f])) setStep(1);
      return;
    }
    setIsSubmitting(true);
    try {
      const cloudinaryUrl = await uploadToCloudinary(form.photo);
      console.log(cloudinaryUrl)

      const employee = EMPLOYEES.find(emp => emp.id === parseInt(form.whomToMeet));
      const payload = {
        visitorName: form.visitorName,
        phone: form.phone,
        email: form.email,
        company: form.company,
        purpose: form.purpose,
        whomToMeet: employee?.name,
        employeeDept: employee?.dept,
        employeeEmail: employee?.email,
        imageURL: cloudinaryUrl
      };

      console.log("Submitting Payload with Cloudinary URL:", payload);
      await checkInVisitor(payload);
      setSubmittedData(payload);
      setShowSuccess(true);
    } catch (err) {
      console.error("Submission Error:", err);
      alert("Failed to process check-in. Please ensure the camera image is captured and backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onSubmit(submittedData);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden">
      <BackButton onClick={onBack} />
      <div className="blob w-72 h-72 bg-indigo-800" style={{ top: "-10%", right: "-5%", animationDelay: "0s" }} />
      <div className="blob w-56 h-56" style={{ bottom: "-5%", left: "0%", animationDelay: "2s", background: "#FF6829" }} />
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,104,41,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,104,41,0.5) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      <div className="relative z-20 flex items-center justify-between px-6 pt-5 pb-4">
        <div className="w-10" />
        <div className="text-center">
          <h1 className="font-display text-3xl font-bold" style={{ color: "#FF6829" }}>Visitor Check-In</h1>
          <p className="font-body text-xs mt-0.5" style={{ color: "#3D6BC0", opacity: 0.8 }}>Fill in your details to notify your host</p>
        </div>
        <div className="flex items-center gap-2">
          <StepDot active={step >= 1} label="1" done={step > 1} />
          <div className="w-8 h-px" style={{ background: step > 1 ? "#FF6829" : "rgba(255,255,255,0.15)" }} />
          <StepDot active={step >= 2} label="2" done={false} />
        </div>
      </div>
      {step === 1 && (
        <div className="relative z-10 flex-1 overflow-y-auto custom-scroll px-8 pb-6">
          <div className="max-w-3xl mx-auto grid grid-cols-2 gap-4">
            <FormField label="Visitor Name" required error={errors.visitorName}>
              <input type="text" placeholder="Enter your full name" value={form.visitorName} onChange={(e) => update("visitorName", e.target.value)} style={inputStyle(errors.visitorName)} />
            </FormField>
            <FormField label="Phone Number" required error={errors.phone}>
              <input type="tel" placeholder="10-digit mobile number" value={form.phone} maxLength={10} onChange={(e) => update("phone", e.target.value.replace(/\D/, ""))} style={inputStyle(errors.phone)} />
            </FormField>
            <FormField label="Email Address" error={errors.email}>
              <input type="email" placeholder="your@email.com (optional)" value={form.email} onChange={(e) => update("email", e.target.value)} style={inputStyle(errors.email)} />
            </FormField>
            <FormField label="Company / Organisation" error={errors.company}>
              <select value={form.company} onChange={(e) => update("company", e.target.value)} style={inputStyle(errors.company)}>
                <option value="">Select Company</option>
                <option value="WizzyBox">WizzyBox</option>
                <option value="NammaQa">NammaQa</option>
              </select>
            </FormField>
            <FormField label="Purpose of Visit" required error={errors.purpose}>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {availablePurposes.map((p) => (
                  <button key={p} onClick={() => update("purpose", p)} className="text-left px-3 py-2.5 rounded-xl font-body text-sm transition-all duration-200 active:scale-95" style={{ background: form.purpose === p ? "rgba(255,104,41,0.15)" : "rgba(255,255,255,0.92)", border: form.purpose === p ? "1.5px solid rgba(255,104,41,0.7)" : "1.5px solid rgba(61,107,192,0.4)", color: form.purpose === p ? "#FF6829" : "#3D6BC0", boxShadow: "0 1px 3px rgba(61,107,192,0.4)" }}>{p}</button>
                ))}
              </div>
            </FormField>
            <FormField label="Person to Meet" required error={errors.whomToMeet}>
              <div className="flex flex-col gap-2 mt-1">
                {EMPLOYEES.map((emp) => (
                  <button key={emp.id} onClick={() => update("whomToMeet", emp.id.toString())} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 active:scale-95" style={{ background: form.whomToMeet === emp.id.toString() ? "rgba(255,104,41,0.12)" : "rgba(255,255,255,0.92)", border: form.whomToMeet === emp.id.toString() ? "1.5px solid rgba(255,104,41,0.6)" : "1.5px solid rgba(61,107,192,0.4)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                    <span className="text-2xl">{emp.avatar}</span>
                    <div className="text-left">
                      <p className="font-body text-sm font-medium" style={{ color: form.whomToMeet === emp.id.toString() ? "#FF6829" : "#3D6BC0" }}>{emp.name}</p>
                      <p className="font-body text-xs" style={{ color: "#3D6BC0", opacity: 0.55 }}>{emp.dept}</p>
                    </div>
                    {form.whomToMeet === emp.id.toString() && (<svg className="ml-auto" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF6829" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>)}
                  </button>
                ))}
              </div>
            </FormField>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 gap-6">
          <div className="text-center">
            <p className="font-body text-sm tracking-widest uppercase mb-2" style={{ color: "#FF6829" }}>Step 2 of 2</p>
            <h2 className="font-display text-3xl font-semibold" style={{ color: "#FF6829" }}>Capture Your Photo</h2>
            <p className="font-body text-sm mt-1" style={{ color: "#3D6BC0", opacity: 0.7 }}>Your photo will be stored for security & identification purposes</p>
          </div>
          {form.photo ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img src={form.photo} alt="Captured" className="w-48 h-48 rounded-2xl object-cover" style={{ border: "2px solid rgba(255,104,41,0.5)", boxShadow: "0 0 30px rgba(255,104,41,0.2)" }} />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#22c55e" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg></div>
              </div>
              <button onClick={() => update("photo", null)} className="font-body text-sm underline" style={{ color: "#3D6BC0" }}>Retake photo</button>
            </div>
          ) : (
            <button onClick={() => setShowCamera(true)} className="flex flex-col items-center justify-center gap-4 w-56 h-56 rounded-2xl transition-all active:scale-95" style={{ background: "rgba(255,104,41,0.06)", border: "2px dashed rgba(255,104,41,0.45)" }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FF6829" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
              <span className="font-body text-sm" style={{ color: "#FF6829" }}>Tap to Open Camera</span>
            </button>
          )}
          {errors.photo && <p className="text-red-400 font-body text-sm">{errors.photo}</p>}
        </div>
      )}
      <div className="relative z-20 px-8 pb-6 flex items-center justify-between gap-4">
        {step === 2 && (
          <button onClick={() => setStep(1)} disabled={isSubmitting} className="px-8 py-3.5 rounded-xl font-body text-sm font-medium transition-all active:scale-95" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#3D6BC0" }}>← Previous</button>
        )}
        <div className="flex-1" />
        {step === 1 ? (
          <button onClick={() => { const e = {}; if (!form.visitorName.trim()) e.visitorName = "Name is required"; if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.trim())) e.phone = "Valid 10-digit number required"; if (!form.purpose) e.purpose = "Select a purpose"; if (!form.whomToMeet) e.whomToMeet = "Select person to meet"; if (Object.keys(e).length > 0) { setErrors(e); return; } setStep(2); }} className="px-10 py-3.5 rounded-xl font-body text-sm font-semibold transition-all active:scale-95" style={{ background: "linear-gradient(135deg, #e05520, #FF6829)", color: "#ffffff", boxShadow: "0 4px 20px rgba(255,104,41,0.3)" }}>Continue →</button>
        ) : (
          <button onClick={handleSubmit} disabled={isSubmitting} className="px-10 py-3.5 rounded-xl font-body text-sm font-semibold transition-all active:scale-95" style={{ background: isSubmitting ? "#9ca3af" : "linear-gradient(135deg, #e05520, #FF6829)", color: "#ffffff", boxShadow: isSubmitting ? "none" : "0 4px 20px rgba(255,104,41,0.3)", cursor: isSubmitting ? "not-allowed" : "pointer" }}>{isSubmitting ? "Finalizing..." : "Submit & Notify Host ✉️"}</button>
        )}
      </div>
      {showCamera && <CameraCapture onCapture={(photo) => { update("photo", photo); setShowCamera(false); }} onClose={() => setShowCamera(false)} />}
      {showSuccess && submittedData && <SuccessPopup visitorName={submittedData.visitorName} whomToMeet={submittedData.whomToMeet} onClose={handleSuccessClose} />}
    </div>
  );
}

function FormField({ label, required, error, children }) {
  return (<div className="flex flex-col gap-1.5"><label className="font-body text-sm font-medium" style={{ color: "#3D6BC0" }}>{label} {required && <span style={{ color: "#FF6829" }}>*</span>}</label>{children}{error && <p className="text-red-400 font-body text-xs mt-0.5">{error}</p>}</div>);
}

function StepDot({ active, label, done }) {
  return (<div className="w-8 h-8 rounded-full flex items-center justify-center font-body text-sm font-semibold transition-all" style={{ background: active ? "linear-gradient(135deg, #e05520, #FF6829)" : "rgba(255,255,255,0.06)", color: active ? "#ffffff" : "rgba(255,255,255,0.3)", border: active ? "none" : "1px solid rgba(255,255,255,0.1)" }}>{done ? "✓" : label}</div>);
}

function inputStyle(error) {
  return { width: "100%", padding: "12px 16px", borderRadius: "12px", fontSize: "14px", fontFamily: "inherit", color: "#1e293b", background: "#ffffff", border: error ? "1.5px solid rgba(239,68,68,0.6)" : "1.5px solid rgba(61,107,192,0.45)", outline: "none", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", transition: "border-color 0.2s, box-shadow 0.2s" };
}