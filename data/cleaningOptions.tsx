// src/data/cleaningOptions.ts

export const SERVICE_TYPES = [
  { value: "standard-cleaning", label: "Standard Cleaning" },
  { value: "deep-cleaning", label: "Deep Cleaning" },
  { value: "move-in-out", label: "Move In / Move Out Cleaning" },
  { value: "white-glove", label: "White Glove Cleaning" },
  { value: "airbnb-turnover", label: "Airbnb Turnover Cleaning" },
  { value: "custom-clean", label: "Custom Cleaning" },
];

export const CLEANING_TYPES = [
  { value: "studio", label: "Studio / 1 Bed - 1 Bath" },
  { value: "2-bed-1-bath", label: "2 Bed - 1 Bath" },
  { value: "2-bed-2-bath", label: "2 Bed - 2 Bath" },
  { value: "3-bed-2-bath", label: "3 Bed - 2 Bath" },
  { value: "4-bed-2-bed", label: "4 Bed - 4 Bath" },
];

export const REOCCURENCE_OPTIONS = [
  { value: "one-time", label: "One-Time" },
  { value: "weekly", label: "Weekly" },
  { value: "bi-weekly", label: "Bi-Weekly" },
  { value: "monthly", label: "Monthly" },
];
