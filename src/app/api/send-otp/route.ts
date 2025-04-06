import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/db/index";

export async function POST(req: NextRequest) {
  try {
    const { mobNum } = await req.json();
    console.log(mobNum);
    const otp = Math.floor(100000 + Math.random() * 900000);
    console.log(otp);

    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${process.env.TWOFACTOR_URL}/${process.env.TWOFACTOR_API}/SMS/+91${mobNum}/${otp}/`,
      headers: {}
    };

    const response = await axios(config);
    console.log(JSON.stringify(response.data));

    const otpEntry = await prisma.otp.create({
      data: {
        mobNo: mobNum,
        otp: otp.toString(),
        reference: "",
      }
    });
    console.log(otpEntry);

    return NextResponse.json({
      status: "success",
      data: {
        msg: "Successfully sent otp!"
      }
    });
  } catch (err: any) {
    // console.error(err);
    return NextResponse.json({
      status: "failure",
      data: {
        msg: "Some error occurred, please try again!",
        error: err?.message
      }
    }, { status: 500 });
  }
}