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
  const queryClient = useQueryClient();

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
          throw new Error(data.error || "Failed to login");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-[50%] lg:h-screen hidden lg:flex items-center justify-center bg-black">
        <XSvg className="w-2/3 max-w-md fill-white" />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center items-center min-h-screen p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="flex justify-center lg:hidden mb-12">
            <XSvg className="w-16 sm:w-20 fill-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-12 text-center lg:text-left">
            {"Let's"} go.
          </h1>
          <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
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
                "Login"
              )}
            </button>

            {isError && (
              <p className="text-red-500 text-sm text-center">
                {error.message}
              </p>
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
