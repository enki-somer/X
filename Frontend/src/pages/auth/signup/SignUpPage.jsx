import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { toast } from "react-hot-toast";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Invalid email address";

    if (!formData.username) errors.username = "Username is required";
    else if (formData.username.length < 3)
      errors.username = "Username must be at least 3 characters";

    if (!formData.fullName) errors.fullName = "Full name is required";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to create account");
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
      toast.success("Account created successfully!");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create account");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationErrors({});

    if (validateForm()) {
      mutate(formData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side with X logo */}
      <div className="lg:w-[50%] lg:h-screen hidden lg:flex items-center justify-center bg-black">
        <XSvg className="w-2/3 max-w-md fill-white" />
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center items-center min-h-screen p-6 lg:p-12 bg-black">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-center lg:hidden mb-12">
            <XSvg className="w-16 sm:w-20 fill-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-8 text-center lg:text-left">
            Join today.
          </h1>

          {/* Form */}
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="input input-bordered flex items-center gap-4 px-6 h-14 bg-transparent hover:border-primary focus-within:border-primary transition-colors">
                <MdOutlineMail className="w-6 h-6 text-gray-400" />
                <input
                  type="email"
                  className="grow bg-transparent text-base outline-none"
                  placeholder="Email"
                  name="email"
                  onChange={handleInputChange}
                  value={formData.email}
                />
              </label>
              {validationErrors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {validationErrors.email}
                  </span>
                </label>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="form-control flex-1">
                <label className="input input-bordered flex items-center gap-4 px-6 h-14 bg-transparent hover:border-primary focus-within:border-primary transition-colors">
                  <FaUser className="w-6 h-6 text-gray-400" />
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

              <div className="form-control flex-1">
                <label className="input input-bordered flex items-center gap-4 px-6 h-14 bg-transparent hover:border-primary focus-within:border-primary transition-colors">
                  <MdDriveFileRenameOutline className="w-6 h-6 text-gray-400" />
                  <input
                    type="text"
                    className="grow bg-transparent text-base outline-none"
                    placeholder="Full Name"
                    name="fullName"
                    onChange={handleInputChange}
                    value={formData.fullName}
                  />
                </label>
                {validationErrors.fullName && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {validationErrors.fullName}
                    </span>
                  </label>
                )}
              </div>
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
                "Sign up"
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

          {/* Login link */}
          <div className="mt-12 text-center">
            <p className="text-gray-300 text-lg mb-6">
              Already have an account?
            </p>
            <Link to="/login" className="w-full">
              <button className="btn btn-outline btn-primary text-white rounded-full w-full h-14 text-lg font-semibold hover:bg-primary/10 transition-colors">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
