import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { authApi, ApiError } from "../services/authApi";

const schema = yup.object({
  identifier: yup
    .string()
    .required("Username or email is required.")
    .min(4, "Please enter a valid username or email."),
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
        identifier: data.identifier,
        password: data.password,
      });

      // Navigate to OTP verification with appropriate state
      if (response.requiresVerification) {
        // User needs email verification first
        // Backend should now include user.email in response
        if (!response.user?.email) {
          setError("Unable to get user email for verification. Please try again.");
          return;
        }
        
        navigate("/verify-otp", {
          state: {
            flowType: "register", // Use register flow for email verification
            email: response.user.email, // Use actual email from backend response
            userId: response.userId,
          },
        });
      } else {
        // Normal login OTP flow
        navigate("/verify-otp", {
          state: {
            flowType: "login",
            userId: response.userId,
            identifier: data.identifier,
            email: response.user?.email,
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
        <label>EA Username or Email</label>
        <input
          type="text"
          {...register("identifier")}
          className={errors.identifier ? "input-error" : ""}
        />
        {errors.identifier && (
          <p className="form-error">{errors.identifier.message}</p>
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

      <p style={{ textAlign: "center", marginTop: "2rem" }}>
        No account?
        <>
          {" "}
          <br />
        </>
        <button
          type="button"
          onClick={() => navigate("/register")}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
            fontSize: "inherit",
          }}
        >
          Create an account here
        </button>
      </p>
    </form>
  );
}
