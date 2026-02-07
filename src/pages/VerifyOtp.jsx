import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../utils/api";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;
  const userId = state?.userId;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp });

      if (res.success) {
        // Now check payment status in backend (you can fetch user again if needed)
        if (res.data.paymentStatus === "PAID") {
          navigate("/success");
        } else if(res.data.paymentStatus === "FREE") {
          navigate("/free-success");
        } else {
          navigate("/payment");
        }
        
      } else {
        setMessage(res.message);
      }
    } catch (err) {
      setMessage("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email });
      setMessage("New OTP sent to your email.");
    } catch {
      setMessage("Failed to resend OTP.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-xl text-center">
        <h2 className="text-xl text-white mb-4">Verify Your Email</h2>
        <p className="text-gray-300 mb-4">OTP sent to: {email}</p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          className="input-field mb-4"
        />

        <button onClick={handleVerify} className="btn-primary w-full mb-2">
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button onClick={handleResend} className="text-romantic-500 mt-2">
          Resend OTP
        </button>

        {message && <p className="text-red-400 mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default VerifyOtp;
