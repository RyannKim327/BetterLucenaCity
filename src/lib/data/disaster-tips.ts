import type { DisasterTip } from "@/types/emergency";

export const disasterTips: DisasterTip[] = [
  {
    id: "earthquake",
    title: "Lindol · Earthquake",
    description:
      "Kapag nag-lindol, ang rule ay Duck, Cover, and Hold. Huwag agad tumakbo habang umuuga—protect your head muna at maghintay na huminto bago lumabas nang dahan-dahan.",
    tips: [
      "Duck sa sahig, cover sa ilalim ng matibay na mesa, at hold hanggang huminto ang pag-uga.",
      "Iwasan ang elevator; gamitin ang hagdan kung kailangang lumabas ng building.",
      "Kung nasa labas, lumayo sa mga gusali, poste, at kable na pwedeng mahulog.",
      "Maghanda ng go bag na may tubig, flashlight, first aid kit, at kopya ng importanteng documents.",
    ],
  },
  {
    id: "flood",
    title: "Baha · Flood",
    description:
      "Kapag tumaas ang tubig, huwag hintayin na mangyari ang worst—umakyat agad sa mas mataas na lugar at sundin ang evacuation advisories ng LDRRMO.",
    tips: [
      "Iwasan ang paglalakad o pagmamaneho sa baha; hindi mo alam kung gaano kalalim o kung may butas sa kalsada.",
      "Itaas ang muwebles, appliances, at mahahalagang papers bago mag-ulan nang malakas.",
      "Itabi ang emergency kit, radyo, at charged power bank sa madaling abutin.",
      "Kung may evacuation advisory, umalis agad—huwag hintayin na ma-trap sa bahay.",
    ],
  },
  {
    id: "typhoon",
    title: "Bagyo · Typhoon",
    description:
      "Bago ang bagyo, i-check ang lagay ng bahay at mag-stock ng essentials. Makinig sa PAGASA at sa official updates ng Lucena LDRRMO—mas safe ang maagang paghahanda.",
    tips: [
      "I-trim ang mga sanga ng puno at i-secure ang bagay na pwedeng tangayin ng malakas na hangin.",
      "Maghanda ng supply para sa ilang araw: tubig, pagkain, gamot, flashlight, at radyo.",
      "I-charge ang phone at power bank, at itago ang pera at IDs sa waterproof bag.",
      "Kung nasa low-lying o coastal area, sumunod sa preemptive evacuation advisory.",
    ],
  },
  {
    id: "fire",
    title: "Sunog · Fire",
    description:
      "Kapag may sunog, unahin ang buhay kaysa gamit. Lumabas agad, takpan ang bibig at ilong, at tumawag agad sa Lucena City Fire Station o 911.",
    tips: [
      "Kung may usok, yumuko o mag-crawl nang mababa—mas malinis ang hangin malapit sa sahig.",
      "Huwag bumalik sa loob para kumuha ng gamit; sabihin na lang sa fire responders.",
      "Kung nagliyag ang damit, Stop, Drop, and Roll agad.",
      "Alamin ang evacuation route ng barangay at mag-set ng meeting place para sa pamilya.",
    ],
  },
];
