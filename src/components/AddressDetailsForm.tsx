"use client"

import React, { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useRecoilState } from "recoil";
import { addressesAtom } from "@/store/atoms/addressAtoms";

import Button from "./Button"
import Loader from "./RingLoader";
import {toTitleCase} from "../utils/toTitleCase";

import { RiArrowDownWideFill } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import { PiBuildingOffice } from "react-icons/pi";
import { Address } from "@/schemas/AddressSchema";

interface AddressDetailsFormInterface{
  setDetailsFormOpen: Dispatch<SetStateAction<boolean>> | null,
  coords: {
    lat: number | string,
    lng: number | string
  },
  formType?: string,
  address? : Address
}


export default function AddressDetailsForm({setDetailsFormOpen, coords, address, formType="add"}: AddressDetailsFormInterface){
    const router = useRouter();
    const [type, setType] = useState(address ? address.type : null);
    const alerDivtRef = useRef<HTMLInputElement | null>(null);
    const [addressDetails, setAddressDetails] = useState({
      address: address?.address || "",
      type: address?.type || type,
      latitude: coords.lat,
      longitude: coords.lng,
      name: address?.name || "",
    });
    const [landmark, setLandmark] = useState("");
    const [loading, setLoading] = useState(false);
    const [ btnText, setBtnText ] = useState(`${formType === "add"? "Save Address": "Edit Address"}`);
    const [savedAddresses, setSavedAddresses] = useRecoilState(addressesAtom);
    // console.log(savedAddresses)
  
    useEffect(() => {
      // console.log(address)
      // console.log(addressDetails)
      if (address){
        setAddressDetails({
          ...addressDetails,
          type,
        })
      } else {
        if (type === "other" ){
          setAddressDetails({
            ...addressDetails,
            type,
            name: ""
          })
        } else {
          setAddressDetails({
            ...addressDetails,
            type,
            name: (type as any)
          })
        }
      }


    }, [type])

    const clearAlertDiv = () => {
        setTimeout(() => {
            if (alerDivtRef.current){
                alerDivtRef.current.innerText = ""
            }
        }, 1500)
    }

    function checksBeforeSubmit(){
      if (addressDetails.address === "" && alerDivtRef.current){
        alerDivtRef.current.innerHTML = "Please enter your address";
        clearAlertDiv();
        return false
      } else if (addressDetails.type === null && alerDivtRef.current){
          alerDivtRef.current.innerHTML = "Please select an address type";
          clearAlertDiv();
          return false
      } else if (addressDetails.type === "other" && addressDetails.name === "" && alerDivtRef.current){
          alerDivtRef.current.innerHTML = "Please enter a name for your address";
          clearAlertDiv();
          return false
      }
      return true
    }

    async function submitAddress() {
      if(checksBeforeSubmit()){
        setLoading(true);
        setBtnText("Saving your address...");
        if (landmark !== ""){
          await setAddressDetails({
            ...addressDetails,
            address: addressDetails.address + landmark
          })
        }
        // console.log(addressDetails)
        axios.post("/api/v1/address", addressDetails, {
          headers: { "Content-Type": "application/json" },
        }).then((res) => {
            // console.log(res)
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
        }).catch(() => {
            // console.log(err)
            if (alerDivtRef.current){
              alerDivtRef.current.innerHTML = "Error saving address. Please try again!"
            }
            clearAlertDiv();
            setLoading(false);
            setBtnText("Save Address");
        })
      }
    }

    async function editAddress(){
      if(checksBeforeSubmit()){
        checksBeforeSubmit()
        setLoading(true);
        setBtnText("Editing your address...");
        if (landmark !== ""){
          await setAddressDetails({
            ...addressDetails,
            address: addressDetails.address + landmark
          })
        }
        axios.put("/api/v1/address", {
          id: address?.id,
          name: addressDetails.name,
          type: addressDetails.type,
          address: addressDetails.address
        }, {
          headers: { "Content-Type": "application/json" },
        }).then((res) => {
            // console.log(res)
            const updatedAddress = res.data.data;
            setSavedAddresses((prevAddresses) =>
              (prevAddresses as any).map((prev) =>
                prev.id === updatedAddress.id ? updatedAddress : prev
              )
            );
            setTimeout(() => {
              router.back()
            }, 500)
            if (alerDivtRef.current){
              alerDivtRef.current.innerHTML = "Edited Address Successfully!"
            }
            setBtnText("Success!");
            clearAlertDiv()
        }).catch(() => {
            // console.log(err)
            if (alerDivtRef.current){
              alerDivtRef.current.innerHTML = "Error editing address. Please try again!"
            }
            clearAlertDiv();
            setLoading(false);
            setBtnText("Edit Address");
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
            if (setDetailsFormOpen){
              setDetailsFormOpen(false)
            }
          }}>
            <h1 className="font-bold text-xl">
              {
                formType === "add" ? "Add Address Details" : "Edit Address Details"
              }
            </h1>
            {
              formType === "add" ? 
                <RiArrowDownWideFill className="size-5 text-gray-800 stroke-1 mt-[2px]" />
              : false
            }
        </div>
        <div className="w-[95%] flex gap-3">
            <AddressType selected={type} setSelected={setType} name="home" icon={<GoHome />} />
            <AddressType selected={type} setSelected={setType} name="work" icon={<PiBuildingOffice />} />
            <AddressType selected={type} setSelected={setType} name="other" icon={<IoLocationOutline />} />
        </div>
        {
          type === "other" ? 
          <div className="w-[95%] flex gap-3">
            <input type="text" className="w-full h-[55px] bg-white outline-0 shadow-lg rounded-lg p-2 " value={addressDetails.name} placeholder="Save address as" onChange={(e) => {
                setAddressDetails({
                    ...addressDetails,
                    name: e.target.value
                })
            }} />
          </div> : false
        }
        <div className="w-[95%] flex gap-3">
            <input type="text" className="w-full h-[55px] bg-white outline-0 shadow-lg rounded-lg p-2 " value={addressDetails.address} placeholder="Enter complete address" onChange={(e) => {
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
            if (formType === "add"){
              submitAddress()
            } else if (formType === "edit"){
              editAddress()
            }
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