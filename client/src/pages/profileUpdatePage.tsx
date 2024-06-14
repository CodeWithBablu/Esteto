import "@/styles/pages/profileupdatePage.scss";
import { AuthContext } from "@/context/AuthContext";
import { UserType, errorHandler, toastMessage } from "@/lib";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import axios, { AxiosError } from "axios";
import clsx from "clsx";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { UploadWidget } from "@/components";

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
  email: string;
  avatar?: string;
  password: string;
}

function ProfileUpdatePage() {
  const [avatar, setAvatar] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { currUser, updateUser } = useContext(AuthContext) as {
    currUser: UserType | null;
    updateUser: (data: UserType | null) => void;
  };

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    data = {
      ...data,
      username: data.username.toLowerCase(),
      email: data.email.toLowerCase(),
      ...{ avatar: avatar[0] },
    };
    setError("");
    setIsLoading(true);
    try {
      const res = await axios.put(`/api/user/${currUser?._id}`, data);
      updateUser(res.data.value);
      toastMessage("success", res.data.message, 4000);
      navigate("/profile");
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
    <div className="profileUpdatePage">
      <div className="formContainer flex justify-center md:items-center">
        <form onSubmit={handleSubmit(onSubmit)} className="relative z-20">
          <h1 className="font-chillax text-lg font-[500]">Update Profile</h1>

          <input
            {...register("username", {
              required: "username is required. max: 20",
              maxLength: 20,
            })}
            aria-invalid={errors.username ? "true" : "false"}
            defaultValue={currUser?.username}
            name="username"
            type="text"
            placeholder="Username"
            autoComplete="username"
          />
          {errors.username && (
            <p role="alert">
              <ExclamationCircleIcon className="mr-1 inline-block w-6" />{" "}
              {errors.username.message}
            </p>
          )}

          <input
            {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
            aria-invalid={errors.email ? "true" : "false"}
            defaultValue={currUser?.email}
            name="email"
            type="text"
            placeholder="Email"
            autoComplete="email"
          />
          {errors.email && (
            <p role="alert">
              <ExclamationCircleIcon className="mr-1 inline-block w-6" />
              Pleas enter a valid email address
            </p>
          )}

          <input
            {...register("password")}
            aria-invalid={errors.password ? "true" : "false"}
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
          />

          <div className="relative flex items-center justify-center">
            {isLoading && (
              <span className="absolute z-20 animate-spin text-zinc-800">
                {Loader}
              </span>
            )}
            <button
              type="submit"
              className={clsx(
                "relative w-full",
                { "pointer-events-none opacity-50": isLoading },
                { "opacity-100": !isLoading },
              )}
            >
              Update
            </button>
          </div>
          {error && (
            <p role="alert" className="font-medium text-rose-500">
              <ExclamationCircleIcon className="w-6" />
              {error}
            </p>
          )}

          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>

      <div className="sideContainer relative flex flex-col items-center justify-center lg:bg-slate-100">
        {!avatar[0] && currUser?.avatar?.includes("<svg") ? (
          <div
            className="h-[15rem] w-full max-w-[250px]"
            dangerouslySetInnerHTML={{ __html: currUser?.avatar }}
          ></div>
        ) : (
          <img
            src={avatar[0] || currUser?.avatar || "/assets/icons/avatar.svg"}
            alt="avatar"
          />
        )}
        <UploadWidget
          uwConfig={{
            cloudName: "codewithbablu",
            uploadPreset: "esteto",
            multiple: false,
            maxImageFileSize: 2000000,
            folders: "avatars",
          }}
          setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
