"use client";
import MenuPage from "../dashboard/menu-management/MenuPage";
import KitchenDisplayPage from "@/components/dashboard/live-operations/kitchen"
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

const ViewPort = ({ view }: { view: string }) => {
    switch (view) {
        case 'menu':
            return <MenuPage />;
        case 'kitchen':
            return <KitchenDisplayPage />;
        default:
            return <div>View not found</div>;
    }
};

export const ViewDisplay = ({ view, setDisplayViewAction }: { view: string, setDisplayViewAction: React.Dispatch<React.SetStateAction<string | null>> }) => {
    const [showDisplay, setShowDisplay] = useState(true);

    if (!showDisplay) return null;
    return (
        <div className=" relative @container w-1/2 max-w-3xl rounded-lg border bg-card shadow-sm p-2 overflow-y-auto scrollbar-hide-auto max-h-[calc(100vh-4rem)]">
            

            <button
                onClick={() => setShowDisplay(false)}
                className="absolute top-1 right-0 p-2 rounded-full hover:bg-gray-200 transition-colors focus:outline-none"
                aria-label="Close"
            >
                {showDisplay ? (
                    <ChevronLeft
                        className="h-5 w-5 text-gray-600"
                        aria-label="Hide"
                    />
                ) : (
                    <ChevronRight
                        className="h-5 w-5 text-gray-600"
                        aria-label="Show"
                    />
                )}
            </button>
            <ViewPort view={view} />
            {/* <MenuPage /> */}

            {/* <div className="bg-gray-100 text-base @sm:bg-green-100 @md:bg-yellow-200">
                I change color based on parent container size
            </div> */}

        </div>
    );
}