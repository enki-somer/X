import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const queryClient = useQueryClient();

  const validateForm = () => {
    const errors = {};
    if (!formData.username) errors.username = "Username is required";
    if (!formData.password) errors.password = "Password is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const {
    mutate: loginMutation,
    isError,
    isPending,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Invalid username or password");
        }
        return data;
      } catch (error) {
        if (error.message.includes("<!DOCTYPE")) {
          throw new Error("Server error. Please try again later.");
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      toast.success("Login successful!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to login");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErrors({});

    if (validateForm()) {
      loginMutation(formData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-[50%] lg:h-screen hidden lg:flex items-center justify-center bg-black">
        <XSvg className="w-2/3 max-w-md fill-white" />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center items-center min-h-screen p-6 lg:p-12 bg-black">
        <div className="w-full max-w-md">
          <div className="flex justify-center lg:hidden mb-12">
            <XSvg className="w-16 sm:w-20 fill-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 text-center lg:text-left">
            {"Let's"} go.
          </h1>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="input input-bordered flex items-center gap-4 px-6 h-14 bg-transparent hover:border-primary focus-within:border-primary transition-colors">
                <MdOutlineMail className="w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  className="grow bg-transparent text-base outline-none"
                  placeholder="Username"
                  name="username"
                  onChange={handleInputChange}
                  value={formData.username}
                />
              </label>
              {validationErrors.username && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors.username}
                  </span>
                </label>
              )}
            </div>

            <div className="form-control w-full">
              <label className="input input-bordered flex items-center gap-4 px-6 h-14 bg-transparent hover:border-primary focus-within:border-primary transition-colors">
                <MdPassword className="w-6 h-6 text-gray-400" />
                <input
                  type="password"
                  className="grow bg-transparent text-base outline-none"
                  placeholder="Password"
                  name="password"
                  onChange={handleInputChange}
                  value={formData.password}
                />
              </label>
              {validationErrors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors.password}
                  </span>
                </label>
              )}
            </div>

            <button
              className="btn btn-primary text-white rounded-full h-14 text-lg font-semibold hover:opacity-90 transition-opacity mt-4"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Login"
              )}
            </button>

            {isError && (
              <div className="alert alert-error mt-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error.message}</span>
              </div>
            )}
          </form>
          <div className="mt-12 text-center">
            <p className="text-gray-300 text-lg mb-6">
              {"Don't"} have an account?
            </p>
            <Link to="/signup" className="w-full">
              <button className="btn btn-outline btn-primary text-white rounded-full w-full h-14 text-lg font-semibold hover:bg-primary/10 transition-colors">
                Sign up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
