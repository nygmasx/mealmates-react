import React from "react";

export const Address = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-6">
          <div className="flex flex-col items-center">
            <a href="../profile" className="block w-full">
              <div className="flex justify-center mb-4">
                <svg width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M1 10.363C1.01577 5.68116 4.7917 1.89869 9.43376 1.9146C14.0758 1.93051 17.8262 5.73876 17.8104 10.4206V10.5166C17.7533 13.5599 16.0684 16.3728 14.0028 18.5713C12.8215 19.8086 11.5023 20.9039 10.0715 21.8355C9.68895 22.1693 9.12146 22.1693 8.73888 21.8355C6.60591 20.4353 4.73387 18.6674 3.20839 16.6129C1.84876 14.8212 1.07681 12.6466 1 10.3918L1 10.363Z"
                    stroke="#181725"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path 
                    fill-rule="evenodd" 
                    clip-rule="evenodd" 
                    d="M9.40523 12.8877C10.6984 12.8877 11.7467 11.8304 11.7467 10.5261C11.7467 9.22186 10.6984 8.16455 9.40523 8.16455C8.11205 8.16455 7.06372 9.22186 7.06372 10.5261C7.06372 11.8304 8.11205 12.8877 9.40523 12.8877Z" 
                    stroke="#181725" 
                    stroke-width="2" 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                  />
                </svg>
              </div>
              <div className="flex items-center justify-center gap-2">
                <svg width="10" height="15" viewBox="0 0 10 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform rotate-180">
                  <g clipPath="url(#clip0_470_397)">
                    <path
                      d="M1.01006 2.09166C0.812929 1.89166 0.703411 1.6285 0.714363 1.35482C0.714363 1.08114 0.82388 0.828504 1.03196 0.628504C1.2291 0.43903 1.50289 0.323241 1.78764 0.323241C2.07238 0.323241 2.34618 0.417979 2.55426 0.607452L8.75296 6.56535C8.85152 6.66008 8.92818 6.77587 8.98294 6.90219C9.0377 7.0285 9.07056 7.16535 9.07056 7.30219C9.07056 7.43903 9.0377 7.57587 8.98294 7.71272C8.92818 7.83903 8.85152 7.95482 8.75296 8.04956L2.55426 14.0075C2.45569 14.1022 2.33522 14.1864 2.2038 14.239C2.06143 14.2917 1.91906 14.3232 1.77668 14.3232C1.63431 14.3232 1.48099 14.3022 1.34956 14.2496C1.21814 14.1969 1.09767 14.1127 0.988156 14.018C0.88959 13.9232 0.812928 13.7969 0.758169 13.6706C0.692458 13.5443 0.670555 13.4075 0.670555 13.2601C0.670555 13.1232 0.70341 12.9864 0.758169 12.8601C0.812928 12.7338 0.900542 12.618 1.01006 12.5127L6.43118 7.30219L5.40172 6.32324L1.01006 2.09166Z"
                      fill="#181725"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_470_397">
                      <rect width="8.4" height="14" fill="white" transform="translate(9.07056 14.3232) rotate(-180)" />
                    </clipPath>
                  </defs>
                </svg>
                <span className="text-xl font-medium">Adresse de livraison</span>
              </div>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full">
        <div>
          <div className="border-t border-gray-200">
            <div className="px-6">
              <label className="block text-gray-500 text-sm mt-4">Adresse</label>
              <input
                type="text"
                placeholder="40 Avenue des champs elysees"
                className="w-full py-2 focus:outline-none text-[#181725]"
              />
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="px-6">
              <label className="block text-gray-500 text-sm mt-4">Complément d'adresse</label>
              <input
                type="text"
                className="w-full py-2 focus:outline-none text-[#181725]"
              />
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="px-6">
              <label className="block text-gray-500 text-sm mt-4">Code postale</label>
              <input
                type="text"
                placeholder="75008"
                className="w-full py-2 focus:outline-none text-[#181725]"
              />
            </div>
          </div>

          <div className="border-t border-gray-200">
            <div className="px-6">
              <label className="block text-gray-500 text-sm mt-4">Ville</label>
              <input
                type="text"
                placeholder="Paris"
                className="w-full py-2 focus:outline-none text-[#181725]"
              />
            </div>
          </div>
          <div className="border-t border-gray-200"></div>
        </div>

        <div className="px-6">
          <button className="w-full mt-6 bg-[#53B175] text-white py-3 rounded-lg text-lg font-medium">
            Enregistrer l'adresse
          </button>
        </div>
      </main>
    </div>
  );
};

export default Address;
