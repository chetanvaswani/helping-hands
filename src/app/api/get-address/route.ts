import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat") as string;
  const lng = req.nextUrl.searchParams.get("lng") as string;

  const params = new URLSearchParams();
  params.append("latlng", `${lat},${lng}`);
  params.append("api_key", process.env.OLA_MAPS_API || "");
  const queryString = params.toString();
  const url = `${process.env.REVERSE_GEOCODE_URL}?${queryString}`;

  try {
    const res = await axios.get(url, {
        headers: {
          "origin": process.env.OLA_REQ_ORIGIN
        }
      });
    return NextResponse.json({
      status: "success",
      data: res.data,
    });
  } catch (err) {
    console.error("Error in reverse geocode request:", err);
    return NextResponse.json(
      {
        status: "failure",
        data: { msg: "Error occurred", error: err },
      },
      { status: 401 }
    );
  }
}
