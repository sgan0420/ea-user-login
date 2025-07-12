import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import OtpInput from "react-otp-input";
import { authApi, ApiError } from "../services/authApi";

type LocationState =
  | {
      flowType: "register";
      email: string;
      userId?: string;
    }
  | {
      flowType: "login";
      username: string;
      userId: string;
    };

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect to home if no state is present (direct access)
  useEffect(() => {
    if (!state) {
      navigate("/", { replace: true });
    }
  }, [state, navigate]);

  // Don't render anything if no state (while redirecting)
  if (!state) {
    return null;
  }

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (state.flowType === "register") {
        // Email verification flow
        await authApi.verifyEmail({
          email: state.email,
          otpCode: otp,
        });

        alert("✅ Email verified! You are now logged in.");
        navigate("/home"); // Navigate to home or dashboard
      } else {
        // Login OTP verification flow
        await authApi.completeLogin({
          userId: state.userId,
          otpCode: otp,
        });

        alert("✅ Login successful!");
        navigate("/home"); // Navigate to home or dashboard
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");

    try {
      if (state.flowType === "register") {
        await authApi.resendVerificationOtp({ email: state.email });
        alert("Verification code resent to your email.");
      } else {
        // For login, we need the email. You might want to pass this in state
        // For now, we'll show an error
        setError("Unable to resend login OTP. Please try logging in again.");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("Failed to resend OTP. Please try again.");
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, width: "100%" }}>
      <h2>
        {state.flowType === "register"
          ? "Verify Your Email"
          : "Enter Login Code"}
      </h2>

      <p>
        {state.flowType === "register"
          ? `We've sent a verification code to ${state.email}`
          : "We've sent a login code to your email"}
      </p>

      <div
        style={{
          display: "flex",
          marginBottom: "1rem",
          justifyContent: "center",
        }}
      >
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={6}
          renderInput={(props) => <input {...props} />}
          inputStyle={{
            width: "40px",
            height: "40px",
            margin: "0 5px",
            fontSize: "18px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            textAlign: "center",
          }}
        />
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      <button
        onClick={handleVerify}
        disabled={otp.length !== 6 || isLoading}
        style={{ width: "100%", marginBottom: "1rem" }}
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </button>

      <button
        onClick={handleResendOtp}
        style={{
          background: "transparent",
          border: "none",
          color: "#007bff",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        Resend Code
      </button>
    </div>
  );
}
