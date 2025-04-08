"use client"
import { ReactElement, useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useRecoilState } from "recoil";
import { currentAddressAtom } from "@/store/atoms/currentAddressAtom";
import { haversineDistance } from "@/utils/findDistance";

interface LocationSelectorInterface{
    title: string,
    subTitle: string,
    Icon?: ReactElement
}

export default function LocationSelector( {title, Icon }: LocationSelectorInterface) {
  const router = useRouter();
  const [addressName, setAddressName] = useState("Looking up your address...");
  const [currentAddressState, setCurrentAddressState] = useRecoilState(currentAddressAtom);

  useEffect(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === "prompt") {
        setAddressName("Location Premission Denied")
        console.log("prompt")
      } else if (result.state === "denied") {
        setAddressName("Location Premission denied")
        console.log("denied")
      }
    });
    // console.log(navigator.geolocation)
    navigator.geolocation.getCurrentPosition(showPosition);
    // console.log("hello")

    function showPosition(position: GeolocationPosition) {
      if (currentAddressState){
        const distance = haversineDistance([position.coords.latitude, position.coords.longitude], [Number(currentAddressState.latitude), Number(currentAddressState.longitude)])
        if (distance < 10){
          // console.log(distance)
          setAddressName(currentAddressState.address)
          return
        }
      }

      // console.log("search starting")

      const params = new URLSearchParams();
      params.append("latlng", `${position.coords.latitude},${position.coords.longitude}`);
      params.append("api_key", process.env.NEXT_PUBLIC_OLA_API_KEY || "");
      const queryString = params.toString();
      const url = `${process.env.NEXT_PUBLIC_REVERSE_GEOCODE_URL}?${queryString}`;
      // console.log(url)
      axios.get(url, {
        // headers: {
        //   "origin": process.env.NEXT_PUBLIC_OLA_REQ_ORIGIN
        // }
      }).then((res) => {
        setCurrentAddressState({
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
          address: res.data.results[0].formatted_address
        })
        setAddressName(res.data.results[0].formatted_address)
        // console.log(res)
      }).catch(() => {
        // console.log(err)
        setAddressName("error while looking up your address")
      // console.log(position, "pos");
      })

      
    }
  }, []);

  return (
    <div className="z-[1000] h-[70px] w-full top-0 flex justify-between items-center px-2 py-5 text-black font-bold text-xl border-b-2 border-black/10 bg-white">
        <div className="ml-2 w-[80%]" onClick={() => {
          router.push("/address")
        }}>
          <div className="flex items-end">{title}</div>
          <div className="text-sm text-black/60 flex items-end gap-1">
            <p className="whitespace-nowrap line-clamp-1 overflow-hidden">
              {addressName}
            </p>
            <IoIosArrowDown className="mb-[2px]" />
          </div>
        </div>
        {Icon}
    </div>
  );
}
