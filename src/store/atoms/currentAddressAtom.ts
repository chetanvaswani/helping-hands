import { atom } from "recoil";
import type { Address } from "@/schemas/AddressSchema";

export const currentAddressAtom = atom<Address | null>({
  key: "currentAddressAtom",
  default: null,
});