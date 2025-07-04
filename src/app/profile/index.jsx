import {useAuth} from "@/context/AuthContext.jsx";
import {Button} from "@/components/ui/button";
import Layout from "../Layout";
import {ListIcon} from "lucide-react";

export const Profile = () => {
    const {user, logout} = useAuth();

    return (
        <Layout>
            <div className="flex flex-col h-[90%]">
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-4 px-6 flex items-center">
                        <div className="flex items-center">
                            <img src="/assets/profile.svg" alt="Profile" className="h-16"/>
                        </div>
                        <div className="flex flex-col items-start space-x-4 pl-5">
              <span className="text-gray-700 font-bold">
                {user?.firstName} {user?.lastName}
              </span>
                            <span className="text-gray-700">{user?.email}</span>
                        </div>
                    </div>
                </header>

                <main className="flex flex-col">
                    <a href="profile/products" className="flex items-center h-16 shadow">
                        <div className="flex w-[15%] justify-center">
                            <svg width="31" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"
                                 fill="#000000">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path fill="#181725"
                                          d="M128 352.576V352a288 288 0 0 1 491.072-204.224 192 192 0 0 1 274.24 204.48 64 64 0 0 1 57.216 74.24C921.6 600.512 850.048 710.656 736 756.992V800a96 96 0 0 1-96 96H384a96 96 0 0 1-96-96v-43.008c-114.048-46.336-185.6-156.48-214.528-330.496A64 64 0 0 1 128 352.64zm64-.576h64a160 160 0 0 1 320 0h64a224 224 0 0 0-448 0zm128 0h192a96 96 0 0 0-192 0zm439.424 0h68.544A128.256 128.256 0 0 0 704 192c-15.36 0-29.952 2.688-43.52 7.616 11.328 18.176 20.672 37.76 27.84 58.304A64.128 64.128 0 0 1 759.424 352zM672 768H352v32a32 32 0 0 0 32 32h256a32 32 0 0 0 32-32v-32zm-342.528-64h365.056c101.504-32.64 165.76-124.928 192.896-288H136.576c27.136 163.072 91.392 255.36 192.896 288z"></path>
                                </g>
                            </svg>
                        </div>
                        <div className="w-[70%]">
                            <span className="text-xl">Mes produits</span>
                        </div>
                        <div className="flex w-[15%] justify-center">
                            <svg width="10" height="15" viewBox="0 0 10 15" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_470_397)">
                                    <path
                                        d="M1.01006 2.09166C0.812929 1.89166 0.703411 1.6285 0.714363 1.35482C0.714363 1.08114 0.82388 0.828504 1.03196 0.628504C1.2291 0.43903 1.50289 0.323241 1.78764 0.323241C2.07238 0.323241 2.34618 0.417979 2.55426 0.607452L8.75296 6.56535C8.85152 6.66008 8.92818 6.77587 8.98294 6.90219C9.0377 7.0285 9.07056 7.16535 9.07056 7.30219C9.07056 7.43903 9.0377 7.57587 8.98294 7.71272C8.92818 7.83903 8.85152 7.95482 8.75296 8.04956L2.55426 14.0075C2.45569 14.1022 2.33522 14.1864 2.2038 14.239C2.06143 14.2917 1.91906 14.3232 1.77668 14.3232C1.63431 14.3232 1.48099 14.3022 1.34956 14.2496C1.21814 14.1969 1.09767 14.1127 0.988156 14.018C0.88959 13.9232 0.812928 13.7969 0.758169 13.6706C0.692458 13.5443 0.670555 13.4075 0.670555 13.2601C0.670555 13.1232 0.70341 12.9864 0.758169 12.8601C0.812928 12.7338 0.900542 12.618 1.01006 12.5127L6.43118 7.30219L5.40172 6.32324L1.01006 2.09166Z"
                                        fill="#181725"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_470_397">
                                        <rect width="8.4" height="14" fill="white"
                                              transform="translate(9.07056 14.3232) rotate(-180)"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </a>
                    <a href="/profile/bookings" className="flex items-center h-16 shadow">
                        <div className="flex w-[15%] justify-center">
                            <ListIcon/>
                        </div>
                        <div className="w-[70%] flex items-center space-x-2">
                            <p className="text-xl">Réservations</p>
                            <p className="text-emerald-800">(2 en attente)</p>
                        </div>
                        <div className="flex w-[15%] justify-center">
                            <svg width="10" height="15" viewBox="0 0 10 15" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_470_397)">
                                    <path
                                        d="M1.01006 2.09166C0.812929 1.89166 0.703411 1.6285 0.714363 1.35482C0.714363 1.08114 0.82388 0.828504 1.03196 0.628504C1.2291 0.43903 1.50289 0.323241 1.78764 0.323241C2.07238 0.323241 2.34618 0.417979 2.55426 0.607452L8.75296 6.56535C8.85152 6.66008 8.92818 6.77587 8.98294 6.90219C9.0377 7.0285 9.07056 7.16535 9.07056 7.30219C9.07056 7.43903 9.0377 7.57587 8.98294 7.71272C8.92818 7.83903 8.85152 7.95482 8.75296 8.04956L2.55426 14.0075C2.45569 14.1022 2.33522 14.1864 2.2038 14.239C2.06143 14.2917 1.91906 14.3232 1.77668 14.3232C1.63431 14.3232 1.48099 14.3022 1.34956 14.2496C1.21814 14.1969 1.09767 14.1127 0.988156 14.018C0.88959 13.9232 0.812928 13.7969 0.758169 13.6706C0.692458 13.5443 0.670555 13.4075 0.670555 13.2601C0.670555 13.1232 0.70341 12.9864 0.758169 12.8601C0.812928 12.7338 0.900542 12.618 1.01006 12.5127L6.43118 7.30219L5.40172 6.32324L1.01006 2.09166Z"
                                        fill="#181725"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_470_397">
                                        <rect width="8.4" height="14" fill="white"
                                              transform="translate(9.07056 14.3232) rotate(-180)"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </a>
                    <a href="profile/history" className="flex items-center h-16 shadow">
                        <div className="flex w-[15%] justify-center">
                            <svg width="21" height="23" viewBox="0 0 21 23" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M4.81909 1.32324L1.81909 5.32324V19.3232C1.81909 19.8537 2.02981 20.3624 2.40488 20.7375C2.77995 21.1125 3.28866 21.3232 3.81909 21.3232H17.8191C18.3495 21.3232 18.8582 21.1125 19.2333 20.7375C19.6084 20.3624 19.8191 19.8537 19.8191 19.3232V5.32324L16.8191 1.32324H4.81909Z"
                                    stroke="#181725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M1.81909 5.32324H19.8191" stroke="#181725" stroke-width="2"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                                <path
                                    d="M14.8191 9.32324C14.8191 10.3841 14.3977 11.4015 13.6475 12.1517C12.8974 12.9018 11.88 13.3232 10.8191 13.3232C9.75823 13.3232 8.74081 12.9018 7.99066 12.1517C7.24052 11.4015 6.81909 10.3841 6.81909 9.32324"
                                    stroke="#181725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div className="w-[70%]">
                            <span className="text-xl">Historique des commandes</span>
                        </div>
                        <div className="flex w-[15%] justify-center">
                            <svg width="10" height="15" viewBox="0 0 10 15" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_470_397)">
                                    <path
                                        d="M1.01006 2.09166C0.812929 1.89166 0.703411 1.6285 0.714363 1.35482C0.714363 1.08114 0.82388 0.828504 1.03196 0.628504C1.2291 0.43903 1.50289 0.323241 1.78764 0.323241C2.07238 0.323241 2.34618 0.417979 2.55426 0.607452L8.75296 6.56535C8.85152 6.66008 8.92818 6.77587 8.98294 6.90219C9.0377 7.0285 9.07056 7.16535 9.07056 7.30219C9.07056 7.43903 9.0377 7.57587 8.98294 7.71272C8.92818 7.83903 8.85152 7.95482 8.75296 8.04956L2.55426 14.0075C2.45569 14.1022 2.33522 14.1864 2.2038 14.239C2.06143 14.2917 1.91906 14.3232 1.77668 14.3232C1.63431 14.3232 1.48099 14.3022 1.34956 14.2496C1.21814 14.1969 1.09767 14.1127 0.988156 14.018C0.88959 13.9232 0.812928 13.7969 0.758169 13.6706C0.692458 13.5443 0.670555 13.4075 0.670555 13.2601C0.670555 13.1232 0.70341 12.9864 0.758169 12.8601C0.812928 12.7338 0.900542 12.618 1.01006 12.5127L6.43118 7.30219L5.40172 6.32324L1.01006 2.09166Z"
                                        fill="#181725"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_470_397">
                                        <rect width="8.4" height="14" fill="white"
                                              transform="translate(9.07056 14.3232) rotate(-180)"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </a>
                    <a href="profile/address" className="flex items-center h-16 shadow">
                        <div className="flex w-[15%] justify-center">
                            <svg width="19" height="24" viewBox="0 0 19 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M1 10.363C1.01577 5.68116 4.7917 1.89869 9.43376 1.9146C14.0758 1.93051 17.8262 5.73876 17.8104 10.4206V10.5166C17.7533 13.5599 16.0684 16.3728 14.0028 18.5713C12.8215 19.8086 11.5023 20.9039 10.0715 21.8355C9.68895 22.1693 9.12146 22.1693 8.73888 21.8355C6.60591 20.4353 4.73387 18.6674 3.20839 16.6129C1.84876 14.8212 1.07681 12.6466 1 10.3918L1 10.363Z"
                                    stroke="#181725"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M9.40523 12.8877C10.6984 12.8877 11.7467 11.8304 11.7467 10.5261C11.7467 9.22186 10.6984 8.16455 9.40523 8.16455C8.11205 8.16455 7.06372 9.22186 7.06372 10.5261C7.06372 11.8304 8.11205 12.8877 9.40523 12.8877Z"
                                      stroke="#181725" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <div className="w-[70%]">
                            <span className="text-xl">Adresse de livraison</span>
                        </div>
                        <div className="flex w-[15%] justify-center">
                            <svg width="10" height="15" viewBox="0 0 10 15" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_470_397)">
                                    <path
                                        d="M1.01006 2.09166C0.812929 1.89166 0.703411 1.6285 0.714363 1.35482C0.714363 1.08114 0.82388 0.828504 1.03196 0.628504C1.2291 0.43903 1.50289 0.323241 1.78764 0.323241C2.07238 0.323241 2.34618 0.417979 2.55426 0.607452L8.75296 6.56535C8.85152 6.66008 8.92818 6.77587 8.98294 6.90219C9.0377 7.0285 9.07056 7.16535 9.07056 7.30219C9.07056 7.43903 9.0377 7.57587 8.98294 7.71272C8.92818 7.83903 8.85152 7.95482 8.75296 8.04956L2.55426 14.0075C2.45569 14.1022 2.33522 14.1864 2.2038 14.239C2.06143 14.2917 1.91906 14.3232 1.77668 14.3232C1.63431 14.3232 1.48099 14.3022 1.34956 14.2496C1.21814 14.1969 1.09767 14.1127 0.988156 14.018C0.88959 13.9232 0.812928 13.7969 0.758169 13.6706C0.692458 13.5443 0.670555 13.4075 0.670555 13.2601C0.670555 13.1232 0.70341 12.9864 0.758169 12.8601C0.812928 12.7338 0.900542 12.618 1.01006 12.5127L6.43118 7.30219L5.40172 6.32324L1.01006 2.09166Z"
                                        fill="#181725"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_470_397">
                                        <rect width="8.4" height="14" fill="white"
                                              transform="translate(9.07056 14.3232) rotate(-180)"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </a>
                    <a href="profile/review" className="flex items-center h-16 shadow">
                        <div className="flex w-[15%] justify-center">
                            <img src="/assets/star.svg" alt="Etoile"/>
                        </div>
                        <div className="w-[70%]">
                            <span className="text-xl">Avis</span>
                        </div>
                        <div className="flex w-[15%] justify-center">
                            <svg width="10" height="15" viewBox="0 0 10 15" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_470_397)">
                                    <path
                                        d="M1.01006 2.09166C0.812929 1.89166 0.703411 1.6285 0.714363 1.35482C0.714363 1.08114 0.82388 0.828504 1.03196 0.628504C1.2291 0.43903 1.50289 0.323241 1.78764 0.323241C2.07238 0.323241 2.34618 0.417979 2.55426 0.607452L8.75296 6.56535C8.85152 6.66008 8.92818 6.77587 8.98294 6.90219C9.0377 7.0285 9.07056 7.16535 9.07056 7.30219C9.07056 7.43903 9.0377 7.57587 8.98294 7.71272C8.92818 7.83903 8.85152 7.95482 8.75296 8.04956L2.55426 14.0075C2.45569 14.1022 2.33522 14.1864 2.2038 14.239C2.06143 14.2917 1.91906 14.3232 1.77668 14.3232C1.63431 14.3232 1.48099 14.3022 1.34956 14.2496C1.21814 14.1969 1.09767 14.1127 0.988156 14.018C0.88959 13.9232 0.812928 13.7969 0.758169 13.6706C0.692458 13.5443 0.670555 13.4075 0.670555 13.2601C0.670555 13.1232 0.70341 12.9864 0.758169 12.8601C0.812928 12.7338 0.900542 12.618 1.01006 12.5127L6.43118 7.30219L5.40172 6.32324L1.01006 2.09166Z"
                                        fill="#181725"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_470_397">
                                        <rect width="8.4" height="14" fill="white"
                                              transform="translate(9.07056 14.3232) rotate(-180)"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </a>
                    <div className="flex justify-center p-10">
                        <Button variant="outline" onClick={logout}
                                className="text-button-green bg-gray-200 w-70 h-12 text-xl justify-evenly">
                            <svg width="17" height="16" viewBox="0 0 17 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M6.34626 14.0732H3.17043C2.74929 14.0732 2.3454 13.9273 2.04761 13.6677C1.74982 13.408 1.58252 13.0559 1.58252 12.6887V2.99771C1.58252 2.63054 1.74982 2.2784 2.04761 2.01877C2.3454 1.75914 2.74929 1.61328 3.17043 1.61328H6.34626"
                                    stroke="#53B175" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M11.9038 11.304L15.8736 7.84291L11.9038 4.38184" stroke="#53B175"
                                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M15.8737 7.84326H6.34619" stroke="#53B175" stroke-width="2"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Se déconnecter
                        </Button>
                    </div>
                </main>
            </div>
        </Layout>
    );
};

export default Profile;
