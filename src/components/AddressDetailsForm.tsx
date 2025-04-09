"use client"

import React from "react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useRecoilState } from "recoil";
import { addressesAtom } from "@/store/atoms/addressesAtom";

import Button from "./Button"
import Loader from "./RingLoader";
import {toTitleCase} from "../utils/toTitleCase";

import { RiArrowDownWideFill } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import { PiBuildingOffice } from "react-icons/pi";

export default function AddressDetailsForm({setDetailsFormOpen, coords}){
    const router = useRouter();
    const [type, setType] = useState(null);
    const alerDivtRef = useRef<HTMLInputElement | null>(null);
    const [addressDetails, setAddressDetails] = useState({
      address: "",
      type: type,
      latitude: coords.lat,
      longitude: coords.lng,
      name: "",
    });
    const [landmark, setLandmark] = useState("");
    const [loading, setLoading] = useState(false);
    const [ btnText, setBtnText ] = useState("Save Address");
    const [savedAddresses, setSavedAddresses] = useRecoilState(addressesAtom);
    // console.log(savedAddresses)

    // console.log(addressDetails)
  
    useEffect(() => {
      setAddressDetails({
        ...addressDetails,
        type
      })
    }, [type])

    const clearAlertDiv = () => {
        setTimeout(() => {
            if (alerDivtRef.current){
                alerDivtRef.current.innerText = ""
            }
        }, 1500)
    }

    async function submitAddress() {
        if (addressDetails.address === "" && alerDivtRef.current){
            alerDivtRef.current.innerHTML = "Please enter your address";
            clearAlertDiv();
        } else if (addressDetails.type === null && alerDivtRef.current){
            alerDivtRef.current.innerHTML = "Please select an address type";
            clearAlertDiv();
        } else if (addressDetails.type === "other" && addressDetails.name === "" && alerDivtRef.current){
            alerDivtRef.current.innerHTML = "Please enter a name for your address";
            clearAlertDiv();
        } else {
            setLoading(true);
            setBtnText("Saving your address...");
            if (landmark !== ""){
              await setAddressDetails({
                ...addressDetails,
                address: addressDetails.address + landmark
              })
            }
            console.log(addressDetails)
            axios.post("/api/v1/address", addressDetails, {
              headers: { "Content-Type": "application/json" },
            }).then((res) => {
                console.log(res)
                if (savedAddresses !==  null){
                  setSavedAddresses([
                    ...savedAddresses,
                    res.data.data
                  ]as any)
                } else {
                  setSavedAddresses([ res.data.data ] as any)
                }
                setTimeout(() => {
                  router.back()
                }, 500)
                if (alerDivtRef.current){
                  alerDivtRef.current.innerHTML = "Address Saved Successfully!"
                }
                setBtnText("Success!");
                clearAlertDiv()
            }).catch((err) => {
                console.log(err)
                if (alerDivtRef.current){
                  alerDivtRef.current.innerHTML = "Error saving address. Please try again!"
                }
                clearAlertDiv();
                setLoading(false);
                setBtnText("Save Address");
            })
        }

    }
  
  
    return (
      <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "tween", duration: 0.3 }}
      className="h-[65%] fixed bottom-0 bg-gray-100 left-[1%] gap-5 rounded-lg z-100 overflow-hidden w-[98%] flex flex-col items-center cursor-pointer">
        <div className="h-[50px] px-3 flex items-center border-b-1 border-gray-200 shadow-sm bg-white gap-2 justify-start w-full z-100 " onClick={() => {
              setDetailsFormOpen(false)
            }}>
            <h1 className="font-bold text-xl">Add Address Details</h1>
            <RiArrowDownWideFill className="size-5 text-gray-800 stroke-1 mt-[2px]" />
        </div>
        <div className="w-[95%] flex gap-3">
            <AddressType selected={type} setSelected={setType} name="home" icon={<GoHome />} />
            <AddressType selected={type} setSelected={setType} name="work" icon={<PiBuildingOffice />} />
            <AddressType selected={type} setSelected={setType} name="other" icon={<IoLocationOutline />} />
        </div>
        {
          type === "other" ? 
          <div className="w-[95%] flex gap-3">
            <input type="text" className="w-full h-[55px] bg-white outline-0 shadow-lg rounded-lg p-2 " placeholder="Save address as" onChange={(e) => {
                setAddressDetails({
                    ...addressDetails,
                    name: e.target.value
                })
            }} />
          </div> : false
        }
        <div className="w-[95%] flex gap-3">
            <input type="text" className="w-full h-[55px] bg-white outline-0 shadow-lg rounded-lg p-2 " placeholder="Enter complete address" onChange={(e) => {
                setAddressDetails({
                    ...addressDetails,
                    address: e.target.value
                })
            }} />
        </div>
        <div className="w-[95%] flex gap-3">
            <input type="text" className="w-full h-[55px] bg-white outline-0 shadow-lg rounded-lg p-2 " placeholder="Floor/Landmark (optional)" onChange={(e) => {
                setLandmark(e.target.value)
            }} />
        </div>
        <div className="text-center w-[90%] text-gray-400 text-sm font-semibold" ref={alerDivtRef}></div>
        <div className="flex flex-col shadow-md w-[95%]">
          <Button text={btnText} variant="dark" startIcon={loading ? <Loader /> : null} disabled={loading} onClick={() =>{
            submitAddress()
          }} />
        </div>
      </motion.div>
    )
  }
  
  function AddressType({name, icon, selected, setSelected}){
    return (
      <div 
      className={`flex justify-center bg-white px-2 gap-1 shadow-md py-1 items-center border-1 rounded-lg ${selected === name ? "text-black border-black": "border-gray-200"} `}
      onClick={() => {
        setSelected(name)
      }}>
        <span>{icon}</span>
        <span>{toTitleCase(name)}</span>
      </div>
    )
}