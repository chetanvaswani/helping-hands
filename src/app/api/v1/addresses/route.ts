import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/db/index";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const mobileNumber: string | null = session?.user?.mobileNumber || null;

    if (!mobileNumber) {
      return NextResponse.json(
        {
          status: "failure",
          data: { msg: "User not authenticated or mobile number not provided" },
        },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
        where: {
            User: {
                mobileNumber
            }
        },
    })

    return NextResponse.json({ status: "success", data: { addresses } });
  } catch (err: any) {
    console.error("GET /api/v1/addresses error:", err);
    return NextResponse.json(
      {
        status: "failure",
        data: { msg: "Internal Server Error", error: err.message },
      },
      { status: 500 }
    );
  }
}
