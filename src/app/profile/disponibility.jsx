import React from "react";

export const Disponibility = () => {
  const days = [
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
    "Dimanche"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-6">
          <div className="relative flex flex-col items-center">
            <a href="../profile" className="w-full">
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
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
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-4">
                    <img src="/assets/clock.svg" alt="Montre" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-medium">Disponibilités</span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6">
        <div className="space-y-4">
          {days.map((day) => (
            <div key={day} className="flex items-center">
              <div className="text-xl font-medium w-1/2">{day}</div>
              <div className="flex gap-3 flex-1">
                <input
                  type="time"
                  defaultValue="17:00"
                  className="bg-gray-100 px-4 py-2 rounded-lg w-28 text-center"
                />
                <input
                  type="time"
                  defaultValue="20:00"
                  className="bg-gray-100 px-4 py-2 rounded-lg w-28 text-center"
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Disponibility;