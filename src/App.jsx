import { BrowserRouter, Routes, Route } from "react-router";
import { Login } from "@/app/auth/Login.jsx";
import Register from "@/app/auth/Register.jsx";
import AuthIndex from "@/app/auth/AuthIndex.jsx";
import React, { useState } from "react";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="font-inter">
      <header className="min-h-screen bg-[url('/assets/header-background.png')] bg-center bg-cover bg-no-repeat relative">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12">
          <div className="py-6 md:py-8">
            <div className="flex items-center">
              <div className="w-full mb-7/8 md:w-1/6 text-center md:text-left mb-3 md:mb-0">
                <img className="max-h-16 inline-block" src="/assets/logo-mealmates.png" alt="logo" />
              </div>

              <nav className="hidden md:flex">
                <ul className="flex flex-col md:flex-row flex-wrap justify-center md:justify-start gap-2 sm:gap-3 md:gap-4 font-bold text-xs sm:text-base list-none m-0 p-0">
                  <a href="#why-mealmates" className="px-2 py-1 hover:text-[#53B175] transition-colors cursor-pointer">Pourquoi MealMates ?</a>
                  <a href="#how-it-works" className="px-2 py-1 hover:text-[#53B175] transition-colors cursor-pointer">Comment ça marche ?</a>
                  <a href="#testimonials" className="px-2 py-1 hover:text-[#53B175] transition-colors cursor-pointer">Carrière</a>
                </ul>
              </nav>
              <a href="/register" className="hidden md:flex ms-auto bg-[#53B175] text-white px-6 py-3 rounded hover:bg-opacity-90 transition-all font-medium mt-4">
                S'inscrire
              </a>
              <a href="/login" className="hidden md:flex ms-auto bg-white text-black px-6 py-3 rounded hover:bg-opacity-90 transition-all font-medium mt-4">
                Se connecter
              </a>
              <div className="absolute right-10 top-6">
                <div className="md:hidden flex justify-end py-2  ">
                  <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-black focus:outline-none" aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
                    </svg>
                  </button>

                  <nav className={`${isOpen ? " absolute top-10 bg-white rounded w-[40vw] p-5" : "hidden"} `}>
                    <ul className="flex flex-col md:flex-row flex-wrap justify-center md:justify-start gap-2 sm:gap-3 md:gap-4 font-bold text-xs sm:text-base list-none m-0 p-0">
                      <a className="px-2 py-1 hover:text-[#53B175] transition-colors cursor-pointer">Services</a>
                      <a className="px-2 py-1 hover:text-[#53B175] transition-colors cursor-pointer">Comment ça marche ?</a>
                      <a className="px-2 py-1 hover:text-[#53B175] transition-colors cursor-pointer">Carrière</a>
                      <a className="px-2 py-1 hover:text-[#53B175] transition-colors cursor-pointer">Newsletter</a>
                    </ul>
                    <a href="/register" className=" bg-[#53B175] text-white px-6 py-3 rounded hover:bg-opacity-90 transition-all font-medium mt-4">
                      S'inscrire
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <div className=" min-h-3/4 flex items-center">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="w-full lg:w-2/3 text-center lg:text-left mb-5 lg:mb-0">
                <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold">
                  Donnez vos repas,<br className="hidden lg:block"></br> au lieu de les <span className="text-[#53B175]">Gaspiller</span>
                </h1>
                <p className="text-[#53B175] my-4">Mealmates est une plateforme qui vous permet de donner vos repas non consommés à des personnes dans le besoin.</p>
                <a href="/register" className="hidden md:inline-flex bg-[#53B175] text-white px-6 py-3 rounded hover:bg-opacity-90 transition-all font-medium mt-4">Commencer maintenant</a>
              </div>

              <div className="w-full lg:w-1/2 text-center">
                <img className="max-w-4/5 inline-block" src="/assets/preview-mobile.png" alt="application-mobile" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <section>
        <div className="bg-[#53B175] py-16 md:py-24 text-white" id="why-mealmates">
          <div className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12">
            <div className="mb-12">
              <div className="text-center">
                <h2 className="font-bold mb-3 text-3xl md:text-4xl">Pourquoi MealMates ?</h2>
                <p className="opacity-75">Fonctionnalités adaptées à vos besoins</p>
                <span className="w-1/4 mb-5 h-[5px] flex mx-auto bg-[#FDD835] mt-5 rounded"> </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
              <div className="mb-5 flex flex-col">
                <img className="mx-auto mb-4" src="/assets/mdi_neighbourhood.png" alt="fonctionnalité" />
                <h3 className="text-xl md:text-2xl font-bold">Partager vos plats faits maison</h3>
                <p className="px-2 md:px-4 my-auto pt-3">Transformez vos surplus culinaires en opportunités de partage avec votre communauté locale et réduisez le gaspillage alimentaire tout en valorisant vos talents de cuisinier.</p>
              </div>
              <div className="mb-5 flex flex-col">
                <img className="mx-auto mb-4" src="/assets/mdi_fish-food.png" alt="fonctionnalité" />
                <h3 className="text-xl md:text-2xl font-bold">Découvrez des saveurs uniques</h3>
                <p className="px-2 md:px-4 my-auto pt-3">Explorez une diversité de plats préparés par vos voisins, découvrez de nouvelles cuisines et savourez des repas authentiques que vous ne trouverez pas ailleurs.</p>
              </div>
              <div className="mb-5 flex flex-col">
                <img className="mx-auto mb-4" src="/assets/game-icons_receive-money.png" alt="fonctionnalité" />
                <h3 className="text-xl md:text-2xl font-bold">Réduisez votre budget repas</h3>
                <p className="px-2 md:px-4 my-auto pt-3">Accédez à des plats délicieux à prix réduits tout en permettant aux cuisiniers amateurs de rentabiliser leurs préparations en trop.</p>
              </div>

              <div className="mb-5 flex flex-col">
                <img className="mx-auto mb-4" src="/assets/fa-solid_hands-helping.png" alt="fonctionnalité" />
                <h3 className="text-xl md:text-2xl font-bold">Créez des liens</h3>
                <p className="px-2 md:px-4 mb-auto pt-3">Rencontrez les passionnés de cuisine autour de chez vous, échangez autour d'une passion commune et tissez des liens authentiques dans votre communauté.</p>
              </div>
              <div className="mb-5 flex flex-col">
                <img className="mx-auto mb-4" src="/assets/fa6-solid_earth-africa.png" alt="fonctionnalité" />
                <h3 className="text-xl md:text-2xl font-bold">Préservez notre planète</h3>
                <p className="px-2 md:px-4 my-auto pt-3">Chaque repas partagé sur MealMates représente un geste concret pour l'environnement en limitant le gaspillage alimentaire et l'empreinte carbone liée à la production alimentaire.</p>
              </div>
              <div className="mb-5 flex flex-col">
                <img className="mx-auto mb-4" src="/assets/Base_feature_icon.png" alt="fonctionnalité" />
                <h3 className="text-xl md:text-2xl font-bold">Simplifiez votre quotidien</h3>
                <p className="px-2 md:px-4 my-auto pt-3">Une interface intuitive pour proposer ou trouver des plats près de chez vous, des paiements sécurisés et un système d'évaluation transparent pour des échanges en toute confiance.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-12 md:py-16 lg:py-24 text-black" id="how-it-works">
          <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-40 max-w-7xl mx-auto">
            <div className="mb-8 md:mb-12">
              <div className="text-center">
                <h2 className="font-bold mb-3 text-2xl sm:text-3xl md:text-4xl text-black">Comment ça marche MealMates ?</h2>
                <span className="w-16 sm:w-24 md:w-32 h-[5px] flex mx-auto bg-[#FDD835] mt-3 md:mt-5 rounded"> </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 text-center">
              <div className="mb-4 flex flex-col items-center">
                <div className="w-12 h-12 bg-[#53B175] text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">1</div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Inscrivez-vous</h4>
                <p className="px-2 md:px-4 text-sm sm:text-base">Créez votre compte gratuitement en quelques secondes pour accéder à toutes nos offres.</p>
              </div>

              <div className="mb-4 flex flex-col items-center">
                <div className="w-12 h-12 bg-[#53B175] text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">2</div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Parcourez les offres</h4>
                <p className="px-2 md:px-4 text-sm sm:text-base">Découvrez nos paniers et produits à prix réduits près de chez vous.</p>
              </div>

              <div className="mb-4 flex flex-col items-center">
                <div className="w-12 h-12 bg-[#53B175] text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">3</div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Réservez et payez</h4>
                <p className="px-2 md:px-4 text-sm sm:text-base">Choisissez ce qui vous plaît et payez directement via notre application sécurisée.</p>
              </div>

              <div className="mb-4 flex flex-col items-center">
                <div className="w-12 h-12 bg-[#53B175] text-white rounded-full flex items-center justify-center text-xl font-bold mb-4">4</div>
                <h4 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Récupérez vos produits</h4>
                <p className="px-2 md:px-4 text-sm sm:text-base">Récupérez votre commande à l'heure et au lieu indiqués ou optez pour la livraison.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#53B175] text-white py-5" id="testimonials">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-col lg:flex-row">
              <div className="w-full lg:w-5/12 mb-5 lg:mb-0">
                <div className=" mb-5">
                  <img className="hidden lg:block " src="/assets/quote_mark.png" />
                  <h4 className="font-bold mb-2 text-2xl md:text-3xl">Témoignages de clients réels</h4>
                  <span>Inspirez-vous de ces histoires.</span>
                </div>
                <div className="bg-gray-700 rounded-lg p-6 md:p-8 mb-6">
                  <div className="relative pt-2">
                    <img className="absolute top-0 left-0" src="/assets/small_quote_mark.png" />
                    <p className="pl-4">Service impeccable et concept éthique ! J'apprécie particulièrement la transparence sur les dates de péremption et les descriptions précises des produits. La livraison est toujours ponctuelle et l'application facile à utiliser. Je recommande vivement à tous ceux qui souhaitent consommer de manière plus responsable sans se ruiner.</p>
                    <div className="flex items-center mt-4">
                      <img className="" src="/assets/user-icon-default.png" />
                      <p className="font-bold ms-4">Sophie M.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-7/12">
                <div className="flex flex-col">
                  <div className="w-full md:w-10/12 lg:w-9/12 ms-0 sm:ms-5 mb-4">
                    <div className="bg-gray-700 rounded-lg p-6 md:p-8">
                      <div className="relative pt-2">
                        <img className="absolute top-0 left-0" src="/assets/small_quote_mark.png" />
                        <p className="pl-4">Grâce à ce service, je fais des économies considérables tout en contribuant à la lutte contre le gaspillage alimentaire ! J'ai découvert de nouveaux produits que je n'aurais jamais essayés autrement. La qualité est toujours au rendez-vous malgré les dates courtes. Un concept brillant et responsable.</p>
                        <div className="flex items-center mt-4">
                          <img className="" src="/assets/user-icon-default.png" />
                          <p className="font-bold ms-4">Marie L.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full md:w-8/12 lg:w-9/12 ms-0 sm:ms-5">
                    <div className="bg-gray-700 rounded-lg p-5">
                      <div className="relative pt-2">
                        <img className="absolute top-0 left-0" src="/assets/small_quote_mark.png" />
                        <p className="pl-4">En tant que famille nombreuse, ce site est une véritable aubaine. Les paniers surprises nous permettent de varier notre alimentation à petit prix. Les enfants adorent découvrir ce que contient le colis, c'est devenu notre petit rituel hebdomadaire. Et quel plaisir de savoir que nous sauvons ces produits de la poubelle !</p>
                        <div className="flex items-center mt-4">
                          <img className="" src="/assets/user-icon-default.png" />
                          <p className="font-bold ms-4">Thomas D.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="w-full bg-gray-900 text-gray-100 border-t border-gray-800 px-6 md:px-12 py-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-10">
            <div className="mb-8 md:mb-0 md:w-1/4 flex justify-center md:justify-start">
              <img className="max-h-16" src="/assets/logo-mealmates.png" alt="logo" />
            </div>
            <div className="mb-8 md:mb-0 md:w-1/4 flex flex-col items-center md:items-start">
              <span className="font-bold text-lg mb-3">Liens rapides</span>
              <ul className="flex flex-col gap-2 font-medium text-sm list-none m-0 p-0">
                <li>
                  <a href="#why-mealmates" className="hover:text-[#53B175] transition-colors cursor-pointer">Pourquoi MealMates ?</a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-[#53B175] transition-colors cursor-pointer">Comment ça marche ?</a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-[#53B175] transition-colors cursor-pointer">Carrière</a>
                </li>
              </ul>
            </div>
            <div className="md:w-1/4 flex flex-col items-center md:items-end text-sm text-gray-300">
              <span className="font-bold text-lg mb-3">Contact</span>
              <span className="mb-1">Email : <a href="mailto:contact@mealmates.fr" className="hover:text-[#53B175] transition-colors">contact@mealmates.fr</a></span>
              <span className="mb-1">Tél : <a href="tel:0123456789" className="hover:text-[#53B175] transition-colors">01 23 45 67 89</a></span>
              <span>Adresse : 123 rue de la Cuisine, Paris</span>
            </div>
          </div>
        </div>
        <p className="text-center py-6 mb-0 text-xs sm:text-sm md:text-base lg:text-lg">©️ 2025 MealMates. Tous droits réservés</p>
      </footer>
    </div>
  );
}

export default App;
