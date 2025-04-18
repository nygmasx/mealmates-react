import React from "react";

const preferences = [
  "Végétarien", "Végan", "Pescatarien", "Sans gluten", "Sans lactose",
  "Keto", "Paleo", "Faible en glucide", "Halal", "Kasher"
];

const Preference = () => {
  return (
    <div className="max-w-md mx-auto p-6">
      <a href="../profile" className="block">
        <div className="flex justify-center mb-4">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 2.60665H1.9V2.70665V13.4323V13.5323H2H18H18.1V13.4323V2.70665V2.60665H18H2ZM2 0.661523H18C18.5016 0.661523 18.9841 0.875161 19.3411 1.25801C19.6982 1.64109 19.9 2.16207 19.9 2.70665V13.4323C19.9 13.9768 19.6982 14.4978 19.3411 14.8809C18.9841 15.2637 18.5016 15.4774 18 15.4774H2C1.49844 15.4774 1.01587 15.2637 0.658928 14.8809C0.30176 14.4978 0.1 13.9768 0.1 13.4323V2.70665C0.1 2.16207 0.30176 1.64109 0.658928 1.25801C1.01587 0.875161 1.49844 0.661523 2 0.661523ZM11 4.95177H16C16.2363 4.95177 16.4646 5.05241 16.634 5.23411C16.8036 5.41605 16.9 5.66422 16.9 5.92433C16.9 6.18444 16.8036 6.43261 16.634 6.61455C16.4646 6.79626 16.2363 6.89689 16 6.89689H11C10.7637 6.89689 10.5354 6.79626 10.366 6.61455C10.1964 6.43261 10.1 6.18444 10.1 5.92433C10.1 5.66422 10.1964 5.41605 10.366 5.23411C10.5354 5.05241 10.7637 4.95177 11 4.95177ZM11 8.16945H16C16.2363 8.16945 16.4646 8.27009 16.634 8.45179C16.8036 8.63373 16.9 8.8819 16.9 9.14202C16.9 9.40213 16.8036 9.6503 16.634 9.83224C16.4646 10.0139 16.2363 10.1146 16 10.1146H11C10.7637 10.1146 10.5354 10.0139 10.366 9.83224C10.1964 9.6503 10.1 9.40213 10.1 9.14202C10.1 8.8819 10.1964 8.63373 10.366 8.45179C10.5354 8.27009 10.7637 8.16945 11 8.16945Z"
              fill="#181725"
              stroke="white"
              stroke-width="0.2"
            />
            <g clip-path="url(#clip0_470_401)">
              <path
                d="M6.75017 5.75724V6.31994C6.75017 6.62436 6.61258 6.91032 6.3741 7.11326C6.12644 7.32543 5.80541 7.44535 5.46603 7.44535C5.12665 7.44535 4.79644 7.32543 4.55796 7.11326C4.31947 6.91032 4.18188 6.62436 4.18188 6.31994V5.75724C4.18188 5.46205 4.31947 5.17609 4.55796 4.96392C4.79644 4.75176 5.12665 4.63184 5.46603 4.63184C5.80541 4.63184 6.12644 4.75176 6.3741 4.96392C6.61258 5.17609 6.75017 5.46205 6.75017 5.75724Z"
                fill="#181725"
              />
              <path
                d="M7.71325 9.07827V9.5395C7.71325 9.76089 7.60318 9.98228 7.4289 10.1391C7.24545 10.2959 6.9978 10.3882 6.75014 10.3882H4.18186C3.92503 10.3882 3.67737 10.2959 3.5031 10.1391C3.31965 9.98228 3.21875 9.76089 3.21875 9.5395V9.0506C3.21875 8.73696 3.32882 8.42332 3.53061 8.16503C3.73241 7.90674 4.01675 7.7038 4.34696 7.58388C4.39282 7.57465 4.42951 7.56543 4.47538 7.56543C4.52124 7.56543 4.55793 7.57465 4.60379 7.58388H6.24566C6.264 7.58388 6.27317 7.58388 6.28235 7.5931C6.28235 7.58388 6.29152 7.58388 6.29152 7.58388C6.43828 7.57465 6.53 7.58388 6.53918 7.58388C6.88773 7.7038 7.18125 7.90674 7.39221 8.17426C7.59401 8.44177 7.71325 8.75541 7.71325 9.07827Z"
                fill="#181725"
              />
            </g>
            <defs>
              <clipPath id="clip0_470_401">
                <rect width="6" height="7.68429" fill="white" transform="translate(3 4.63184)" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div className="flex items-center justify-center mb-6 gap-2">
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
          <h1 className="text-2xl font-semibold text-[#181725]">Préférences alimentaires</h1>
        </div>
      </a>

      <div className="grid grid-cols-2 gap-4">
        {preferences.map((preference, index) => (
          <label key={index} className="flex items-center space-x-3">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-2 border-gray-300 checked:border-[#53B175] checked:bg-[#53B175] focus:ring-[#53B175] relative appearance-none checked:before:absolute checked:before:inset-0 checked:before:content-['✓'] checked:before:text-white checked:before:flex checked:before:items-center checked:before:justify-center checked:before:text-sm"
            />
            <span className="text-gray-700">{preference}</span>
          </label>
        ))}
      </div>

      <button className="w-full mt-6 bg-[#53B175] text-white py-3 rounded-lg text-lg font-medium">
        Continuer
      </button>
    </div>
  );
};

export default Preference;
