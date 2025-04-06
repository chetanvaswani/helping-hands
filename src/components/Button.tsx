"use client"
import { ReactElement } from "react"

interface ButtonProps {
    variant: "light" | "dark",
    text: string,
    startIcon?: ReactElement,
    endIcon?: ReactElement,
    onClick? : () => void,
    type?: "submit" | "button",
    disabled?: boolean
}

const variantStyles = {
    "light": "bg-white text-black",
    "dark": "text-white bg-black"
}

const defaultStyles = "p-3 rounded-lg font-semibold cursor-pointer"

export default function Button({
    variant,
    text,
    startIcon,
    endIcon,
    onClick,
    type,
    disabled
}: ButtonProps){
    return (
        <button className={ `${variantStyles[variant]} ${defaultStyles} shadow-md disabled:opacity-[80%]` }
        disabled={disabled ? disabled : false} onClick={onClick} type={type}>
            <div className="flex justify-center items-center gap-2">
                {startIcon}
                {text}
                {endIcon}
            </div>
        </button>
    )
}