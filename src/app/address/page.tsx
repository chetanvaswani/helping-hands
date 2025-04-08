"use client";
import AddressCard from "@/components/AddressCard";
import Button from "@/components/Button";
import { IoIosArrowDown } from "react-icons/io";
import { MdAddLocationAlt } from "react-icons/md";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Address() {
  const router = useRouter();

  return (
    <AnimatePresence>
      <motion.div
        key="address-page"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="h-screen overflow-hidden w-full bg-gray-100 flex flex-col items-center"
      >
        <div className="h-[50px] flex items-center gap-2 w-[90%] m-2">
          <div
            className="flex gap-2 cursor-pointer"
            onClick={() => {
              router.back();
            }}
          >
            <IoIosArrowDown className="size-4 stroke-1 mt-2" />
            <h2 className="font-semibold text-xl">Select a location</h2>
          </div>
        </div>
        <div className="w-[90%] flex flex-col">
          <Button
            text="Add a new address"
            variant="light"
            startIcon={
              <MdAddLocationAlt className="size-7 stroke-0 -mt-1" />
            }
            onClick={() => {
              router.push("/address/add");
            }}
          />
        </div>
        <div className="inline-flex items-center justify-center w-full relative">
          <hr className="w-[80%] h-[2px] my-8 bg-gray-200 border-0 rounded-sm" />
          <div className="absolute px-4 -translate-x-1/2 bg-gray-100 left-1/2">
            <p className="text-gray-400 font-normal">Saved Addresses</p>
          </div>
        </div>
        <AddressCard
          name="Home"
          type="other"
          address="House no. 99, Vaishali nagar, bhilai, chhattisgrah"
        />
      </motion.div>
    </AnimatePresence>
  );
}
