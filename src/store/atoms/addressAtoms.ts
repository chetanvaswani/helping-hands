"use client"
import { atom } from "recoil";
import type { Address } from "../../schemas/AddressSchema";

interface NewAddress{
  name?: string,
  latitude: string
  longitude: string,
  address: string
}

interface locationAccessAtomInterface {
    access: null | boolean,
    prompt: boolean
}

export const currentAddressAtom = atom<Address | null | NewAddress>({
  key: "currentAddressAtom",
  default: null,
});

export const addressesAtom = atom({
  key: "addressesAtom", 
  default: null,
});


export const locationAccessAtom = atom<locationAccessAtomInterface>({
    key: "locationAccessAtom",
    default: {
        access: null,
        prompt: true,
    },
});

export const selectedAddressAtom = atom<Address | null>({
    key: "selectedAddressAtom",
    default: null,
});