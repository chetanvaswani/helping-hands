"use client"
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { currentAddressAtom } from "@/store/atoms/currentAddressAtom";
import { addressesAtom } from "@/store/atoms/addressesAtom";
import { haversineDistance } from "@/utils/findDistance";
import Button from "@/components/Button";
import Modal from "@/components/Modal";

export default function AddressDisplay(){
    const [addressName, setAddressName] = useState("Looking up your address...");
    const [currentAddressState, setCurrentAddressState] = useRecoilState(currentAddressAtom);
    const [addresses, setAddresses] = useRecoilState(addressesAtom);
    const [getPermissionModal, setGetPermissionModal] = useState(false);
    console.log(currentAddressState, addresses)
  
    function isIOSSafari() {
      const ua = navigator.userAgent;
      console.log(ua)
      const isIOS = /iPhone|iPad|iPod/.test(ua);
      const isSafari = /^((?!CriOS).)*Safari/.test(ua);
      return isIOS && isSafari;
    }
  
    useEffect(() => {
      if (addresses === null){
        axios.get("/api/v1/addresses").then((res) => {
          if (res.data.data.addresses.length > 0){
            setAddresses(res.data.data.addresses)
          } else {
            setAddresses([] as any)
          }
        }).catch(() => {
          setAddresses([] as any)
        })
      }

      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === "prompt") {
          setAddressName("Location Premission Denied")
          console.log("prompt")
        } else if (result.state === "denied") {
          setAddressName("Location Premission denied")
          console.log("denied")
        }
      });
      const usingSafari = isIOSSafari()
      // console.log(navigator.geolocation)
      if (usingSafari){
        setGetPermissionModal(true)
      } else {
        navigator.geolocation.getCurrentPosition(showPosition);
      }
      // console.log("hello")
    }, []);
  
    const showPosition = useCallback((position: GeolocationPosition) => {
      if (!currentAddressState){
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
      } else {
        const distance = haversineDistance([position.coords.latitude, position.coords.longitude], [Number(currentAddressState.latitude), Number(currentAddressState.longitude)])
        if (distance < 10){
            setAddressName(currentAddressState.address)
        }
      }
    }, [currentAddressState])

    return (
        <div>
            {
                getPermissionModal ? 
                <Modal title="Allow Loction access" open={getPermissionModal} setOpen={(setGetPermissionModal)}>
                    <div className="flex w-full gap-5 py-5">
                        <div className="w-[50%] flex flex-col">
                            <Button text="Allow" variant="dark" onClick={() => {

                            }}/>
                        </div>
                        <div className="w-[50%] flex flex-col border-1 border-gray-100 rounded-lg">
                            <Button text="Deny" variant="light" onClick={() => {
                            setAddressName("Location access Denied")
                            setGetPermissionModal(false)
                            }}/>
                        </div>
                    </div>
                </Modal> : false
            }
            <p className="max-w-full line-clamp-1 overflow-hidden">
              {addressName}
            </p>
        </div>
    )
}