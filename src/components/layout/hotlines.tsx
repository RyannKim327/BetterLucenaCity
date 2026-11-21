import { hotlines } from "@/lib/data/hotlines";
import Link from "next/link";

export default function Hotlines() {
  return (
    <div className="flex items-center justify-center text-sm w-full bg-hotline text-white">
      <div className="hidden md:flex gap-5 font-semibold p-2">
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
