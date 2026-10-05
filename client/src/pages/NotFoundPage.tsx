import React from "react";
import { Link } from "react-router-dom";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-24 text-[#dfe0ff] text-center">
      <div className="max-w-md w-full p-8 rounded-3xl bg-[#13183d] border border-[#21274c] shadow-2xl relative overflow-hidden flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-[#21274c] border border-[#ffb4ab]/30 flex items-center justify-center text-[#ffb4ab] mb-4 shadow-md">
          <span className="material-symbols-outlined text-[34px]">error_outline</span>
        </div>

        <span className="font-headline text-xs uppercase tracking-widest text-[#ffb4ab] font-bold">
          404 · SECTOR NOT FOUND
        </span>

        <h1 className="font-headline text-3xl text-white font-bold uppercase mt-2 mb-3">
          Signal Desync
        </h1>

        <p className="font-body text-sm text-[#c5c5da] mb-8 leading-relaxed">
          The requested coordinate does not exist on the current Riyadah Elite node topology. Return to known sectors below.
        </p>

        <div className="w-full flex flex-col gap-3 font-headline text-xs font-bold">
          <Link
            to="/"
            className="w-full py-3 rounded-xl bg-[#233dff] hover:bg-[#324bff] text-white shadow-md transition-all"
          >
            Return to Command Center
          </Link>
          <Link
            to="/games"
            className="w-full py-3 rounded-xl bg-[#21274c] hover:bg-[#31365d] text-[#5cb6f9] hover:text-white transition-all"
          >
            Explore Game Testing Hub
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
