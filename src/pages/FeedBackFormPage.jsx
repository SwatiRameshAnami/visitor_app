import { useState } from "react";

export default function VisitorFeedbackForm({ visitorName, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = () => {
    const data = {
      rating,
      feedback,
      visitor: visitorName,
      date: new Date().toISOString(),
    };

    console.log(data);

    // Show popup only
    setShowPopup(true);
  };

  const handleClose = () => {
    if (onSubmit) onSubmit(); // go back to previous page
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center px-6">

      {/* Thank You Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

          <div
            className="bg-white rounded-2xl p-8 text-center"
            style={{
              width: "380px",
              boxShadow: "0 15px 50px rgba(0,0,0,0.2)"
            }}
          >

            <h2
              className="text-2xl font-semibold mb-3"
              style={{ color: "#FF6829" }}
            >
              Thank You!
            </h2>

            <p
              className="text-sm mb-6"
              style={{ color: "#3D6BC0" }}
            >
              Thank you for visiting us.  
              <br />
              We appreciate your feedback!
            </p>

            {/* Orange Button */}
            <button
              onClick={handleClose}
              className="px-8 py-3 rounded-xl font-semibold transition-all active:scale-95"
              style={{
                background: "linear-gradient(135deg,#e05520,#FF6829)",
                color: "#ffffff",
                boxShadow: "0 4px 20px rgba(255,104,41,0.3)"
              }}
            >
              Back
            </button>

          </div>
        </div>
      )}

      {/* Feedback Card */}
      <div
        className="w-full max-w-xl rounded-2xl p-8"
        style={{
          background: "#ffffff",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >

        <div className="text-center mb-6">
          <h2
            className="text-2xl font-semibold"
            style={{ color: "#FF6829" }}
          >
            Visitor Feedback
          </h2>

          <p
            className="text-sm mt-1"
            style={{ color: "#3D6BC0", opacity: 0.8 }}
          >
            We hope you had a great experience. Please rate your visit.
          </p>
        </div>

        {/* Rating */}
        <div className="flex flex-col items-center gap-3 mb-6">

          <p className="text-sm font-medium" style={{ color: "#3D6BC0" }}>
            Rate Your Experience
          </p>

          <div className="flex gap-3">
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="text-3xl transition-transform active:scale-90"
                style={{
                  color: star <= rating ? "#FF6829" : "#CBD5E1"
                }}
              >
                ★
              </button>
            ))}
          </div>

        </div>

        {/* Feedback */}
        <div className="flex flex-col gap-2 mb-6">

          <label
            className="text-sm font-medium"
            style={{ color: "#3D6BC0" }}
          >
            Additional Feedback
          </label>

          <textarea
            rows="4"
            placeholder="Tell us about your experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{
              padding: "12px 16px",
              borderRadius: "12px",
              border: "1.5px solid rgba(61,107,192,0.4)",
              outline: "none",
              resize: "none",
              fontSize: "14px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          />

        </div>

        {/* Submit */}
        <div className="flex justify-center">

          <button
            onClick={handleSubmit}
            className="px-10 py-3 rounded-xl font-semibold transition-all active:scale-95"
            style={{
              background: "linear-gradient(135deg,#e05520,#FF6829)",
              color: "#ffffff",
              boxShadow: "0 4px 20px rgba(255,104,41,0.3)"
            }}
          >
            Submit Feedback
          </button>

        </div>

      </div>

    </div>
  );
}