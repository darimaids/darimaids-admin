// src/data/services.ts

export const SERVICES = [
  {
    id: "standard",
    name: "Standard Cleaning",
    description:
      "Ideal for recurring upkeep. Starting at $130, final price depends on home size and condition. Includes dusting, vacuuming, mopping, bathrooms, and kitchen surfaces.",
    pricing: [
      { label: "Studio / 1 Bed - 1 Bath", price: 130 },
      { label: "2 Beds - 1 Bath", price: 180 },
      { label: "2 Beds - 2 Baths", price: 230 },
      { label: "3 Beds - 2 Baths", price: 290 },
      { label: "Over 1500 sq. ft", price: "$0.18 / sq ft" },
    ],
    highlights: [
      "Dusting all surfaces",
      "Vacuuming and mopping floors",
      "Cleaning bathrooms and kitchens",
      "Wiping countertops and mirrors",
      "Emptying trash bins",
      "Making beds and general tidying",
    ],
  },
  {
    id: "deep",
    name: "Deep Cleaning",
    description:
      "Ideal for move-ins, move-outs, or first-time clients. Starting at $0.23 per sq. ft. Includes all regular cleaning tasks plus appliances, grout scrubbing, vents, and cabinet interiors.",
    pricing: [{ label: "Per sq. ft", price: "$0.23 / sq ft" }],
    highlights: [
      "Detail scrubbing of surfaces",
      "Appliance deep cleaning",
      "Window and vent cleaning",
      "Cabinet interiors and grout scrubbing",
      "Baseboards and corners cleaned thoroughly",
    ],
  },
  {
    id: "move-in-out",
    name: "Move In / Move Out Cleaning",
    description:
      "Perfect for clients moving in or out. Includes a full deep clean of all rooms, appliances, and fixtures. Home must be empty and free of bulk items.",
    pricing: [
      { label: "Studio / 1 Bed - 1 Bath", price: 250 },
      { label: "2 Beds - 1 Bath", price: 290 },
      { label: "3 Beds - 2 Baths", price: 350 },
      { label: "Over 1500 sq. ft", price: "$0.30 / sq ft" },
    ],
    highlights: [
      "Appliances (inside/out)",
      "Cabinets and drawers cleaned",
      "Floors, patios, and fixtures detailed",
      "Bathroom and kitchen deep clean",
      "Windows and mirrors polished",
    ],
  },
  {
    id: "white-glove",
    name: "White Glove Cleaning",
    description:
      "A premium service designed for those expecting perfection. Starting at $200. Includes all deep-cleaning tasks plus meticulous attention to fine details.",
    pricing: [
      { label: "Starting Flat Rate", price: 200 },
      { label: "Per Bedroom / Bathroom", price: "+$50 each" },
      { label: "Over 2000 sq. ft", price: "$0.20 / sq ft" },
    ],
    highlights: [
      "Light fixtures and door frames polished",
      "Detailed appliance and surface cleaning",
      "Cabinet interiors and vents cleaned",
      "Every surface inspected to perfection",
    ],
  },
  {
    id: "airbnb",
    name: "Airbnb Turnover Cleaning",
    description:
      "Designed for vacation rentals and short-term stays. We prepare your property for the next guest with a top-to-bottom refresh.",
    pricing: [
      { label: "1 Bed / 1 Bath", price: 140 },
      { label: "Each Extra Room", price: "+$40" },
      { label: "Over 1200 sq. ft", price: "$0.23 / sq ft" },
    ],
    highlights: [
      "Full cleaning of all rooms",
      "Changing linens and towels",
      "Restocking essentials (optional)",
      "Quick turnaround for next guests",
    ],
  },
  {
    id: "custom",
    name: "Custom Cleaning",
    description:
      "Create a plan that fits your exact needs. Starting at $130, choose rooms, tasks, and add-ons. Perfect for one-off or special requests.",
    pricing: [
      { label: "Flat Rate", price: 130 },
      { label: "Add-ons", price: "+$25 each" },
    ],
    highlights: [
      "Flexible room and task selection",
      "Appliance or linen service add-ons",
      "Balcony/patio or detailed kitchen care",
      "Tailored for your exact requirements",
    ],
  },
];
