import { atom } from "recoil";
import type { Address } from "@/schemas/AddressSchema";

export const currentAddressState = atom<Address | null>({
  key: "currentAddressState",
  default: null,
});