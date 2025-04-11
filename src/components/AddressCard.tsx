"use client"
import { GoHome } from "react-icons/go";
import { SlOptionsVertical } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { PiBuildingOffice } from "react-icons/pi";
import { useRecoilState, useSetRecoilState } from "recoil";
import { selectedAddressAtom, addressesAtom, editAddressAtom } from "@/store/atoms/addressAtoms";
import { toTitleCase } from "@/utils/toTitleCase";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import Modal from "@/components/Modal";
import { useState } from "react";
import Button from "@/components/Button";
import axios from "axios";
import Loader from "@/components/RingLoader";
import { useRouter } from "next/navigation";


interface AddressCardInterface{
    name: string,
    type: "home" | "work" | "other",
    address: string,
    currDistance?: string,
    longitude?: string,
    latitude?: string,
    id: number
}

export default function AddressCard({name, type, address, currDistance, id} : AddressCardInterface){
    const router = useRouter()
    const [actionsModalOpen, setActionsModalOpen] = useState(false);
    const [deleteConfirmationMoal, setDeleteConfirmationModal] = useState(false);
    const [savedAddresses, setSavedAddresses] = useRecoilState(addressesAtom);
    const [actionState, setActionState] = useState<"delete"| "edit" | null>(null);
    const [deleteBtnText, setDeleteBtnText] = useState("Yes");
    const [selectedAddressState, setSelectedAddressState] = useRecoilState(selectedAddressAtom);
    const setEditAddressState = useSetRecoilState(editAddressAtom)

    const deleteAddressConfirmation = () => {
        setActionsModalOpen(false)
        setDeleteConfirmationModal(true)
    }

    const deleteAddress = () => {
        setActionState("delete");
        setDeleteBtnText("Deleting address");
        axios.delete("/api/v1/address", {
            data: { id: id }
        }).then((res) => {
            console.log(res)
            if(res.data.status === "success" && savedAddresses){
                setSavedAddresses((savedAddresses as any).filter((address => address.id !== id)))
                if(selectedAddressState?.id === id){
                    setSelectedAddressState(null)
                }
                setDeleteBtnText("Yes");
                setActionState(null);
                setDeleteConfirmationModal(false);
            }
        }).catch((err) => {
            console.log(err)
            setDeleteBtnText("Yes");
            setActionState(null);
            setDeleteConfirmationModal(false);
        })
    }

    const changeSelectedAddress = () => {
        console.log((savedAddresses as any).find((address) => address.id === id));
        setSelectedAddressState((savedAddresses as any).find((address) => address.id === id));
        router.back();
    }

    return (
        <div className="w-full shadow-md p-5 gap-3 flex justify-evenly items-start rounded-lg h-fit bg-white" onClick={() => {

        }}>
            <div className="flex flex-col gap-1 items-center" onClick={changeSelectedAddress}>
                {
                    type === "home" ? 
                    <GoHome className="size-5 text-gray-600" />
                    : type === "work" ? 
                    <PiBuildingOffice className="size-5 text-gray-600" /> :
                    <IoLocationOutline className="size-5 text-gray-600" />
                }
                {
                        currDistance && Number(currDistance) < 10 ? 
                        <span className="text-xs text-gray-400">(0m)</span> : 
                        currDistance && Number(currDistance) < 1000 ? 
                        <span className="text-xs text-gray-400">({Number(currDistance).toFixed(0)}m)</span> : 
                        currDistance && Number(currDistance) < 10000 ? 
                        <span className="text-xs text-gray-400">({(Number(currDistance)/1000).toFixed(1)}km)</span> :
                        currDistance && Number(currDistance) > 10000 ? 
                        <span className="text-xs text-gray-400">({(Number(currDistance)/1000).toFixed(0)}km)</span>
                        : false
                }
            </div>
            <div className="w-[80%] flex flex-col -mt-1" onClick={changeSelectedAddress}>
                <div className="font-semibold gap-1 items-center flex text-base">
                    <span>{toTitleCase(name)}</span>
                    {
                        selectedAddressState && selectedAddressState.id === id ? 
                        <span className="bg-black text-white mt-[1px] rounded-md text-[8px] py-[1px] px-1">Selected Address</span>
                        : false
                    }
                </div>
                <div className="text-sm">
                    {address}
                </div>
            </div>
            <div className="w-[10%] flex flex-col gap-2 text-gray-500 items-end">
                <SlOptionsVertical className="mt-1 cursor-pointer" onClick={() => {
                    setActionsModalOpen(true)
                }} />
            </div>
            <Modal title="Select an action" open={actionsModalOpen} setOpen={setActionsModalOpen}>
                <div className="flex flex-col gap-3 mt-7 mb-3 w-full">
                    <div className="flex flex-col w-full">
                        <Button variant="dark" text="Delete Address" disabled={actionState !== null} startIcon={<RiDeleteBin6Line className="size-5" />} onClick={deleteAddressConfirmation} />
                    </div>
                    <div className="flex flex-col w-full border-1 border-gray-200 rounded-lg">
                        <Button variant="light" text="Edit Address" disabled={actionState !== null} startIcon={<FaRegEdit className="size-5" />} onClick={() => {
                            const address = (savedAddresses as any).find((address) => address.id == id)
                            setEditAddressState(address)
                            router.push('/address/edit')
                        }} />
                    </div>
                </div>
            </Modal>
            <Modal title="Are you sure you want to delete this address?" open={deleteConfirmationMoal} setOpen={setDeleteConfirmationModal}>
                <div className="flex flex-col gap-3 mt-7 mb-3 w-full">
                    <div className="flex flex-col w-full">
                        <Button variant="dark" text={deleteBtnText} disabled={actionState !== null} startIcon={actionState === "delete"? <Loader />  : null} onClick={deleteAddress} />
                    </div>
                    <div className="flex flex-col w-full border-1 border-gray-200 rounded-lg">
                        <Button variant="light" text="No" disabled={actionState !== null} onClick={() => {
                            setDeleteConfirmationModal(false)
                            setActionsModalOpen(true)
                        }} />
                    </div>
                </div>
            </Modal>
        </div>
    )
}