import React, { useState } from "react";
import { useRecoilState } from "recoil";
import {currentAddressAtom} from "../store/atoms/addressAtoms";
import { addressesAtom } from "@/store/atoms/addressAtoms";
import { selectedAddressAtom } from "@/store/atoms/addressAtoms";
import { locationAccessAtom } from "@/store/atoms/addressAtoms";
import { haversineDistance } from "@/utils/findDistance";
import axios from "axios";
import { useCallback, useEffect } from "react";

export default function LocationPermissionModal(){
    const [currentAddressState, setCurrentAddressState] = useRecoilState(currentAddressAtom);
    const [savedAddresses, setSavedAddresses] = useRecoilState(addressesAtom);
    const [locationAccessState, setLocationAccessState] = useRecoilState(locationAccessAtom);
    const [selectedAddressState, setSelectedAddressState] = useRecoilState(selectedAddressAtom);
    const [open, setOpen] = useState(locationAccessState.prompt);


    useEffect(() => {
        setLocationAccessState(prev => ({
            ...prev,
            prompt: open
        }));
    }, [open])

    const showPosition = useCallback((position: GeolocationPosition) => {
        console.log(position)
        if (!currentAddressState){
            const params = new URLSearchParams();
            params.append("latlng", `${position.coords.latitude},${position.coords.longitude}`);
            params.append("api_key", process.env.NEXT_PUBLIC_OLA_API_KEY || "");
            const queryString = params.toString();
            const url = `${process.env.NEXT_PUBLIC_REVERSE_GEOCODE_URL}?${queryString}`;
            axios.get(url, {
                }).then((res) => {
                    setCurrentAddressState({
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString(),
                        address: res.data.results[0].formatted_address
                    })
                }).catch(() => {
                    setOpen(false)
                }) 
        } else {
          const distance = haversineDistance([position.coords.latitude, position.coords.longitude], [Number(currentAddressState.latitude), Number(currentAddressState.longitude)])
          if (distance < 10){
            //   setAddressName(currentAddressState.address)
          }
        }
      }, [currentAddressState])
    
      useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => {
                showPosition(position)
                setLocationAccessState({
                    access: true,
                    prompt: false
                })
            },
            (error) => {
                console.error("Error in getCurrentPosition", error);
                alert(error.message);
                setLocationAccessState({
                    access: false,
                    prompt: false
                })
            },
            {
                enableHighAccuracy: true, 
                timeout: 10000,
                maximumAge: 0
            }
        );
      }, [open, currentAddressState])

      useEffect(() => {
        console.log("before", currentAddressState, savedAddresses)
        if (currentAddressState && (savedAddresses as any)?.length > 0 && selectedAddressState === null){
            (savedAddresses as any).map((address) => {
                const distance = haversineDistance([address.latitude, address.longitude], [Number(currentAddressState.latitude), Number(currentAddressState.longitude)])
                if (distance < 20){
                    setSelectedAddressState(address)
                }
            })
        }
        console.log("after", currentAddressState, savedAddresses)
    }, [savedAddresses, currentAddressState])


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
    }, [])


    return (
        // <Modal title="Grant access to your current location" open={open} setOpen={(setOpen)}>
        //     <div className="flex flex-col w-full gap-3 mt-5 mb-3">
        //         <div className="w-full flex flex-col">
        //             <Button text="Allow" variant="dark" onClick={() => {
        //                 navigator.geolocation.getCurrentPosition(
        //                     (position: GeolocationPosition) => {
        //                         showPosition(position)
        //                         setLocationAccessState({
        //                             access: true,
        //                             prompt: false
        //                         })
        //                     },
        //                     (error) => {
        //                         console.error("Error in getCurrentPosition", error);
        //                         alert(error.message);
        //                         setLocationAccessState({
        //                             access: false,
        //                             prompt: false
        //                         })
        //                         // setAddressName(`Error: ${error.message}`);
        //                     },
        //                     {
        //                         enableHighAccuracy: true, 
        //                         timeout: 10000,
        //                         maximumAge: 0
        //                     }
        //                 );
        //             }}/>
        //         </div>
        //         <div className="w-full flex flex-col border-1 border-gray-200 rounded-lg">
        //             <Button text="Deny" variant="light" onClick={() => {
        //                 // setAddressName("Location access Denied")
        //                 setCurrentAddressState(null);
        //                 setLocationAccessState({
        //                     access: false,
        //                     prompt: false
        //                 })
        //             }}/>
        //         </div>
        //     </div>
        // </Modal> 
        <>
        </>
    )
}