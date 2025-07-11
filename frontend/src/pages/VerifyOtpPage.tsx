import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import OtpInput from "react-otp-input";

type LocationState =
  | {
      flowType: "register";
      email: string;
    }
  | {
      flowType: "login";
      username: string;
    };

export default function VerifyOtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!/^\d{6}$/.test(otp)) {
      setError("OTP must be 6 digits.");
      return;
    }

    try {
      if (state.flowType === "register") {
        const payload = {
          email: state.email,
          otp,
        };
        console.log("Verifying registration OTP:", payload);

        // await api.post("/api/verify-register-otp", payload);
        alert("✅ Email verified! Account activated.");
      } else {
        const payload = {
          username: state.username,
          otp,
        };
        console.log("Verifying login OTP:", payload);

        // await api.post("/api/verify-login-otp", payload);
        alert("✅ Login successful!");
      }

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("❌ Invalid or expired code.");
    }
  };

  return (
    <div style={{ maxWidth: 400, width: "100%" }}>
      <h2>OTP Verification</h2>
      <p>
        {state.flowType === "register"
          ? `An OTP has been sent to ${state.email}`
          : `Enter the OTP sent to your email to complete login.`}
      </p>

      <OtpInput
        value={otp}
        onChange={setOtp}
        numInputs={6}
        shouldAutoFocus
        inputType="tel"
        renderInput={(props) => <input {...props} />}
        inputStyle={{
          width: "2.5rem",
          height: "2.5rem",
          fontSize: "1.1rem",
          borderRadius: "6px",
          border: "1px solid #ccc",
          margin: "0 0.3rem",
          textAlign: "center",
        }}
        containerStyle={{ justifyContent: "center", marginBottom: "1rem" }}
      />

      {error && <p className="form-error">{error}</p>}

      <button onClick={handleVerify} disabled={otp.length !== 6}>
        Verify Code
      </button>
    </div>
  );
}
