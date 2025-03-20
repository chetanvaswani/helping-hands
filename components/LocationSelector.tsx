"use client"
import { ReactElement, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";

interface LocationSelectorInterface{
    title: string,
    subTitle: string,
    Icon?: ReactElement
}

export default function LocationSelector( {title, subTitle, Icon }: LocationSelectorInterface) {
  const router = useRouter();

  useEffect(() => {
    navigator?.geolocation?.getCurrentPosition(showPosition);

    function showPosition(position: GeolocationPosition) {
      console.log(position);
    }
  }, []);

  return (
    <div className=" h-[70px] z-100 w-full top-0 flex justify-between items-center px-2 py-5 text-black font-bold text-xl border-b-2 border-black/10 bg-white">
        <div className="ml-2" onClick={() => {
          router.push("/address")
        }}>
          <div className="flex items-end">{title}</div>
          <div className="text-sm text-black/60 flex items-end gap-1">
            {subTitle} <IoIosArrowDown className="mb-[2px]" />
          </div>
        </div>
        {Icon}
    </div>
  );
}
