import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../validation/validationSchema"; // Ensure this schema is updated to include email and password
import { useDispatch } from "react-redux";
import { resetPassword } from "../app/authSlice";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams(); // Extract token from URL
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for navigation
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(resetPassword(data.email, data.password, token)); // Use token from URL
      toast.success("Password has been reset. You can now log in.");
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      toast.error("Failed to reset password.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-base-100 p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-6 text-primary">
        Reset Password
      </h1>
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
            New Password
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
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
