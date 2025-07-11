import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FiEye, FiEyeOff } from "react-icons/fi";
import OtpInput from "react-otp-input";
import * as yup from "yup";

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

  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: LoginFormData) => {
    const fullData = { ...data, dynamicCode: otp };
    console.log("LOGIN:", fullData);
    alert("Login submitted!");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ maxWidth: 400, width: "100%" }}
    >
      <h2>Login</h2>

      <div>
        <label>Username</label>
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

      <div>
        <label>Dynamic Code</label>
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
            fontSize: "1rem",
            borderRadius: "8px",
            border: "1px solid #ccc",
            margin: "0 0.2rem",
            textAlign: "center",
          }}
          containerStyle={{ justifyContent: "center" }}
        />
      </div>

      <button type="submit" disabled={!isValid || otp.length !== 6}>
        Login
      </button>
    </form>
  );
}
