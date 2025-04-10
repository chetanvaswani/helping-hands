"use client"
import { ReactElement } from "react";
import React from "react";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";
import AddressDisplay from "./AddresDisplay";

interface LocationSelectorInterface{
    title: string,
    subTitle: string,
    Icon?: ReactElement
}

export default function LocationSelector( {title, Icon }: LocationSelectorInterface) {
  const [getPermissionModal, setGetPermissionModal] = useState(false);
  const router = useRouter();

  return (
    <>
    <div className="z-[1000] h-[70px] w-full top-0 flex justify-between items-center px-2 py-5 text-black font-bold text-xl bg-white">
        <div className="ml-2 w-[80%]">
          <div className="flex items-center gap-1" onClick={() => {
              router.push("/address")
          }}>
            <div className="flex items-end">{title}</div>
            <IoIosArrowDown className="mt-1 size-4" />
          </div>
          <div className="w-full text-sm text-black/60 flex items-end gap-1">
            <React.Suspense fallback={<div>Looking up your address...</div>}>
                <AddressDisplay getPermissionModal={getPermissionModal} setGetPermissionModal={setGetPermissionModal} />
            </React.Suspense>
          </div>
        </div>
        <div onClick={() => {
          setGetPermissionModal(true)
        }}>
          {Icon}
        </div>
    </div>
    </>
  );
}
