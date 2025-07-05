/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
//import RefreshReadAcessToken from "../api/refreshToken";
import { useStore } from "../store/store";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";

export default function Page() {
  const activities = useStore((state) => state.activities);
  const error = useStore((state) => state.error);
  const isLoading = useStore((state) => state.isLoading);
  const gear = useStore((state) => state.gear);
  const fetchGear = useStore((state) => state.fetchGear);
  const fetchGearFromStrava = useStore((state) => state.fetchGearFromStrava);
  const syncGear = useStore((state) => state.syncGear);

  useEffect(() => {
    fetchGear();
    //fetchGearFromStrava();
  }, []);

  useEffect(() => {
    console.log("GEAR", gear);
    //syncGear(gear);
  }, [gear, syncGear]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (gear.length === 0) {
    return <div>Loading now...</div>; // Prevent rendering before data is available
  }

  return (
    <div className="p-4">
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex items-center space-x-4"></div>
        {gear ? (
          // <div className="w-full row-start-2 flex gap-6 flex-wrap items-center justify-center">
          <div className="w-full row-start-2 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gear.map((item: any) => (
              <Card
                key={item.id}
                className="h-[310px] w-full flex flex-col justify-between"
              >
                <CardHeader className="overflow-hidden">
                  <CardTitle className="text-wrap break-words text-base">
                    {item.name}
                  </CardTitle>
                  <CardDescription className="text-wrap break-words text-sm line-clamp-6">
                    {item.id}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <Image
                    src={gear.image_path}
                    alt={gear.name || "Gear image"}
                    className="w-full h-auto object-cover rounded"
                  />
                </CardContent>
                <CardFooter className="flex justify-between text-sm"></CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="w-full row-start-2 flex gap-6 flex-wrap items-center justify-center">
            <p>Loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
