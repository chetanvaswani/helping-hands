import { atom, selector } from "recoil";
import { headers } from "next/headers";

export const addressesSelector = selector({
  key: "addressesSelector",
  get: async () => {
    try {
      const cookie = (await headers()).get("cookie") || "";
      const res = await fetch("/api/v1/user?include=addresses", {
        headers: { cookie },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch addresses");
      }
      const json = await res.json();
      return json.data.addresses || [];
    } catch (error) {
      console.error("Error fetching addresses:", error);
      return [];
    }
  },
});

export const addressesState = atom({
  key: "addressesState", 
  default: addressesSelector,
});