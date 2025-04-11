"use client"
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AddressDetailsForm from "@/components/AddressDetailsForm";
import { editAddressAtom } from "@/store/atoms/addressAtoms";
import { useRecoilState } from "recoil";
import { FaArrowLeftLong } from "react-icons/fa6";

export default function EditAddress(){
    const router = useRouter();
    const mapRef = useRef<any>(null);
    const [editAddressState, setEditAddressState] = useRecoilState(editAddressAtom)

    useEffect(() => {
        if (editAddressState === null){
            router.push("/address")
        }
    }, [editAddressState])

    useEffect(() => {
        async function loadMap() {
            const olaMapsModule = await import("olamaps-web-sdk");
            const { OlaMaps } = olaMapsModule;
          
            const olaMaps = new OlaMaps({
              // @ts-expect-error api key can be null
              apiKey: process.env.NEXT_PUBLIC_OLA_API_KEY,
              requestHeaders: {
                origin: process.env.NEXT_PUBLIC_OLA_REQ_ORIGIN,
              },
            });
            const myMap = olaMaps.init({
              style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard-mr/style.json",
              container: "map",
              // add lat, lng here
              center: [editAddressState?.longitude, editAddressState?.latitude],
              zoom: 16,
            });
            mapRef.current = myMap;
      
            olaMaps.addMarker({
                offset: [0, 6],
                anchor: "bottom",
                color: "red",
                draggable: false, 
                className: "custom-marker",
              })
              .setLngLat(myMap.getCenter())
              .addTo(myMap);

            mapRef.current.dragPan.disable();
            mapRef.current.scrollZoom.disable();
            mapRef.current.doubleClickZoom.disable();
            mapRef.current.keyboard.disable();
            mapRef.current.touchZoomRotate.disable();
        }

        if (editAddressState){
            loadMap();
        }
    })

    return (
        <div className="h-svh overflow-hidden w-full flex flex-col bg-white">
            <div className="h-[50px] px-3 flex items-center justify-center w-full z-100 bg-white shadow-md">
                <h1 className="font-bold text-xl">Edit Address</h1>
                <FaArrowLeftLong className="size-5 text-gray-800 absolute left-[20px]" onClick={() => {
                    setEditAddressState(null)
                }} />
            </div>
            <div id="map" className={`w-full h-[40%] flex flex-col items-center`}>
            </div>
            {
                editAddressState ?
                <AddressDetailsForm setDetailsFormOpen={() => {}} coords={{
                    lat : editAddressState.latitude,
                    lng : editAddressState.longitude
                }} 
                address={editAddressState}
                formType="edit"
                /> : false
            }
        </div>
    )
}