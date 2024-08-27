import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/validationSchema";
import { useDispatch } from "react-redux";
import { register } from "../app/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(
        register({
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword,
        })
      );

      toast.success("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/"); // Replace with your actual homepage route
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-base-100 p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-6 text-primary">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-2 text-secondary"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...formRegister("email")}
            className="input input-bordered w-full border-primary focus:border-primary"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-2 text-secondary"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            {...formRegister("password")}
            className="input input-bordered w-full border-primary focus:border-primary"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium mb-2 text-secondary"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...formRegister("confirmPassword")}
            className="input input-bordered w-full border-primary focus:border-primary"
          />
          {errors.confirmPassword && (
            <p className="text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
