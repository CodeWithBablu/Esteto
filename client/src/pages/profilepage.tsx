import "../styles/pages/profilePage.scss";
import { Await, Link, useLoaderData } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { Suspense, useContext } from "react";
import { PlusIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { CardSkeleton, List } from "../components";
import { EstateRaw, UserType } from "@/lib";

export default function ProfilePage() {
  const res = useLoaderData() as {
    user: Promise<{
      value: {
        userPosts: EstateRaw[];
        savedPosts: EstateRaw[];
      };
    }>;
  };

  const { currUser } = useContext(AuthContext) as {
    currUser: UserType | null;
    updateUser: (data: UserType | null) => void;
  };

  return (
    <div className="profilePage pt-10 font-poppins">
      <div className="details no-scrollbar ">
        <div className="wrapper flex flex-col">
          <div className="info flex w-full flex-col items-center gap-5 rounded-xl py-3 xs:flex-row xs:gap-10 sm:py-10">
            <div>
              {currUser ? (
                <>
                  {currUser.avatar && (
                    <>
                      {!currUser.avatar.includes("<svg") && (
                        <img
                          src={currUser.avatar}
                          className="h-20 w-20 rounded-full object-cover"
                          alt="avatar"
                        />
                      )}
                      {currUser.avatar.includes("<svg") && (
                        <div
                          className=" h-20 w-20"
                          dangerouslySetInnerHTML={{
                            __html: currUser?.avatar as string,
                          }}
                        />
                      )}
                    </>
                  )}
                </>
              ) : (
                <UserCircleIcon className="mx-2 h-8 w-8 text-zinc-600 md:h-10 md:w-10" />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="top flex items-end justify-center gap-3 font-chillax xs:justify-start">
                <h1 className="text-2xl font-medium text-gray-500">Hey!</h1>
                <div className="h-auto overflow-hidden">
                  <span className="inline-block animate-fadeIn text-2xl font-[500] capitalize text-blue-500">
                    {currUser?.username}
                  </span>
                </div>
              </div>

              <div className="bottominfo text-center xs:text-left">
                <div>
                  <h2 className="text-xl text-gray-500">Email</h2>
                  <span className="font-chillax">{currUser?.email}</span>
                </div>
              </div>
            </div>
          </div>

          <Link
            to={"/profile/update"}
            className=" rounded-md bg-zinc-900 px-6 py-2 text-center text-lg font-semibold text-gray-100 xs:w-fit"
          >
            UPDATE
          </Link>

          <div className="title">
            <h1 className="font-chillax text-2xl font-semibold">My List</h1>
            <Link
              to={"/add"}
              className=" flex items-center rounded-md bg-blue-600 px-4 py-3 font-medium text-gray-100"
            >
              Create Posts <PlusIcon className="w-6" />
            </Link>
          </div>

          <Suspense
            fallback={
              <>
                <CardSkeleton />
                <CardSkeleton />
              </>
            }
          >
            <Await
              resolve={res.user}
              errorElement={
                <div className=" flex w-full flex-col">
                  <span className="animate-pulse font-chillax text-xl font-medium">
                    Some technical glitch occured
                  </span>
                  <img
                    src="/assets/icons/oops.png"
                    alt="search"
                    className="h-[15rem] w-[15rem] object-contain"
                  />
                </div>
              }
            >
              {(res: {
                data: {
                  value: { userPosts: EstateRaw[]; savedPosts: EstateRaw[] };
                };
              }) => {
                return (
                  <>
                    {res.data.value.userPosts.length > 0 ? (
                      <List
                        listData={res.data.value.userPosts}
                        btnDisabled={true}
                      />
                    ) : (
                      <span className=" text-gray-500">
                        ** Added posts will show here
                      </span>
                    )}
                  </>
                );
              }}
            </Await>
          </Suspense>

          <div className="title">
            <h1 className="font-chillax text-2xl font-semibold">Saved List</h1>
          </div>

          <Suspense
            fallback={
              <>
                <CardSkeleton />
                <CardSkeleton />
              </>
            }
          >
            <Await
              resolve={res.user}
              errorElement={
                <p className="animate-pulse">
                  Some error occured. Please try again!
                </p>
              }
            >
              {(res: {
                data: {
                  value: { userPosts: EstateRaw[]; savedPosts: EstateRaw[] };
                };
              }) => {
                return (
                  <>
                    {res.data.value.savedPosts.length > 0 ? (
                      <List
                        listData={res.data.value.savedPosts}
                        btnDisabled={false}
                      />
                    ) : (
                      <span className=" text-gray-500">** Nothing to show</span>
                    )}
                  </>
                );
              }}
            </Await>
          </Suspense>
        </div>
      </div>

      <div className="chatContainer hidden lg:inline-block"></div>
    </div>
  );
}
