"use client"
import Sidebar from "@/components/shared/sidebar";
import { UserButton } from "@clerk/nextjs";
import React, { useCallback, useEffect, useState } from "react";
import { sidebarItems } from "@/lib/items/sidebarItems";
import { useInfiniteQuery } from "@tanstack/react-query";

type HealthCenter = {
  name: string;
  address: string;
  lat: number;
  lon: number;
  distance:number;
};

const HealthCenter = () => {
  const [centerType, setCenterType] = useState<string>("vaccination");
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(()=>{
    const getLocation = async () =>{
      try {
        const position = await new Promise<GeolocationPosition>((resolve,reject)=>{
          navigator.geolocation.getCurrentPosition(resolve,(error)=>{
            if(error.code === error.PERMISSION_DENIED){
              alert("Location is denied.Please enable it in your browser settings");
            }
            reject(error)
          });
        });
        const {latitude,longitude} = position.coords;
        setLocation({latitude,longitude});
      } catch (error) {
        console.error("Geolocation error:",error);
      }
    }

    getLocation();

  },[])

  const fetchHealthCenters = useCallback(async ({ pageParam = 0 }: { pageParam?: number }) => {
    try {
       if(!location) return {elements:[]}

      const  {latitude,longitude} = location;
  
      const tag = centerType === "vaccination" ? 'healthcare:speciality' : 'healthcare';
      
      const limit = 5;
      //fetching within nearby 100km (around:100000)
      const overpassQuery = `
        [out:json];
        node["${tag}"="${centerType}"](around:100000, ${latitude}, ${longitude});
        out body ${limit};
      `;
      const response = await fetch(
        `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`
      );
  
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`API Error: ${text}`);
      }
  
      const data = await response.json();
      const healthCenters = data.elements.map((element: any) => {
        const addressParts = [
          element.tags["addr:full"],
          element.tags["addr:district"],
          element.tags["addr:postcode"],
          element.tags["addr:state"],
        ].filter(Boolean); // Filter out undefined or null values
        const address = addressParts.join(", ");
  

      // Calculate the distance using the Haversine formula
      const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
      const R = 6371; // Earth's radius in kilometers
      const dLat = toRadians(element.lat - latitude);
      const dLon = toRadians(element.lon - longitude);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(latitude)) *
          Math.cos(toRadians(element.lat)) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in kilometers

        return {
          name: element.tags.name || "Unnamed Center",
          address: address || "Address not available",
          lat: element.lat,
          lon: element.lon,
          distance: distance.toFixed(2),//in km
        };
      });
  
      return { elements: healthCenters };
    } catch (error) {
      console.error("Fetch error:", error);
      throw new Error("Failed to fetch health centers. Please try again later.");
    }
  },[centerType,location]);
  

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    error,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["healthCenters", centerType],
    queryFn: fetchHealthCenters,
    getNextPageParam: (lastPage, pages) => {
      // Check if the last page's results are less than the limit, if so, no next page
      return lastPage.elements.length === 5 ? pages.length : undefined;
    },
    initialPageParam: 0,
  });
  
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;

    // Check if we're near the bottom of the page, and if so, fetch the next page
    if (scrollHeight - scrollTop - clientHeight < 100 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="flex h-screen">
    <Sidebar title="ResQ Health" sidebarItems={sidebarItems} />
    <main className="flex-1 p-6 lg:ml-64 md:ml-16  overflow-y-auto" onScroll={handleScroll}>
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-3xl max-sm:ml-12 max-sm:w-full font-bold text-blue-600">Nearby Health Centers</h1>
        <UserButton />
      </header>

      <section className="mb-6">
        <label htmlFor="centerType" className="block text-lg font-medium text-gray-700">
          Select Health Center Type:
        </label>
        <select
          id="centerType"
          value={centerType}
          onChange={(e) => setCenterType(e.target.value)}
          className="mt-2 p-2 w-[100%] border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="vaccination">Vaccination Centers</option>
          <option value="laboratory">Laboratories</option>
          <option value="clinic">Clinics</option>
          <option value="hospital">Hospitals</option>
          <option value="pharmacy">Pharmacies</option>
        </select>
      </section>

      {isLoading ? (
        <p className="text-lg text-blue-500">Loading health centers nearby...</p>
      ) : isError ? (
        <p className="text-lg text-red-500">{(error as Error).message}</p>
      ) : data?.pages?.flatMap((page) => page.elements)?.length === 0 ? (
        <p className="text-lg text-gray-500">No health centers found nearby.</p>
      ) : (
        <ul className="space-y-4">
          {data?.pages?.flatMap((page) =>
            page.elements.map((center: HealthCenter, index: number) => (
              <li
                key={`${index}-${center.name}-${center.lat}-${center.lon}-${Date.now()}-${Math.random()}`}
                className="p-4 border rounded-lg shadow-md hover:shadow-lg transition bg-white"
              >
                <h2 className="text-lg font-bold text-gray-800">{center.name}</h2>
                <p className="text-gray-600">{center.address}</p>
                <p className="text-gray-500">Latitude: {center.lat}, Longitude: {center.lon}</p>
                <p className="text-blue-500 font-semibold">Distance: {center.distance} km</p>
                <a
                  href={`https://www.google.com/maps?q=${center.lat},${center.lon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on Google Maps
                </a>
              </li>
            ))
          )}
        </ul>
      )}
      {isFetchingNextPage && <p className="text-center text-lg text-blue-500">Loading more...</p>}
    </main>
  </div>
  );
};

export default HealthCenter;
