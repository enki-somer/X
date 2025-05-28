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
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ email, username, fullName, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Faild to create account !");
        }

        console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Account created successfully");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // page won't reload
    mutate(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side with X logo */}
      <div className="lg:w-[50%] lg:h-screen hidden lg:flex items-center justify-center bg-black">
        <XSvg className="w-2/3 max-w-md fill-white" />
      </div>

      {/* Right side with form */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center items-center min-h-screen p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex justify-center lg:hidden mb-12">
            <XSvg className="w-16 sm:w-20 fill-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-12 text-center lg:text-left">
            Join today.
          </h1>

          {/* Form */}
          <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
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

            <div className="flex flex-col sm:flex-row gap-6">
              <label className="input input-bordered flex items-center gap-4 px-6 h-14 bg-transparent hover:border-primary focus-within:border-primary transition-colors flex-1">
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
              <label className="input input-bordered flex items-center gap-4 px-6 h-14 bg-transparent hover:border-primary focus-within:border-primary transition-colors flex-1">
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
            </div>

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

            <button className="btn btn-primary text-white rounded-full h-14 text-lg font-semibold hover:opacity-90 transition-opacity">
              {isPending ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                "Sign up"
              )}
            </button>

            {isError && (
              <p className="text-red-500 text-sm text-center">
                {error.message}
              </p>
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
