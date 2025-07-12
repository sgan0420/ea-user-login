import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { authApi, ApiError } from "../services/authApi";

const schema = yup.object({
  username: yup
    .string()
    .required("Username is required.")
    .min(4, "Username must be between 4 and 16 characters.")
    .max(16, "Username must be between 4 and 16 characters."),
  password: yup.string().required("Password is required."),
});

type LoginFormData = yup.InferType<typeof schema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    mode: "onTouched",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.login({
        identifier: data.username,
        password: data.password,
      });

      // Navigate to OTP verification with appropriate state
      if (response.requiresVerification) {
        // User needs email verification first
        navigate("/verify-otp", {
          state: {
            flowType: "register", // Use register flow for email verification
            email: data.username, // Assuming username could be email
            userId: response.userId,
          },
        });
      } else {
        // Normal login OTP flow
        navigate("/verify-otp", {
          state: {
            flowType: "login",
            userId: response.userId,
            username: data.username,
          },
        });
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ maxWidth: 400, width: "100%" }}
    >
      <h2>Login</h2>

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
            className={errors.password ? "input-error" : ""}
          />
          <button
            type="button"
            className="button-inline"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        {errors.password && (
          <p className="form-error">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
      )}

      <button type="submit" disabled={!isValid || isLoading}>
        {isLoading ? "Logging in..." : "Next - Verify Code"}
      </button>
    </form>
  );
}
