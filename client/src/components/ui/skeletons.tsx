import {
  ChevronLeftIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

export function CardSkeleton() {
  return (
    <div className="card flex animate-pulse flex-col rounded-2xl bg-gray-100 p-2 shadow-lg md:flex-row md:bg-transparent md:shadow-none">
      <div className="imgContainer h-[250px] bg-gray-200"></div>

      <div className="textContainer flex flex-col gap-3 md:justify-between">
        <h2 className="cardTitle">
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </h2>

        <div className="address flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-gray-200"></div>
          <div className="h-4 w-1/2 rounded bg-gray-200"></div>
        </div>

        <div className="price h-5 w-1/3 rounded bg-gray-200"></div>

        <div className="bottom flex flex-col items-start gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="features">
            <div className="feature">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-gray-200"></div>
                <div className="h-4 w-10 rounded bg-gray-200"></div>
              </div>
              <div className="h-4 w-full rounded bg-gray-200"></div>
            </div>

            <div className="feature">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-gray-200"></div>
                <div className="h-4 w-10 rounded bg-gray-200"></div>
              </div>
              <div className="h-4 w-full rounded bg-gray-200"></div>
            </div>
          </div>

          <div className="icon flex">
            <div className=" mr-4 h-8 w-8 rounded bg-gray-200"></div>
            <div className=" h-8 w-8 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MapSkeleton({ loading }: { loading: boolean }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <span
        className={`font-chillax text-2xl font-medium ${loading ? "inline-block" : "hidden"}`}
      >
        Loading <span className="inline-block animate-bounce">...</span>
      </span>
      <img
        src="/assets/icons/map.gif"
        className="h-[20rem] w-[20rem] object-cover md:h-[25rem] md:w-[25rem]"
        alt=""
      />
    </div>
  );
}

export function ChatSkeleton() {
  return (
    <div className="flex h-full w-full animate-pulse flex-col">
      <div className="flex w-full items-center justify-between gap-2 bg-zinc-800 px-2 py-2">
        <ChevronLeftIcon className="h-8 w-8 text-zinc-600" />
        <div className="text-center">
          <div className="h-4 w-32 rounded bg-zinc-700"></div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 rounded-md bg-zinc-700"></div>
            <div className="h-4 w-16 rounded-full bg-zinc-700"></div>
          </div>
        </div>
        <div className="h-12 w-12 rounded-full bg-zinc-700"></div>
      </div>

      <div className="mt-10 flex h-full w-full flex-1 flex-col overflow-y-scroll pb-10">
        <div className="mt-5 flex h-20 w-full flex-col gap-2">
          <div className="ml-5 h-full w-3/4 rounded-r-2xl rounded-t-2xl rounded-bl-none bg-zinc-800 sm:ml-10">
            <div className="h-4 rounded"></div>
          </div>

          <div className="ml-5 h-4 w-16 rounded bg-zinc-700 sm:ml-10"></div>
        </div>

        <div className="mt-5 flex h-32 w-full flex-col items-end gap-2">
          <div className="mr-5 h-full w-3/4 rounded-l-2xl rounded-t-2xl rounded-br-none bg-indigo-600 sm:mr-10">
            <div className="h-4 rounded"></div>
          </div>

          <div className="mr-5 h-4 w-16 rounded bg-zinc-700  sm:mr-10"></div>
        </div>

        <div className="mt-5 flex h-20 w-full flex-col gap-2">
          <div className="ml-5 h-full w-3/4 rounded-r-2xl rounded-t-2xl rounded-bl-none bg-zinc-800 sm:ml-10">
            <div className="h-4 rounded"></div>
          </div>

          <div className="ml-5 h-4 w-16 rounded bg-zinc-700 sm:ml-10"></div>
        </div>

        <div className="mt-5 flex h-32 w-full flex-col items-end gap-2">
          <div className="mr-5 h-full w-3/4 rounded-l-2xl rounded-t-2xl rounded-br-none bg-indigo-600 sm:mr-10">
            <div className="h-4 rounded"></div>
          </div>

          <div className="mr-5 h-4 w-16 rounded bg-zinc-700  sm:mr-10"></div>
        </div>
      </div>

      <div className=" flex h-24 w-full items-center justify-center bg-zinc-800/60 px-5">
        <div className="relative flex h-full w-full items-center gap-2 sm:w-3/4">
          <textarea className="relative h-[60px] w-full resize-none rounded-3xl bg-zinc-800 py-3"></textarea>
          <button className="absolute right-2 flex h-[50px] w-[50px] items-center justify-center rounded-full bg-lime-500">
            <PaperAirplaneIcon className="h-6 w-6 -rotate-45 sm:h-8 sm:w-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
