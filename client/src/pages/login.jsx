import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/validationSchema";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../app/authSlice"; // Adjust the import according to your setup
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth); // Access error from the auth slice
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(
        login({
          email: data.email,
          password: data.password,
        })
      );

      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/"); // Replace with your actual homepage route
      }, 2000); // Redirect after 2 seconds
    } catch (error) {
      console.error("Login error:", error);
      toast.error(
        error.message ||
          "Login failed. Please check your credentials and try again."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto bg-base-100 p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-6 text-primary">Login</h1>
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
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-sm">
          <Link to="/register" className="text-primary">
            Register
          </Link>
          {" | "}
          <Link to="/forget" className="text-primary">
            Forgot Password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
