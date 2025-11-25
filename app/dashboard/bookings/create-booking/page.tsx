"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

// components
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";

// data
import {
  SERVICE_TYPES,
  CLEANING_TYPES,
  REOCCURENCE_OPTIONS,
} from "@/data/cleaningOptions";
import { COUNTIES } from "@/data/counties";
import { STATES } from "@/data/states";
import {
  ADD_ONS,
  LAST_CLEANING_OPTIONS,
  PET_OPTIONS,
} from "@/data/homeoptions";

// icons
import { ChevronDownIcon } from "lucide-react";

// API
import { createBooking } from "@/services/booking/bookings";

const CreateBookingPage = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Contact Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",

    // Home Information
    serviceType: "",
    cleaningType: "",
    squareFootage: "",
    bedrooms: "",
    bathrooms: "",
    lastCleaning: "",
    address: "",
    streetNumber: "",
    city: "",
    zipCode: "",
    state: "",
    county: "",
    pets: "",
    reoccurrence: "",
    date: undefined as Date | undefined,
    time: "",

    // Add-ons and special requests
    selectedAddons: [] as string[],
    specialRequests: "",
  });

  const [totalPrice, setTotalPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [addonsPrice, setAddonsPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Auto-calculate cleaningType based on bedrooms and bathrooms
  useEffect(() => {
    if (formData.bedrooms && formData.bathrooms) {
      const beds = parseInt(formData.bedrooms);
      const baths = parseInt(formData.bathrooms);

      let cleaningType = "";

      if (beds === 1 && baths === 1) {
        cleaningType = "studio";
      } else if (beds === 2 && baths === 1) {
        cleaningType = "2-bed-1-bath";
      } else if (beds === 2 && baths === 2) {
        cleaningType = "2-bed-2-bath";
      } else if (beds === 3 && baths === 2) {
        cleaningType = "3-bed-2-bath";
      } else if (beds >= 4 || (beds >= 3 && baths >= 3)) {
        cleaningType = "1500-sqft-plus";
      } else {
        cleaningType = "1500-sqft-plus";
      }

      setFormData((prev) => ({ ...prev, cleaningType }));
    }
  }, [formData.bedrooms, formData.bathrooms]);

  // Recalculate pricing whenever relevant data changes
  useEffect(() => {
    calculatePricing();
  }, [
    formData.serviceType,
    formData.cleaningType,
    formData.squareFootage,
    formData.bedrooms,
    formData.bathrooms,
    formData.selectedAddons,
    formData.reoccurrence,
  ]);

  const calculatePricing = () => {
    let base = 0;
    const addons = formData.selectedAddons.length * 25;

    switch (formData.serviceType) {
      case "standard-cleaning":
        switch (formData.cleaningType) {
          case "studio":
            base = 130;
            break;
          case "2-bed-1-bath":
            base = 180;
            break;
          case "2-bed-2-bath":
            base = 230;
            break;
          case "3-bed-2-bath":
            base = 290;
            break;
          case "1500-sqft-plus":
            base = formData.squareFootage
              ? Math.max(290, parseFloat(formData.squareFootage) * 0.18)
              : 0;
            break;
        }
        break;
      case "deep-cleaning":
        base = formData.squareFootage
          ? parseFloat(formData.squareFootage) * 0.23
          : 0;
        break;
      case "move-in-out":
        switch (formData.cleaningType) {
          case "studio":
            base = 250;
            break;
          case "2-bed-1-bath":
            base = 290;
            break;
          case "2-bed-2-bath":
            base = 325;
            break;
          case "3-bed-2-bath":
            base = 350;
            break;
          case "1500-sqft-plus":
            base = formData.squareFootage
              ? Math.max(350, parseFloat(formData.squareFootage) * 0.3)
              : 0;
            break;
        }
        break;
      case "white-glove":
        base = 200;
        if (formData.bedrooms) base += (parseInt(formData.bedrooms) - 1) * 50;
        if (formData.bathrooms) base += (parseInt(formData.bathrooms) - 1) * 50;
        if (
          formData.squareFootage &&
          parseFloat(formData.squareFootage) > 2000
        ) {
          base = Math.max(base, parseFloat(formData.squareFootage) * 0.2);
        }
        break;
      case "airbnb-turnover":
        base = 140;
        if (formData.bedrooms && parseInt(formData.bedrooms) > 1)
          base += (parseInt(formData.bedrooms) - 1) * 40;
        if (formData.bathrooms && parseInt(formData.bathrooms) > 1)
          base += (parseInt(formData.bathrooms) - 1) * 40;
        if (
          formData.squareFootage &&
          parseFloat(formData.squareFootage) > 1200
        ) {
          base = Math.max(base, parseFloat(formData.squareFootage) * 0.23);
        }
        break;
      case "custom-clean":
        base = 130;
        break;
    }

    let discount = 0;
    switch (formData.reoccurrence) {
      case "weekly":
        discount = base * 0.15;
        break;
      case "bi-weekly":
        discount = base * 0.1;
        break;
      case "monthly":
        discount = base * 0.05;
        break;
    }

    setBasePrice(base);
    setAddonsPrice(addons);
    setDiscountAmount(discount);
    const total = base + addons - discount;
    setTotalPrice(total);
  };

  const handleAddonChange = (addon: string, checked: boolean) => {
    const updated = checked
      ? [...formData.selectedAddons, addon]
      : formData.selectedAddons.filter((a) => a !== addon);
    setFormData((prev) => ({ ...prev, selectedAddons: updated }));
  };

  const createBookingMutation = useMutation({
    mutationFn: (data: any) => createBooking(data),
    onSuccess: (data) => {
      toast.success("Booking created successfully!");
      router.push("/dashboard/bookings");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to create booking");
    },
  });

  const handleSubmit = () => {
    const bookingData = {
      fullName: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phoneNumber: formData.phone,
      services: formData.serviceType,
      serviceType: formData.cleaningType,
      squareFootage: parseFloat(formData.squareFootage),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      lastCleaning: formData.lastCleaning,
      address: formData.address,
      streetNumber: formData.streetNumber,
      city: formData.city,
      zipCode: formData.zipCode,
      province: formData.state,
      county: formData.county,
      pets: formData.pets,
      reoccurrence: formData.reoccurrence,
      date: formData.date,
      time: formData.time,
      selectedAddons: formData.selectedAddons,
      specialRequests: formData.specialRequests,
      charge: totalPrice,
      duration: "Approx. 3 hours",
      cleaners: formData.bedrooms || "1",
    };

    createBookingMutation.mutate(bookingData);
  };

  const isFormComplete =
    formData.serviceType &&
    formData.cleaningType &&
    formData.squareFootage &&
    formData.bedrooms &&
    formData.bathrooms &&
    formData.lastCleaning &&
    formData.address &&
    formData.city &&
    formData.zipCode &&
    formData.state &&
    formData.county &&
    formData.pets &&
    formData.streetNumber &&
    formData.firstName &&
    formData.lastName &&
    formData.email &&
    formData.phone &&
    formData.reoccurrence &&
    formData.date &&
    formData.time;

  return (
    <div className="py-12 px-4 sm:px-8 md:px-12 lg:px-16 bg-white dark:bg-[#0D0D0D] text-[#1F2937] dark:text-gray-100 transition-colors duration-300">
      <div className="flex justify-center items-center mb-8">
        <h1 className="text-3xl font-bold">Create New Booking</h1>
      </div>

      <div className="flex flex-col lg:flex-row justify-between gap-8">
        <div className="w-full lg:w-[70%] space-y-5">
          {/* Contact Information Section */}
          <div className="rounded-xl bg-[#F9FAFB] dark:bg-[#121212] px-6 py-5">
            <h1 className="font-semibold text-xl">Contact Information</h1>
            <div className="mt-4 bg-white dark:bg-[#1A1A1A] rounded-xl p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    First Name *
                  </label>
                  <Input
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Last Name *
                  </label>
                  <Input
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#F9FAFB] dark:bg-[#121212] px-6 py-5">
            <h1 className="font-semibold text-xl">About the home</h1>
            <div className="mt-4 bg-white dark:bg-[#1A1A1A] rounded-xl p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Service Type *
                  </label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, serviceType: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Square Foot Est. *
                  </label>
                  <Input
                    placeholder="Enter square footage"
                    value={formData.squareFootage}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        squareFootage: e.target.value,
                      }))
                    }
                    type="number"
                  />
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Number of Bedrooms *
                  </label>
                  <Select
                    value={formData.bedrooms}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, bedrooms: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select bedrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Number of Bathrooms *
                  </label>
                  <Select
                    value={formData.bathrooms}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, bathrooms: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select bathrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Last Time You Had a Cleaning *
                  </label>
                  <Select
                    value={formData.lastCleaning}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, lastCleaning: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select last cleaning" />
                    </SelectTrigger>
                    <SelectContent>
                      {LAST_CLEANING_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Street Address *
                  </label>
                  <Input
                    placeholder="Enter street address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Apartment Number *
                  </label>
                  <Input
                    placeholder="Enter apartment number"
                    value={formData.streetNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        streetNumber: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    City *
                  </label>
                  <Input
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, city: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Zip Code *
                  </label>
                  <Input
                    placeholder="Enter zip code"
                    value={formData.zipCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        zipCode: e.target.value,
                      }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    State *
                  </label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, state: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    County *
                  </label>
                  <Select
                    value={formData.county}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, county: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTIES.map((county) => (
                        <SelectItem key={county} value={county}>
                          {county}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Any Pets? *
                  </label>
                  <Select
                    value={formData.pets}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, pets: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select pet option" />
                    </SelectTrigger>
                    <SelectContent>
                      {PET_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Reoccurrence *
                  </label>
                  <Select
                    value={formData.reoccurrence}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, reoccurrence: value }))
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {REOCCURENCE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Date *
                  </label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-full justify-between font-normal py-5"
                      >
                        {formData.date
                          ? formData.date.toLocaleDateString()
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        captionLayout="dropdown"
                        onSelect={(date: any) => {
                          setFormData((prev) => ({
                            ...prev,
                            date: date ? new Date(date) : undefined,
                          }));
                          setOpen(false);
                        }}
                        disabled={(date: any) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          return date < today;
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-[14px] text-[#666] dark:text-gray-300 mb-1">
                    Time *
                  </label>
                  <Input
                    type="time"
                    id="time-picker"
                    value={formData.time}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, time: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-lg font-semibold text-[#1F2937] dark:text-gray-100 mb-3">
                  Add-ons ($25 each)
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Select extra services to enhance your cleaning experience.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ADD_ONS.map((addon, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 rounded-md border border-gray-200 dark:border-gray-700 p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <Checkbox
                        id={`addon-${idx}`}
                        checked={formData.selectedAddons.includes(addon)}
                        onCheckedChange={(checked) =>
                          handleAddonChange(addon, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={`addon-${idx}`}
                        className="text-sm text-[#1F2937] dark:text-gray-200 cursor-pointer flex-1"
                      >
                        {addon}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-[#F9FAFB] dark:bg-[#121212] px-6 py-5">
            <h1 className="font-semibold text-xl">
              Special Instructions (Optional)
            </h1>
            <div className="mt-4 bg-white dark:bg-[#1A1A1A] rounded-xl p-4">
              <Textarea
                placeholder="Any special requests or instructions for our cleaning team..."
                value={formData.specialRequests}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    specialRequests: e.target.value,
                  }))
                }
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Right Section: Booking Summary */}
        <div className="w-full lg:w-[30%]">
          <div className="sticky top-6 bg-[#F9FAFB] dark:bg-[#121212] px-6 py-5 rounded-xl">
            <h1 className="font-semibold text-xl mb-4">Booking Summary</h1>
            <div className="bg-white dark:bg-[#1A1A1A] rounded-xl p-4 space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-200">
                  Service
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {SERVICE_TYPES.find((s) => s.value === formData.serviceType)
                    ?.label || "Not selected"}
                </p>
                {formData.cleaningType && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {
                      CLEANING_TYPES.find(
                        (c) => c.value === formData.cleaningType
                      )?.label
                    }
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Base Price:</span>
                  <span>${basePrice.toFixed(2)}</span>
                </div>

                {addonsPrice > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Add-ons ({formData.selectedAddons.length}):</span>
                    <span>${addonsPrice.toFixed(2)}</span>
                  </div>
                )}

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {formData.selectedAddons.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-200 text-sm mb-2">
                    Selected Add-ons:
                  </h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    {formData.selectedAddons.map((addon, index) => (
                      <li key={index}>• {addon}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Prices shown are estimates. Final cost may vary based on the
                  home's size, condition, or additional services requested
                </p>
              </div>

              <Button
                className="w-full text-white"
                onClick={handleSubmit}
                disabled={createBookingMutation.isPending || !isFormComplete}
              >
                {createBookingMutation.isPending ? (
                  <Spinner />
                ) : (
                  "Create Booking"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBookingPage;
