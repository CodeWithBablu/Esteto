import { toastMessage } from "./toastMessage";

export const formatLastSeen = (timestamp: string) => {
  const lastSeenDate = new Date(timestamp);
  const now = new Date();

  const isToday = lastSeenDate.toDateString() === now.toDateString();

  // Format options for time (hours,minutes, am/pm)=>10:30pm
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  // Format options for date (short month name, day of the month) => May,22
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  if (isToday) {
    // If last seen today, show time only
    return `last seen today at ${lastSeenDate.toLocaleTimeString("en-IN", options)}`;
  } else {
    // If not today, show date and time
    const formattedDate = lastSeenDate.toLocaleDateString("en-IN", dateOptions);
    const formattedTime = lastSeenDate.toLocaleTimeString("en-IN", {
      ...options,
    });
    return `last seen ${formattedDate} at ${formattedTime}`;
  }
};

//10:30pm 09:30am
export const formatTime = (timestamp: string): string => {
  const time = new Date(timestamp);

  // Format options for time (hours,minutes, am/pm)=>10:30pm
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedTime = time.toLocaleTimeString("en-IN", { ...options });
  return formattedTime;
};

export const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "... " : text;
};

// Sun, 22 May
export const formatMessageDate = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();
  const isYesterday =
    new Date(now.setDate(now.getDate() - 1)).toDateString() ===
    date.toDateString();

  if (isToday) {
    return "Today";
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }
};

export const formatDistance = (distance: number) => {
  const threshold = 1000; // Threshold to switch between km and m (in meters)

  if (distance <= 0) {
    return "--"; // If distance is negative, return '--'
  } else if (distance < threshold) {
    return distance + " m"; // If distance is less than threshold, display in meters
  } else {
    const kilometers = (distance / 1000).toFixed(1); // Convert distance to kilometers with one decimal point
    return kilometers + " km"; // Display distance in kilometers
  }
};

export const pricelimit = {
  buy: {
    min: 1000,
    max: 1000000000,
  },
  rent: {
    min: 1000,
    max: 2000000,
  },
};

// utils/numberFormatter.js
export const formatPrice = (number: number) => {
  const format = (num: number, divisor: number, suffix: string) =>
    (num / divisor).toFixed(1).replace(/\.0$/, "") + suffix;

  if (number >= 10000000) {
    return format(number, 10000000, " Cr");
  } else if (number >= 100000) {
    return format(number, 100000, " L");
  } else if (number >= 1000) {
    return format(number, 1000, " K");
  } else {
    return number.toString();
  }
};

let isToastActive: boolean = false;
export const handleKeyDown = (
  e: React.KeyboardEvent<HTMLInputElement>,
  maxVal: number = -1,
  suffix: string = "price",
  minVal: number = 1000,
) => {
  if (maxVal !== -1 && !isNaN(Number(e.key))) {
    if (Number(e.currentTarget.value) * 10 + Number(e.key) > maxVal) {
      if (!isToastActive) {
        isToastActive = true;
        toastMessage(
          "warn",
          `${e.currentTarget.name} should be between ${suffix === "price" ? `₹ ${minVal} - ${formatPrice(maxVal)}` : `${minVal} - ${maxVal} ${suffix}`}`,
          3000,
        );
        setTimeout(() => {
          isToastActive = false;
        }, 3000);
      }
      e.preventDefault();
    }
  }
  if (e.key === "." || e.key === "+" || e.key === "-") {
    e.preventDefault();
  }
};
