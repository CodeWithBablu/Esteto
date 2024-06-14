import axios from "axios";
import { LoaderFunctionArgs, defer } from "react-router-dom";
import { formatDistance, formatPrice } from "./utils";

export const singlePageLoader = async ({ params }: LoaderFunctionArgs) => {
  let data = (await axios.get(`/api/post/${params.id}`)).data.value;
  const postDetail = data.postdetail;
  const user = data.user;

  data = {
    ...data,
    bedroom: data.bedroom,
    bathroom: data.bathroom,
    price: formatPrice(data.price),
    user: user,
    postdetail: {
      ...data.postdetail,
      school: formatDistance(postDetail.school),
      bus: formatDistance(postDetail.bus),
      restaurant: formatDistance(postDetail.restaurant),
    },
  };

  return data;
};

export const listPageLoader = async ({ request }: LoaderFunctionArgs) => {
  let query = request.url.split("?")[1];
  if (!query) query = `city=&type=&property=&bedroom=&minPrice=&maxPrice=`;
  const res = axios.get(`/api/post?${query}`);

  return defer({
    posts: res,
  });
};

export const profilePageLoader = async () => {
  const res = axios.get(`/api/user/profilePosts`);
  return defer({
    user: res,
  });
};
