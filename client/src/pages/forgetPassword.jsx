import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgetPasswordSchema } from "../validation/validationSchema"; // Define this schema
import { useDispatch } from "react-redux";
import { forgetPassword } from "../app/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ForgetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgetPasswordSchema),
  });

  const onSubmit = async (data) => {
    try {
      await dispatch(forgetPassword(data.email));
      toast.success("Password reset link sent to your email.");
      setTimeout(() => {
        navigate("/"); // Redirect to homepage after 2 seconds
      }, 2000);
    } catch (error) {
      toast.error("Failed to send reset link.");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-base-100 p-8 rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold mb-6 text-primary">
        Forgot Password
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
        <button type="submit" className="btn btn-primary w-full">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgetPassword;
