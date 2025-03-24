"use client"
import { ReactElement, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";
import axios from "axios";

interface LocationSelectorInterface{
    title: string,
    subTitle: string,
    Icon?: ReactElement
}

export default function LocationSelector( {title, Icon }: LocationSelectorInterface) {
  const router = useRouter();
  const [addressName, setAddressName] = useState("Looking up your address...");

  useEffect(() => {
    // console.log(navigator.geolocation)
    navigator.geolocation.getCurrentPosition(showPosition);
    // console.log("hello")

    function showPosition(position: GeolocationPosition) {
      // console.log(process.env.NEXTAUTH_SECRET)
      axios.get(`/api/get-address/?lat=${position.coords.latitude}&lng=${position.coords.longitude}`)
      .then((res) => {
        // console.log(res.data)
        setAddressName(res.data.data.results[0].formatted_address)
      }).catch((err) => {
        console.log(err)
      })
      // console.log(position, "pos");
    }
    // showPosition()
  }, []);

  return (
    <div className=" h-[70px] z-100 w-full top-0 flex justify-between items-center px-2 py-5 text-black font-bold text-xl border-b-2 border-black/10 bg-white">
        <div className="ml-2 w-[80%]" onClick={() => {
          router.push("/address")
        }}>
          <div className="flex items-end">{title}</div>
          <div className="text-sm text-black/60 flex items-end gap-1">
            <p className=" whitespace-nowrap line-clamp-1 overflow-hidden">
              {addressName}
            </p>
            <IoIosArrowDown className="mb-[2px]" />
          </div>
        </div>
        {Icon}
    </div>
  );
}
