'use client';

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from 'lucide-react';
import { login } from "@/app/action/auth";

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formDataObj = new FormData();
      formDataObj.append('username', formData.username);
      formDataObj.append('password', formData.password);
      
      const result = await login(formDataObj);

      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        localStorage.setItem("userData", JSON.stringify(result.user));
        router.push("/dashboard");
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full justify-center my-4 h-full">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <div className="flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold text-primary mb-8">
            Login
          </h1>
          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-primary focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-2 text-center">
                {error}
              </div>
            )}

            <Button
              className="w-full bg-primary text-white font-semibold rounded-md py-2 
                       hover:bg-primary/90 transition-colors"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}