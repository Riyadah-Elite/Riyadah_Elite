import React from "react";
import { Outlet } from "react-router-dom";
import { PublicNavbar } from "./PublicNavbar";
import { PublicFooter } from "./PublicFooter";

export const PublicLayout: React.FC = () => {
  return (
    <div className="bg-[#0a0f35] font-body text-[#dfe0ff] min-h-screen selection:bg-[#bcc2ff] selection:text-[#00169d] flex flex-col overflow-x-hidden">
      <PublicNavbar />
      <main className="w-full pt-20 flex-1 flex flex-col bg-[#0a0f35] overflow-x-hidden">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default PublicLayout;
