import { NextRequest, NextResponse } from "next/server";
import prisma from "@/db/index";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserSchema } from "@/schemas/UserSchema"
import {revalidateUserCache } from "@/lib/actions/revalidateUser";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = req.nextUrl;
    const mobileNumber = session?.user.mobileNumber;
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
      queryOptions.select = { id: true, name: true, mobileNumber: true, email: true, referralCode: true };
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

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.mobileNumber) {
      return NextResponse.json(
        { status: "failure", data: { msg: "No user session found" } },
        { status: 401 }
      );
    }

    const rawData = await req.json();
    // console.log(rawData)
    const parseResult = UserSchema.safeParse(rawData);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          status: "failure",
          data: { msg: "Validation Error", error: parseResult.error.errors },
        },
        { status: 400 }
      );
    }

    const { mobileNumber, ...restData } = parseResult.data;

    if (mobileNumber !== session.user.mobileNumber) {
      return NextResponse.json(
        {
          status: "failure",
          data: { msg: "You are not authorised to peform this operation." },
        },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(restData)) {
      if (value !== undefined) {
        updateData[key] = value;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { mobileNumber },
      data: updateData,
    });

    revalidateUserCache(`user-${updatedUser.mobileNumber}`);

    return NextResponse.json({ status: "success", data: updatedUser });
  } catch (err: any) {
    console.error("PUT /api/v1/user error:", err);
    return NextResponse.json(
      {
        status: "failure",
        data: { msg: "Internal Server Error", error: err.message },
      },
      { status: 500 }
    );
  }
}