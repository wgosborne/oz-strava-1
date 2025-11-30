"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface GearItem {
  gear_id: string;
  name: string;
  brand_name: string | null;
  model_name: string | null;
  nickname: string | null;
  description: string | null;
  distance: number;
  converted_distance: number;
  notification_distance: number;
  is_primary: boolean;
  retired: boolean;
  resource_state: number;
  image_path: string | null;
}

interface GearListProps {
  gear: GearItem[];
}

export default function GearList({ gear }: GearListProps) {
  return (
    <div className="w-full row-start-2 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {gear.map((item) => (
        <Card
          key={item.gear_id}
          className="h-[310px] w-full flex flex-col justify-between"
        >
          <CardHeader className="overflow-hidden">
            <CardTitle className="text-wrap break-words text-base">
              {item.name}
            </CardTitle>
            <CardDescription className="text-wrap break-words text-sm line-clamp-6">
              {item.gear_id}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {item.image_path ? (
              <Image
                src={item.image_path}
                alt={item.name || "Gear image"}
                width={300}
                height={200}
                className="w-full h-auto object-cover rounded"
              />
            ) : (
              <div className="w-full h-[200px] bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between text-sm">
            {item.retired && <span className="text-red-500">Retired</span>}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
