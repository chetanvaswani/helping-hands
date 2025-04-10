"use client"
import { CiMobile1 } from "react-icons/ci";
import Button from "@/components/Button";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import React from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "./RingLoader";

export default function SigninBox(){
    const MobNumRegex : RegExp = /^[6-9]\d{9}$/;
    const OtpRegex: RegExp = /\d{6}$/;
    const [otpSent, setOtpSent] = useState(false);
    const [mobNum, setMobNum] = useState<string>("");
    const [otp, setOtp] = useState("");
    const [disabled, setDisabled] = useState(false);
    const alerDivtRef = useRef<HTMLInputElement | null>(null);
    const [btnText, setBtnText] = useState("Get-Otp");
    const router = useRouter();

    const clearAlertDiv = () => {
        setTimeout(() => {
            if (alerDivtRef.current){
                alerDivtRef.current.innerText = ""
            }
        }, 1500)
    }

    const handleOtpSend = () =>{
        if (!(MobNumRegex.test(mobNum)) && alerDivtRef.current){
            alerDivtRef.current.innerText = "Invalid Mobile Number!"
            clearAlertDiv();
            return
        }
        setDisabled(true)
        setBtnText("Sending Otp...")
        axios.post("/api/send-otp", {
            mobNum: mobNum
        }).then(() => {
            if (alerDivtRef.current){
                alerDivtRef.current.innerText = "Otp sent successfully!"
                clearAlertDiv();
            }
            setOtpSent(true)
            setDisabled(false)
            setBtnText("Sign In")
        }).catch((err) => {
            console.log(err)
            if (alerDivtRef.current){
                alerDivtRef.current.innerText = "Error Occured please try again!"
                clearAlertDiv();
            }
            setBtnText("Get-Otp")
            setDisabled(false)
        })

    }

    const handleLogin = async () => {
        if (!(MobNumRegex.test(mobNum)) && alerDivtRef.current){
            alerDivtRef.current.innerText = "Invalid Mobile Number!"
            clearAlertDiv();
            return
        }
        if (!(OtpRegex.test(otp)) && alerDivtRef.current) {
            alerDivtRef.current.innerText = "Enter a valid 6 digit otp!"
            clearAlertDiv();
            return
        }
        setDisabled(true)
        setBtnText("Processing sign in request...")
        const result = await signIn("credentials", {
          redirect: false,
          mobNum,
          otp,
        });
        if (result?.error) {
          if (alerDivtRef.current){
            alerDivtRef.current.innerText = result.error
            clearAlertDiv();
          }
          setDisabled(false);
          setBtnText("Sign In");
        } else {
          if (alerDivtRef.current){
            alerDivtRef.current.innerText = "Login Successful redirecting you to the homepage."
            clearAlertDiv();
          }
          router.push("/home");
        }
      };

    return (
        <div className=" max-w-[550px] w-[90%] p-5 rounded-lg bg-white flex flex-col items-center gap-4">
            <div className=" w-full text-center m-2">
                <h1 className="font-semibold text-xl">Enter your mobile number</h1>
            </div>
            <div className=" gap-2 w-full flex justify-between rounded-lg items-center ">
                <div className=" gap-3 w-full rounded-lg p-3 bg-white flex justify-between border-1 border-gray-100 shadow-md h-[50px] items-center ">
                    <CiMobile1 className="size-7 text-gray-500" />
                    <p>+91</p>
                    <input className=" w-full bg-white outline-0 " minLength={10} maxLength={10} type="tel" inputMode="numeric" placeholder="Mobile Number" onChange={(e) => {
                        setMobNum(e.target.value)
                    }} />
                </div>
            </div>
            {
                otpSent ?
                <div className=" gap-2 w-full flex justify-between rounded-lg items-center ">
                    <div className=" gap-3 w-full rounded-lg p-3 bg-white flex justify-between border-1 border-gray-100 shadow-md h-[50px] items-center ">
                        <input className=" w-full bg-white outline-0 " minLength={6} inputMode="numeric" type="text" maxLength={6} autoComplete="one-time-code" placeholder="Enter One time password" onChange={(e) => setOtp(e.target.value)} />
                    </div>
                </div> : false
            }
            <div className="text-center w-[90%] text-gray-400 text-sm font-semibold" ref={alerDivtRef}></div>
            <div className=" w-full flex-col flex ">
                {
                    otpSent ? <Button variant="dark" text={btnText} disabled={disabled} onClick={handleLogin} startIcon={disabled ? <Loader /> : null} />
                    : <Button text={btnText} variant="dark" disabled={disabled} onClick={handleOtpSend} startIcon={disabled ? <Loader /> : null} />
                }
            </div>
            {
                otpSent ? <ResendCountdown initialTime={45} onResend={handleOtpSend} disabled={disabled} /> : false
            }
        </div>
    )
}

interface ResendCountdownProps{
    initialTime: number,
    onResend: () => void,
    disabled: boolean
}


function ResendCountdown({ initialTime = 10, onResend, disabled }: ResendCountdownProps){
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => {
          setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
    
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const handleResend = () => {
        setTimeLeft(initialTime);
        if (onResend) onResend();
    };

    return (
        <div className="w-full text-center text-gray-400 text-sm font-semibold">
        {timeLeft > 0 ?
            <p className="text-sm">
                Please wait {timeLeft} second{timeLeft !== 1 && "s"} to resend OTP.
            </p>
            : 
            <div className="flex flex-col w-full justify-center items-center">
                <p className="text-black w-fit text-base -mt-1 font-semibold cursor-pointer " onClick={() => {
                if (!disabled){
                    handleResend()
                }
            }}>Resend OTP</p>
            </div>
         }
        </div>
    )
}