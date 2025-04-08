import { atom, selector } from "recoil";
import { getSession } from "next-auth/react";

export const addressesSelector = selector({
  key: "addressesSelector",
  get: async () => {
    try {
      const session = await getSession();
      if (!session) {
        return [];
      }

      const res = await fetch("/api/v1/addresses", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          mobileNumber: session.user.mobileNumber,
        },
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

export const addressesAtom = atom({
  key: "addressesAtom", 
  default: addressesSelector,
});