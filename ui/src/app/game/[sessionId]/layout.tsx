import type { Metadata } from "next";
import RouteGuard from "@/components/RouteGuard";
import React from "react";
import Forest from "../components/Forest";


export const metadata: Metadata = {
  title: "Loli",
  description: "Loli Game",
};

export default function GameSessionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <RouteGuard>
      <Forest>
        <div className="flex flex-row h-screen w-screen justify-center items-center">
          <div className="w-1/2 h-2/3 bg-green-800">
            {children}
          </div>
        </div>
      </Forest>
    </RouteGuard>
              
    </>
  );
}
