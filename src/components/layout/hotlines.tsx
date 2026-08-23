import { hotlines } from "@/lib/data/hotlines";

export default function Hotlines() {
  return (
    <div className="flex justify-center text-sm w-full bg-red-600 text-white">
      <marquee behavior="" direction="">
        <div className="flex gap-5 font-semibold p-2">
          {
            hotlines.map((hotline, i: number) => {
              return (
                <span key={`${i}. ${hotline.name}`}>
                  {hotline.name} {hotline.dial}
                </span>
              )
            })
          }
        </div>
      </marquee>
    </div>
  )
}
