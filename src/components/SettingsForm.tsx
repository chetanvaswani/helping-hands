"use client"
import Button from "@/components/Button";
import { TbLogout2 } from "react-icons/tb";
import { MdModeEdit } from "react-icons/md";
import { IoIosAdd } from "react-icons/io";
import { useSession, signOut } from "next-auth/react"
import axios from "axios";
import { useEffect, useState,useRef, Dispatch } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { GiConfirmed } from "react-icons/gi";
import Loader from "./RingLoader";


export default function SettingsForm({UserProp}){
    const router = useRouter()
    const session = useSession();
    const [user, setUser] = useState(UserProp)

    return (
        <>
        <div className="w-full p-2 flex items-center gap-3 border-b-1 border-gray-600 pb-3 ">
            <FaArrowLeftLong className="size-4 stroke-0 text-gray-900 cursor-pointer" onClick={() => {
                router.back()
            }} />
            <div className="font-bold text-xl">
                Account Settings
            </div>
        </div>
        <div className="w-full h-full bg-gray-100">
            <div className="w-full h-full">
                <div className="my-5 w-full gap-5 h-full flex flex-col items-center font-medium rounded-lg">
                    <Field name="name" value={user.name == "User" ? null : user.name} absenceString="Add your name now" setUser={setUser} user={user} />
                    <div className="w-full flex flex-col items-center">
                        <div className="w-[90%] font-semibold px-1 text-lg">
                            Mobile Number:
                        </div>
                        <div className="w-[90%] justify-between gap-[5px] px-3 font-semibold rounded-md bg-white h-[50px] items-center flex">
                            <div className=" w-full">
                                +91 { user.mobileNumber }
                            </div>
                        </div>
                    </div>
                    <Field name="email" value={user.email} absenceString="Add your email now" setUser={setUser} user={user} />
                    {
                        session.status === "authenticated" ?
                        <div className=" w-[90%] mt-5 flex flex-col">
                            <Button text="Logout" variant="dark" startIcon={<TbLogout2 className="size-5" />} onClick={() => {
                                signOut({ callbackUrl: window.location.href.replace("settings", "signin") });
                            }} />
                        </div>
                        : false
                    }
                </div>
            </div>
        </div>
        </>
    )
}

interface fieldProps{
    name: string,
    value: string | null,
    absenceString: string,
    setUser: Dispatch<any>,
    user: any
}

function Field({name, value, absenceString, setUser, user} : fieldProps){
    const [inputActive, setInputActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const valueDivRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(false)
    const [err, setErr] = useState("")

    useEffect(() => {
        if(inputActive){
            if (value && inputRef.current){
                inputRef.current.setAttribute('value', value);
            }
            inputRef.current?.focus()
        } else {
            // console.log(err)
            if (valueDivRef.current && err !== ""){
                const curr = valueDivRef.current.innerHTML
                valueDivRef.current.innerHTML = err
                setTimeout(() => {
                    if (valueDivRef.current){
                        valueDivRef.current.innerHTML = curr
                        setErr("")
                    }
                }, 1000)
            }
        }
    }, [inputActive, value, err])

    const handleSubmit = () => {
        if (inputRef.current && (inputRef.current.value).trim() === ""){
            setInputActive(false)
        } else if (inputRef.current && inputRef.current.value){
            // console.log(inputRef.current.value)
            if (inputRef.current.value === value){
                setInputActive(false)
                return
            }
            setLoading(true)
            const updatedUser = {
                ...user,
                [name]: (inputRef.current?.value).toLowerCase()
            }
            // console.log(updatedUser)
            axios.put("/api/v1/user", {
                ...updatedUser
            }).then((res) => {
                console.log(res)
                setUser(updatedUser)
                setInputActive(false)
                setLoading(false)
            }).catch((err) => {
                // console.log(err.response.data.data.error[0].message)
                if (err.status === 400){
                    setErr(err.response.data.data.error[0].message)
                } else if (err.status === 403){
                    setErr(err.response.data.data.msg)
                }
                setInputActive(false)
                setLoading(false)
                // console.log(valueDivRef.current)
            })
        }
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="w-[90%] font-semibold px-1 text-lg">
                {name}:
            </div>
            <div className="w-[90%] justify-between gap-[5px] px-3 font-semibold rounded-md bg-white h-[50px] items-center flex">
                <div className=" w-full">
                    {
                        inputActive ? <input className="w-full outline-0" placeholder={`Please enter your ${name}`} ref={inputRef} type="text"  /> : 
                        value ? <div ref={valueDivRef}> {value} </div> : <div ref={valueDivRef} className="text-gray-500">{absenceString}</div>
                    }
                </div>
                <div className=" cursor-pointer">
                    {
                        inputActive ? loading? <Loader /> : <GiConfirmed className="size-6" onClick={handleSubmit} /> : 
                        value ? <MdModeEdit className="size-5" onClick={() => {
                            setInputActive(true)
                        }} />
                        : <IoIosAdd className="size-7" onClick={() => {
                            if(!value){
                                setInputActive(true)
                            }
                        }}/>
                    }
                </div>
            </div>
        </div>
    )
}