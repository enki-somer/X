import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { toast } from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
  });

  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      try {
        const apiUrl = process.env.VITE_API_URL || "";
        const res = await fetch(`${apiUrl}/api/auth/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, fullName, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to create account!");
        }

        return data;
      } catch (error) {
        if (error.message.includes("<!DOCTYPE")) {
          throw new Error(
            "Unable to connect to the server. Please try again later."
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      // Clear form data on success
      setFormData({
        email: "",
        username: "",
        fullName: "",
        password: "",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.email ||
      !formData.username ||
      !formData.fullName ||
      !formData.password
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center px-4 py-8 lg:py-0">
      <div className="lg:flex-1 lg:h-screen hidden lg:flex items-center justify-center bg-black">
        <XSvg className="w-2/3 max-w-md fill-white" />
      </div>
      <div className="w-full lg:flex-1 flex flex-col justify-center items-center lg:h-screen lg:max-w-xl">
        <div className="w-full max-w-sm mx-auto">
          <div className="flex justify-center lg:hidden mb-8">
            <XSvg className="w-16 sm:w-20 fill-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white text-center lg:text-left mb-8">
            Join today.
          </h1>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <label className="input input-bordered flex items-center gap-3 px-4 h-12 bg-[#16181C] hover:border-[#1D9BF0] focus-within:border-[#1D9BF0] transition-colors">
              <MdOutlineMail className="w-5 h-5 text-gray-400" />
              <input
                type="email"
                className="grow bg-transparent text-base outline-none text-white"
                placeholder="Email"
                name="email"
                onChange={handleInputChange}
                value={formData.email}
                required
              />
            </label>

            <div className="flex flex-col sm:flex-row gap-4">
              <label className="input input-bordered flex items-center gap-3 px-4 h-12 bg-[#16181C] hover:border-[#1D9BF0] focus-within:border-[#1D9BF0] transition-colors flex-1">
                <FaUser className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="grow bg-transparent text-base outline-none text-white"
                  placeholder="Username"
                  name="username"
                  onChange={handleInputChange}
                  value={formData.username}
                  required
                />
              </label>
              <label className="input input-bordered flex items-center gap-3 px-4 h-12 bg-[#16181C] hover:border-[#1D9BF0] focus-within:border-[#1D9BF0] transition-colors flex-1">
                <MdDriveFileRenameOutline className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  className="grow bg-transparent text-base outline-none text-white"
                  placeholder="Full Name"
                  name="fullName"
                  onChange={handleInputChange}
                  value={formData.fullName}
                  required
                />
              </label>
            </div>

            <label className="input input-bordered flex items-center gap-3 px-4 h-12 bg-[#16181C] hover:border-[#1D9BF0] focus-within:border-[#1D9BF0] transition-colors">
              <MdPassword className="w-5 h-5 text-gray-400" />
              <input
                type="password"
                className="grow bg-transparent text-base outline-none text-white"
                placeholder="Password"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                required
                minLength={6}
              />
            </label>

            <button
              className="btn btn-primary text-white rounded-full h-12 mt-2 bg-[#1D9BF0] hover:bg-[#1A8CD8] disabled:bg-[#1D9BF0]/50"
              disabled={isPending}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Sign up"
              )}
            </button>

            {isError && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mt-2">
                <p className="text-red-500 text-sm text-center">
                  {error.message}
                </p>
              </div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-300 mb-4">Already have an account?</p>
            <Link to="/login" className="w-full">
              <button className="btn btn-outline text-[#1D9BF0] hover:bg-[#1D9BF0] hover:text-white rounded-full w-full h-12 border-[#1D9BF0]">
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
