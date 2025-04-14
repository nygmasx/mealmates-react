import React from "react";

export const History = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-6">
          <div className="flex flex-col items-center">
            <svg width="21" height="23" viewBox="0 0 21 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.81909 1.32324L1.81909 5.32324V19.3232C1.81909 19.8537 2.02981 20.3624 2.40488 20.7375C2.77995 21.1125 3.28866 21.3232 3.81909 21.3232H17.8191C18.3495 21.3232 18.8582 21.1125 19.2333 20.7375C19.6084 20.3624 19.8191 19.8537 19.8191 19.3232V5.32324L16.8191 1.32324H4.81909Z" stroke="#181725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M1.81909 5.32324H19.8191" stroke="#181725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M14.8191 9.32324C14.8191 10.3841 14.3977 11.4015 13.6475 12.1517C12.8974 12.9018 11.88 13.3232 10.8191 13.3232C9.75823 13.3232 8.74081 12.9018 7.99066 12.1517C7.24052 11.4015 6.81909 10.3841 6.81909 9.32324" stroke="#181725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div className="flex items-center mt-4">
              <a href="../profile" className="absolute left-6">
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
              </a>
              <span className="text-xl font-medium flex-1 text-center">Historique des commandes</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex flex-col">
        <div className="flex items-center h-16 shadow">
          <div className="flex w-[15%] justify-center">
            <img src="/assets/cart.svg" alt="Panier" className="w-6 h-6" />
          </div>
          <div className="w-[70%]">
            <p className="font-medium">Imrane Sallak</p>
            <p className="text-sm text-gray-500">Couscous, merguez ...</p>
          </div>
          <div className="flex w-[15%] justify-center">
            <span className="text-lg font-medium">6,95€</span>
          </div>
        </div>

        <div className="flex items-center h-16 shadow">
          <div className="flex w-[15%] justify-center">
            <img src="/assets/cart.svg" alt="Panier" className="w-6 h-6" />
          </div>
          <div className="w-[70%]">
            <p className="font-medium">Mohsen</p>
            <p className="text-sm text-gray-500">Carotte, poisson ...</p>
          </div>
          <div className="flex w-[15%] justify-center">
            <span className="text-lg font-medium">7,50€</span>
          </div>
        </div>

        <div className="flex items-center h-16 shadow">
          <div className="flex w-[15%] justify-center">
            <img src="/assets/cart.svg" alt="Panier" className="w-6 h-6" />
          </div>
          <div className="w-[70%]">
            <p className="font-medium">Dominik</p>
            <p className="text-sm text-gray-500">Fromages, céréale ...</p>
          </div>
          <div className="flex w-[15%] justify-center">
            <span className="text-lg font-medium">12€</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
