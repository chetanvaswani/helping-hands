"use client"
import { ReactElement } from "react";
import React, {useEffect} from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";
import { currentAddressAtom } from "@/store/atoms/currentAddressAtom";
import { useRecoilState, useRecoilValue } from "recoil";
import { locationAccessAtom } from "@/store/atoms/locationAccessAtom";
import { selectedAddressAtom } from "@/store/atoms/selectedAddressAtom";
import { addressesAtom } from "@/store/atoms/addressesAtom";
import { haversineDistance } from "@/utils/findDistance";
import LocationPermissionModal from "@/components/LocationPermissionModal";
import { toTitleCase } from "@/utils/toTitleCase";
import { GoHome } from "react-icons/go";
import { PiBuildingOffice } from "react-icons/pi";
import { IoLocationOutline } from "react-icons/io5";

interface LocationSelectorInterface{
    Icon?: ReactElement
}

export default function LocationSelector({ Icon }: LocationSelectorInterface) {
  const currentAddressState = useRecoilValue(currentAddressAtom);
  const [locationAccessState, setLocationAccessState] = useRecoilState(locationAccessAtom);
  const [selectedAddressState, setSelectedAddressState] = useRecoilState(selectedAddressAtom);
  const savedAddresses = useRecoilValue(addressesAtom);

  const router = useRouter();

  useEffect(() => {
    console.log("before",currentAddressState, savedAddresses, selectedAddressState)
    if (currentAddressState && (savedAddresses as any)?.length > 0 && selectedAddressState === null){
        (savedAddresses as any).map((address) => {
            const distance = haversineDistance([address.latitude, address.longitude], [Number(currentAddressState.latitude), Number(currentAddressState.longitude)])
            if (distance < 20){
                setSelectedAddressState(address)
            }
        })
    }
    console.log("after",currentAddressState, savedAddresses, selectedAddressState)
}, [currentAddressState, savedAddresses])

  return (
    <>
    <div className="z-[1000] h-[70px] w-full top-0 flex justify-between items-center px-2 py-5 text-black font-bold text-xl bg-white">
        <div className="ml-2 w-[80%]">
          <div className="flex items-center gap-1" onClick={() => {
              router.push("/address")
          }}>
            <div className="flex items-end">
              {
                selectedAddressState?.name ? 
                  <div className="flex items-center gap-1 ">
                    {
                      selectedAddressState.type === "home" ? 
                      <GoHome className="size-5 text-black" />
                      : selectedAddressState.type === "work" ? 
                      <PiBuildingOffice className="size-5 text-black" /> :
                      <IoLocationOutline className="size-5 text-black" />
                    }
                    {toTitleCase(selectedAddressState.name)}
                  </div>
                : "Welcome"
              }
            </div>
            <IoIosArrowDown className="mt-1 size-4" />
          </div>
          <div className="w-full text-sm text-black/60 flex items-end gap-1">
            <p className="max-w-full line-clamp-1 overflow-hidden">
              { 
                selectedAddressState !== null ? 
                  selectedAddressState.address
                : locationAccessState.access === null ? 
                  "Grant Location access"
                : locationAccessState.access === false ?
                  "Location access denied"
                : locationAccessState && currentAddressState === null ?
                  "Looking up your Address..."
                : locationAccessState && currentAddressState !== null ?
                  currentAddressState.address
                : false
              }
            </p>
          </div>
        </div>
        <div onClick={() => {
          setSelectedAddressState(null)
          if (!locationAccessState.access){
            setLocationAccessState({
              access: locationAccessState.access,
              prompt: true
            })
          }
        }}>
          {Icon}
        </div>
        {
          locationAccessState.prompt ? <LocationPermissionModal /> :  false
        }
    </div>
    </>
  );
}
