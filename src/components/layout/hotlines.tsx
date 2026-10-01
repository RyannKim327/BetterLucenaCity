import { hotlines } from "@/lib/data/hotlines";
import Link from "next/link";

export default function Hotlines() {
  return (
    <div className="hidden md:flex items-center justify-center text-sm w-full bg-red-600 text-white">
      <div className="flex gap-5 font-semibold p-2">
        {
          hotlines.map((hotline, i: number) => {
            if (hotline.head) {
              return (
                <span key={`${i}. ${hotline.name}`}>
                  {hotline.name} {hotline.dial.join(" | ")}
                </span>
              )
            }
          })
        }
      </div>
    </div>
  )
}
