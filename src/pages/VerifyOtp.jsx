import { useState, useEffect } from "react";
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

  const [timer, setTimer] = useState(30); // 30-second cooldown
  const [canResend, setCanResend] = useState(false);

  // Start countdown when page loads
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp });

      if (res.success) {
        if (res.data.paymentStatus === "PAID") {
          navigate("/success");
        } else if (res.data.paymentStatus === "FREE") {
          navigate("/free-success");
        } else {
          navigate("/payment");
        }
      } else {
        setMessage(res.message);
      }
    } catch {
      setMessage("Verification failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp({ email });
      setMessage("New OTP sent to your email.");
      setTimer(30);      // restart timer
      setCanResend(false);
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

        {canResend ? (
          <button
            onClick={handleResend}
            className="text-romantic-500 mt-2 underline"
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-gray-400 mt-2">
            Resend available in {timer}s
          </p>
        )}

        {message && <p className="text-red-400 mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default VerifyOtp;
