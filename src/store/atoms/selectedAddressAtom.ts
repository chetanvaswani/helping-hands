import { atom } from "recoil";
import type { Address } from "../../schemas/AddressSchema";

export const selectedAddressAtom = atom<Address | null>({
  key: "selectedAddressAtom",
  default: null,
});