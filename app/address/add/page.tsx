"use client";
import { useEffect, useState, useRef } from "react";
import Button from "@/components/Button";
import axios from "axios";
import Loader from "@/components/RingLoader";
import { useRouter } from "next/navigation";

import { RxCrossCircled } from "react-icons/rx";
import { BiCurrentLocation } from "react-icons/bi";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaSearchLocation } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";


export default function AddAddress() {
  const router = useRouter()
  const [curr, setCurr] = useState<[number, number]>([77.61648476788898, 12.931423492103944]);
  const [userLocation, setUserLocation] = useState(false);
  const [address, setAddress] = useState("Looking up your selected location...");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchPredictions, setSearchPredictions] = useState([]);
  const searchBarRef: any = useRef(null);
  // const [mapInstance, setMapInstance] = useState<any>(null);
  let searchInputTimeout;
  const timeout = useRef<ReturnType<typeof setTimeout>>(null)

  function SetCurrLocation(){
    navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
      setCurr([position.coords.longitude, position.coords.latitude])
      // mapInstance.setCenter([position.coords.longitude, position.coords.latitude])
      console.log([position.coords.longitude, position.coords.latitude])
      setUserLocation(true)
    });
  }

  // 
  useEffect(() => {
    if (!(searchInput === "")){
      setLoading(true)
      const params = new URLSearchParams();
      params.append("input", searchInput)
      params.append("location", `${curr[1]},${curr[0]}`)
      params.append("api_key", process.env.NEXT_PUBLIC_OLA_API_KEY || "");
      const url = `${process.env.NEXT_PUBLIC_OLA_AUTOCOMPLETE_URL}?${params.toString()}`;

      axios.get(url).then((res) => {
        console.log(res.data.predictions)
        setSearchPredictions(res.data.predictions)
        setLoading(false)
      }).catch((err) => {
        console.log(err)
        setLoading(false)
      })
    }
  }, [searchInput, curr])

  useEffect(() => {
    // setUserLocation(true)
    SetCurrLocation()
  }, [])

  useEffect(() => {
      if (timeout.current){
        clearTimeout(timeout.current)
      }
      timeout.current = setTimeout(() => {
        const params = new URLSearchParams();
        // console.log(curr)
        params.append("latlng", `${curr[1]},${curr[0]}`);
        params.append("api_key", process.env.NEXT_PUBLIC_OLA_API_KEY || "");
        const queryString = params.toString();
        const url = `${process.env.NEXT_PUBLIC_REVERSE_GEOCODE_URL}?${queryString}`;
        // console.log(url)
        axios.get(url, {
          // headers: {
          //   "origin": process.env.NEXT_PUBLIC_OLA_REQ_ORIGIN
          // }
        }).then((res) => {
          setAddress(res.data.results[0].formatted_address)
          // console.log(res)
        }).catch(() => {
          // console.log(err)
          setAddress("error while looking up your address")
        })
      }, 500)
  }, [curr])

  useEffect(() => {
    async function loadMap() {
      const olaMapsModule = await import("olamaps-web-sdk");
      const { OlaMaps } = olaMapsModule;
    
      const olaMaps = new OlaMaps({
        // @ts-expect-error it can throw error if env variable is not defined
        apiKey: process.env.NEXT_PUBLIC_OLA_API_KEY,
        requestHeaders: {
          origin: process.env.NEXT_PUBLIC_OLA_REQ_ORIGIN,
        },
      });
      const myMap = olaMaps.init({
        style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard-mr/style.json",
        // style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light/style.json", 
        container: "map",
        center: [curr[0],curr[1]],
        zoom: 16,
      });
      // setMapInstance(myMap)

      // olaMaps
      // .addMarker({ offset: [0, 0], anchor: 'bottom' })
      // .setLngLat([81.3484238,21.2072361])
      // .addTo(myMap)
      const marker = olaMaps
        .addMarker({
          offset: [0, 6],
          anchor: "bottom",
          color: "red",
          draggable: false, 
          className: "custom-marker",
        })
        .setLngLat(myMap.getCenter())
        .addTo(myMap);

      myMap.on("move", () => {
        marker.setLngLat(myMap.getCenter());
        // marker.setZIndexOffset(1000);
      });

      const geolocate = olaMaps.addGeolocateControls({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
      
      myMap.addControl(geolocate)
      // console.log(curr)
      myMap.on("moveend", () => {
        const newCenter = myMap.getCenter(); // returns [lng, lat]
        // console.log("New Center:", newCenter);
        setCurr([newCenter.lng, newCenter.lat])
      });
    }

    if (userLocation){
      loadMap();
    }
  }, [userLocation]);

  return (
    <div className="h-svh overflow-hidden w-full flex flex-col bg-white">
      <div className="h-[50px] px-3 flex items-center justify-center w-full z-100 bg-white shadow-md">
          <h1 className="font-bold text-xl">Save New Address</h1>
          <FaArrowLeftLong className="size-5 text-gray-800 absolute left-[20px]" onClick={() => {
            router.back()
          }} />
      </div>
      <div id="map" className="w-full h-[70%] flex flex-col items-center">
        <div className="bg-white h-fit w-[90%] flex flex-col items-center gap-5 justify-between rounded-lg shadow-lg mt-[15px] z-[2000]">
            <div className="flex h-[50px] w-full px-3 items-center gap-5 justify-between rounded-lg shadow-lg">
              <FaSearchLocation className="size-6 text-gray-700  " />
              <input type="text" ref={searchBarRef} className="w-[90%] h-[70%] text-base outline-0 " placeholder="Search for area, street name..." onChange={((e) => {
                clearTimeout(searchInputTimeout)
                searchInputTimeout = setTimeout(() => {
                  setSearchInput(e.target.value)
                }, 750)
              })} />
              {
                loading ? <Loader /> : false
              }
              {
                searchPredictions.length > 1 ? <RxCrossCircled className="size-6 stroke-[0.75px] text-gray-600 cursor-pointer" onClick={() => {
                  setSearchPredictions([])
                  if (searchBarRef.current){
                    searchBarRef.current.value = "" 
                    setSearchInput("")
                  }
                }} /> : false
              }
            </div>
            {
              searchPredictions.length > 1 ?
              <div className=" z-[1001] h-[200px] relative overflow-y-scroll overflow-x-hidden rounded-lg w-full px-3 bg-white scrollbar-hidden">
                {
                  searchPredictions.map((prediction: any) => {
                    return (
                      <div key={prediction.place_id} className="w-full h-fit mb-[10px] pb-[10px] gap-1 flex border-b-1 border-gray-500 last:border-b-0 ">
                        <div className="flex flex-col w-[12.5%] items-center justify-evenly">
                          <IoLocationOutline className="size-6" />
                          <div className="font-medium text-gray-600">
                            {
                              prediction.distance_meters < 1000 ? `${prediction.distance_meters}m`: prediction.distance_meters/1000 < 10 ? `${(prediction.distance_meters/1000).toFixed(2)}km` : `${(prediction.distance_meters/1000).toFixed(0)}km`
                            }
                          </div>
                        </div>
                        <div className="flex flex-col w-[87.5%]">
                          <div className="font-semibold text-base line-clamp-1">{prediction.structured_formatting.main_text}</div>
                          <div className="font-medium line-clamp-2">{prediction.structured_formatting.secondary_text}</div>
                        </div>
                      </div>
                    )
                  })
                }
              </div>
              : false
            }
        </div>
        <div className="h-[30px] bg-white w-[40%] shadow-2xl rounded-lg z-10 relative top-[calc(70%)] flex items-center justify-center gap-[3px]" onClick={SetCurrLocation}>
            <BiCurrentLocation className="size-5" />
            <p className="font-semibold text-sm">Current Location</p>
        </div>
      </div>
      <div className="p-3 px-5 w-full h-[calc(30%-53px)] gap-4 flex-col flex -top-[3px] justify-evenly rounded-lg relative bg-white">
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-sm px-1">
              SELECTED LOCATION POINTS TO:
            </div>
            <div className="h-full overflow-hidden whitespace-nowrap px-1">
              {
                address.split(" ").map((word, index) => {
                  if (index <= 5){
                    return <span key={`${word}${index}`} className="mr-[3px]">{word}</span>
                  }
                })
              }
            </div>
          </div>
          <div className="flex flex-col shadow-md">
            <Button text="Add details to your Address" variant="dark" />
          </div>
      </div>
    </div>
  );
}
