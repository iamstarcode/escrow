import { Image } from "native-base";
import { Session, User, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Env } from "../config/env";

export const uploadImageToCloudiinaryUnsigned = async (
  images: any,
  session: Session | null
) => {
  let apiUrl = "https://api.cloudinary.com/v1_1/escrow/image/upload";
  let srcs: any[] = [];

  for (let index = 0; index < images.length; index++) {
    const file = `data:image/jpg;base64,${images[index].base64}`;
    let data = {
      file,
      upload_preset: "products_unsigned",
      public_id: `${session?.user?.id}/${generateRandomString(20)}`,
    };

    try {
      const fetcher = await fetch(apiUrl, {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      });
      const response = await fetcher.json();
      //console.log(response);
      srcs.push(response.public_id);
    } catch (error) {
      console.log("error", error);
    }
  }

  return srcs;
};

export const uploadImageToCloudiinarySigned = async (
  images: any,
  session: Session | null
) => {
  let uploadURL = `${Env.API_URL}/cloudinary/upload`;
  console.log("url ", uploadURL);
  let srcs: any[] = [];

  for (let index = 0; index < images.length; index++) {
    const file = `data:image/jpg;base64,${images[index].base64}`;
    let data = {
      file,
      //upload_preset: "products_unsigned",
      folder: `/products${session?.user?.id}`,
      //public_id: `${user?.id}/${generateRandomString(20)}`,
    };

    try {
      const fetcher = await fetch(uploadURL, {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        method: "POST",
      });
      const response = await fetcher.json();
      console.log(response);
      srcs.push(response.public_id);
    } catch (error) {
      console.log("error", error);
    }
  }

  return srcs;
};

export const generateRandomString = (lenth: number) => {
  const char = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
  const random = Array.from(
    { length: lenth },
    () => char[Math.floor(Math.random() * char.length)]
  );
  const randomString = random.join("");
  return randomString;
};
