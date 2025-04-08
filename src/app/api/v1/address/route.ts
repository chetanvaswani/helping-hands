import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/db/index";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.mobileNumber) {
        return NextResponse.json(
          { status: "failure", message: "User not authenticated" },
          { status: 401 }
        );
      }
      const mobileNumber = session.user.mobileNumber;
      
      const body = await req.json();
      const { address, type, latitude, longitude } = body;
      let { name } = body;

      if (type !== "other"){
        name = type
      }
      
      const user = await prisma.user.findUnique({
        where: { mobileNumber },
      });
      
      if (!user) {
        return NextResponse.json(
          { status: "failure", message: "User not found" },
          { status: 404 }
        );
      }
      
      const newAddress = await prisma.address.create({
        data: {
          userId: user.id,
          address,
          type,
          latitude: Number(latitude),
          longitude: Number(longitude),
          name: name,
        },
      });
      
      return NextResponse.json(
        { status: "success", data: newAddress },
        { status: 201 }
      );
    } catch (error: any) {
      console.error("Error creating address:", error);
      return NextResponse.json(
        { status: "error", message: error.message },
        { status: 500 }
      );
    }
  }
  