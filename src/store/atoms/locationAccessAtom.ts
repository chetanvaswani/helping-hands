import { atom } from "recoil";

interface locationAccessAtomInterface {
  access: null | boolean,
  prompt: boolean
}

export const locationAccessAtom = atom<locationAccessAtomInterface>({
  key: "locationAccessAtom",
  default: {
    access: null,
    prompt: true,
  },
});