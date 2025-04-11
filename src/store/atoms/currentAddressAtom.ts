import { atom } from "recoil";
import type { Address } from "@/schemas/AddressSchema";

interface NewAddress{
  name?: string,
  latitude: string
  longitude: string,
  address: string
}

export const currentAddressAtom = atom<Address | null | NewAddress>({
  key: "currentAddressAtom",
  default: null,
});