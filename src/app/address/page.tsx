"use client";
import AddressCard from "@/components/AddressCard";
import Button from "@/components/Button";
import { IoIosArrowDown } from "react-icons/io";
import { MdAddLocationAlt } from "react-icons/md";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useRecoilState, useRecoilValue } from "recoil";
import { addressesAtom } from "@/store/atoms/addressAtoms";
import { currentAddressAtom } from "@/store/atoms/addressAtoms";
import { useState, useEffect } from "react";
import {haversineDistance} from "@/utils/findDistance"
import axios from "axios";

export default function Address() {
  const router = useRouter();
  const [savedAddresses, setSavedAddresses] = useRecoilState<any>(addressesAtom);
  const currentAddress = useRecoilValue(currentAddressAtom)
  const [savedAddressesSorted, setSavedAddressesSorted] = useState<any>(savedAddresses);

  useEffect(() => {
    if (savedAddresses === null){
      axios.get("/api/v1/addresses").then((res) => {
        if (res.data.data.addresses.length > 0){
          setSavedAddresses(res.data.data.addresses)
        } else {
          setSavedAddresses([] as any)
        }
      }).catch(() => {
        setSavedAddresses([] as any)
      })
    }
  }, [savedAddresses])

  useEffect(() => {
    if (!savedAddresses) return;
  
    const updatedAddresses = savedAddresses.map((address) => {
      const distanceInMeters = haversineDistance(
        [address.latitude, address.longitude],
        [Number(currentAddress?.latitude), Number(currentAddress?.longitude)]
      );
      return {
        ...address,
        currDistance: distanceInMeters,
      };
    });
  
    const sortedAddresses = updatedAddresses.sort((a, b) => a.currDistance - b.currDistance);
  
    setSavedAddressesSorted(sortedAddresses);
  }, [savedAddresses, currentAddress]);


  return (
    <AnimatePresence>
      <motion.div
        key="address-page"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className="h-svh overflow-hidden w-full bg-gray-100 flex flex-col gap-3 items-center overflow-y-scroll pb-10"
      >
        <div className="h-[50px] mt-5 flex items-center gap-2 w-[90%] m-2">
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
        <div className="w-[90%] mt-2 flex flex-col">
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
        <div className="flex flex-col gap-5 w-[90%]">
          {
            savedAddressesSorted && savedAddressesSorted.length > 0 ?
            savedAddressesSorted.map((address) => {
              return (
                <div key={address.latitude + address.longitude} className="w-full">
                  <AddressCard
                    id={address.id}
                    name={address.name}
                    type={address.type}
                    address={address.address}
                    latitude={address.latitude}
                    longitude={address.longitude}
                    currDistance={address.currDistance}
                  />
                </div>
              )
            }) :
            <p className="text-gray-400 font-semibold text-center" >
              No saved address found
            </p>
          }
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
