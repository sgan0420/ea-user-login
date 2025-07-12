import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { authApi, ApiError } from "../services/authApi";

const schema = yup.object().shape({
  email: yup
    .string()
    .required("Email is required.")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email format."),
  username: yup
    .string()
    .required("Username is required.")
    .min(4, "Username must be between 4 and 16 characters.")
    .max(16, "Username must be between 4 and 16 characters."),
  password: yup
    .string()
    .required("Password is required.")
    .min(8, "Invalid password format.")
    .max(64, "Invalid password format.")
    .matches(/[a-z]/, "Invalid password format.")
    .matches(/[A-Z]/, "Invalid password format.")
    .matches(/\d/, "Invalid password format."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match.")
    .required("Confirm password is required."),
});

type FormData = yup.InferType<typeof schema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const password = watch("password") || "";

  const passwordChecks = {
    length: password.length >= 8 && password.length <= 64,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordChecklist, setShowPasswordChecklist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError("");

    try {
      await authApi.register({
        email: data.email,
        username: data.username,
        password: data.password,
      });

      // Navigate to OTP verification page with email
      navigate("/verify-otp", {
        state: {
          flowType: "register",
          email: data.email,
        },
      });
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ maxWidth: 400, width: "100%" }}
    >
      <h2>Create Your EA Account</h2>

      <div>
        <label>Email Address</label>
        <input
          type="email"
          {...register("email")}
          className={errors.email ? "input-error" : ""}
        />
        {errors.email && <p className="form-error">{errors.email.message}</p>}
      </div>

      <div>
        <label>EA Username</label>
        <input
          type="text"
          {...register("username")}
          className={errors.username ? "input-error" : ""}
        />
        {errors.username && (
          <p className="form-error">{errors.username.message}</p>
        )}
      </div>

      <div>
        <label>Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            onFocus={() => setShowPasswordChecklist(true)}
            className={errors.password ? "input-error" : ""}
          />
          <button
            type="button"
            className="button-inline"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {showPasswordChecklist && (
          <ul
            style={{
              borderRadius: "8px",
              padding: "0.5rem",
              fontSize: "0.85rem",
              marginTop: "0.4rem",
              marginBottom: "0.4rem",
              listStyle: "none",
              backgroundColor: "#f5f5f5",
              textAlign: "left",
            }}
          >
            Your password must contain the following:
            <li style={{ color: passwordChecks.length ? "green" : "red" }}>
              {passwordChecks.length ? "✅" : "❌"} 8-64 characters
            </li>
            <li style={{ color: passwordChecks.lowercase ? "green" : "red" }}>
              {passwordChecks.lowercase ? "✅" : "❌"} At least 1 lowercase
              letter
            </li>
            <li style={{ color: passwordChecks.uppercase ? "green" : "red" }}>
              {passwordChecks.uppercase ? "✅" : "❌"} At least 1 uppercase
              letter
            </li>
            <li style={{ color: passwordChecks.number ? "green" : "red" }}>
              {passwordChecks.number ? "✅" : "❌"} At least 1 number
            </li>
          </ul>
        )}
        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label>Confirm Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className={errors.confirmPassword ? "input-error" : ""}
          />
          <button
            type="button"
            className="button-inline"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="form-error">{errors.confirmPassword.message}</p>
        )}
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      <button type="submit" disabled={!isValid || isLoading}>
        {isLoading ? "Creating Account..." : "Create Account & Verify Email"}
      </button>

      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        Already have an account?
        <>
          {" "}
          <br />
        </>
        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "inherit",
          }}
        >
          Login here
        </button>
      </p>
    </form>
  );
}
