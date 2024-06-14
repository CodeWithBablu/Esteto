import "../styles/pages/auth.scss";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { useContext, useState } from "react";
import { UserType, errorHandler, toastMessage } from "../lib";
import clsx from "clsx";
import { AuthContext } from "@/context/AuthContext";

const Loader = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="h-8 w-8"
    fill="currentColor"
  >
    <path d="M3.05469 13H5.07065C5.55588 16.3923 8.47329 19 11.9998 19C15.5262 19 18.4436 16.3923 18.9289 13H20.9448C20.4474 17.5 16.6323 21 11.9998 21C7.36721 21 3.55213 17.5 3.05469 13ZM3.05469 11C3.55213 6.50005 7.36721 3 11.9998 3C16.6323 3 20.4474 6.50005 20.9448 11H18.9289C18.4436 7.60771 15.5262 5 11.9998 5C8.47329 5 5.55588 7.60771 5.07065 11H3.05469Z"></path>
  </svg>
);

interface IFormInput {
  username: string;
  password: string;
}

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { updateUser } = useContext(AuthContext) as {
    updateUser: (data: UserType) => void;
  };

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await axios.post(`/api/auth/login`, data);
      updateUser(res.data.value);
      toastMessage("success", res.data.message, 4000);
      navigate("/");
    } catch (error) {
      console.log(error);

      if (error instanceof AxiosError) {
        setError(error.response?.data.message);
      } else setError(errorHandler(error, "Failed to log in") as string);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="formContainer">
        <div className="relative">
          <form onSubmit={handleSubmit(onSubmit)} className="relative z-20">
            <h1 className="font-chillax text-lg font-[500]">Welcome back</h1>

            <input
              {...register("username", {
                required: "username or email invalid. max: 25",
                maxLength: 25,
              })}
              aria-invalid={errors.username ? "true" : "false"}
              name="username"
              type="text"
              placeholder="Username or email"
              autoComplete="username"
            />
            {errors.username && (
              <p role="alert">
                <ExclamationCircleIcon className="mr-1 inline-block w-6" />{" "}
                {errors.username.message}
              </p>
            )}

            <input
              {...register("password", { required: true, minLength: 5 })}
              aria-invalid={errors.password ? "true" : "false"}
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
            />
            {errors.password && (
              <p role="alert">
                <ExclamationCircleIcon className="mr-1 inline-block w-6" />
                password is invalid. min: 5
              </p>
            )}

            <div className="relative flex items-center justify-center">
              <span className="absolute animate-spin text-gray-600">
                {Loader}
              </span>
              <button
                type="submit"
                className={clsx("relative w-full", { "opacity-50": isLoading })}
              >
                Login
              </button>
            </div>
            {error && (
              <p role="alert">
                <ExclamationCircleIcon className="mr-1 inline-block w-6" />
                {error}
              </p>
            )}

            <Link to="/register">Create a new account for free?</Link>
          </form>

          <div className="absolute -left-[4rem] -top-[7.5rem] z-10 h-[20rem] w-[20rem] animate-blob rounded-full bg-gradient-radial from-violet-500/50 opacity-60 blur-xl md:hidden"></div>
          <div className="animation-delay-7000 absolute -bottom-[7.5rem] -right-[3rem] z-10 h-[20rem] w-[20rem] animate-blob rounded-full bg-gradient-radial from-indigo-500/50 opacity-70 blur-xl md:hidden"></div>
        </div>
      </div>

      <div className="imgContainer relative hidden md:block lg:bg-slate-100">
        <div className="absolute left-10 top-[6%] h-[15rem] w-[15rem] animate-blob rounded-full bg-gradient-radial from-cyan-500/40 blur-2xl filter xl:h-[25rem] xl:w-[25rem]"></div>
        <div className="animation-delay-7000 absolute left-0 top-[20%] h-[15rem] w-[15rem] animate-blob rounded-full bg-gradient-radial from-pink-500/40 blur-2xl filter xl:h-[25rem] xl:w-[25rem]"></div>

        <div className="relative z-10 flex h-full w-full items-center">
          <img
            className="absolute right-0 max-w-none md:w-[130%] lg:w-[105%] xl:w-[115%]"
            src="/assets/home/bg.png"
            alt="bghome"
          />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
