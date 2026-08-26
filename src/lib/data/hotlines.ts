import { Hotlines } from "@/types/sources";

export const hotlines: Hotlines[] = [
  {
    "name": "National Emergency",
    "dial": ["911"],
    "head": true
  },
  {
    "name": "Lucena City PNP",
    "dial": [
      "(042) 373-7249",
      "(042) 788-4626"],
    "head": true
  },
  {
    "name": "LDRRMO",
    "dial": ["0970 128 5078"],
    "head": true

  },
  {
    "name": "BFP Lucena Central Station",
    "dial": ["(042) 797-2320"],
    "head": false

  },
  {
    "name": "BFP Lucena BRGY. 10 Fire Sub-Station",
    "dial": ["(042) 717-6130"],
    "head": false
  },
  {
    "name": "BFP Lucena",
    "dial": ["0999-675-6455"],
    "head": true
  }
] as const
