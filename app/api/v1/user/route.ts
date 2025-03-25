import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/index";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const mobileNumber = searchParams.get("mobileNumber");
    const includeParam = searchParams.get("include");

    if (!mobileNumber) {
      return NextResponse.json(
        { status: "failure", data: { msg: "mobileNumber is required" } },
        { status: 400 }
      );
    }

    const allowedRelations = [
      "addresses",
      "sessions",
      "bookings",
      "reviews",
      "referralsSent",
      "referralsReceived",
      "creditsTransactions",
      "Transaction",
    ];

    const queryOptions: any = { where: { mobileNumber } };

    if (includeParam) {
      const includes = includeParam.split(",").reduce((acc, field) => {
        // console.log("acc", acc, "field", field)
        const trimmed = field.trim();
        // console.log("trimmed", trimmed)
        if (allowedRelations.includes(field.trim())) {
          acc[trimmed] = true;
        }
        return acc;
      }, {} as Record<string, boolean>);
      queryOptions.include = includes;
    } else {
      queryOptions.select = { id: true, name: true, mobileNumber: true, email: true };
    }

    const user = await prisma.user.findUnique(queryOptions);
    if (!user) {
        return NextResponse.json(
          { status: "failure", data: { msg: "User not found" } },
          { status: 404 }
        );
      }
      
    return NextResponse.json({ status: "success", data: user });

  } catch (err: any) {
    console.error("GET /api/user error:", err);
    return NextResponse.json(
      {
        status: "failure",
        data: { msg: "Internal Server Error", error: err.message },
      },
      { status: 500 }
    );
  }
}