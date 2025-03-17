import App from "@/App.jsx";

function Home() {
    return (
        <div className="font-inter">
            {/* En-tête du site */}
            <header className="min-h-screen bg-[url('/public/header-background.png')] bg-center bg-cover bg-no-repeat relative">
                <div className="mx-auto w-full max-w-7xl px-6 md:px-8 lg:px-12">
                    {/* Barre de navigation responsive */}
                    <div className="py-6 md:py-8">
                        <div className="flex flex-col md:flex-row items-center">
                            {/* Logo */}
                            <div className="w-full md:w-1/6 text-center md:text-left mb-3 md:mb-0">
                                <img className="max-h-16 inline-block" src="../../public/logo-mealmate.png" alt="logo" />
                            </div>

                            {/* Menu de navigation */}
                            <div className="w-full md:w-7/12">
                                <nav className="flex justify-center md:justify-start">
                                    <ul className="flex flex-wrap font-bold list-none m-0 p-0">
                                        <li className="me-4 mb-2">Services</li>
                                        <li className="mx-4 mb-2">Tarifs</li>
                                        <li className="mx-4 mb-2">Carrière</li>
                                        <li className="ms-4 mb-2">Contact</li>
                                    </ul>
                                </nav>
                            </div>

                            {/* Bouton d'inscription */}
                            <div className="w-full md:w-1/4 text-center md:text-right mt-3 md:mt-0">
                                <button className="bg-[#53B175] text-white px-6 py-3 rounded hover:bg-opacity-90 transition-all font-medium">S'inscrire</button>
                            </div>
                        </div>
                    </div>

                    {/* Section principale de l'en-tête */}
                    <div className="py-16 md:py-24 min-h-3/4 flex items-center">
                        <div className="flex flex-col lg:flex-row items-center">
                            {/* Texte de présentation */}
                            <div className="w-full lg:w-2/3 text-center lg:text-left mb-5 lg:mb-0">
                                <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold">
                                    Donnez vos repas,<br className="hidden lg:block"></br> au lieu de les <span className="text-[#53B175]">Gaspiller</span>
                                </h1>
                                <p className="text-[#53B175] my-4">
                                    Mealmate est une plateforme qui vous permet de donner vos repas non consommés à des personnes dans le besoin.
                                </p>
                                <button className="bg-[#53B175] text-white px-6 py-3 rounded hover:bg-opacity-90 transition-all font-medium mt-4">S'inscrire</button>
                            </div>

                            {/* Image de l'application mobile */}
                            <div className="w-full lg:w-1/2 text-center">
                                <img className="max-w-4/5 inline-block" src="../../public/mobile.png" alt="application-mobile" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Corps principal du site */}
            <section>
                {/* Première section - Pourquoi MealMates */}
                <div className="bg-[#53B175] py-16 md:py-24 text-white">
                    <div className="mx-auto max-w-6xl px-6 md:px-8 lg:px-12">
                        <div className="mb-12">
                            <div className="text-center">
                                <h2 className="font-bold mb-3 text-3xl md:text-4xl">
                                    Pourquoi MealMates ?
                                </h2>
                                <p className="opacity-75">Fonctionnalités adaptées à vos besoins</p>
                            </div>
                        </div>

                        {/* Grille des caractéristiques */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
                            <div className="mb-5">
                                <img className="mx-auto mb-4" src="mdi_neighbourhood.png" alt="fonctionnalité" />
                                <h3 className="text-xl md:text-2xl font-bold">Partager vos plats faits maison</h3>
                                <p className="opacity-75 px-2 md:px-4">
                                    Transformez vos surplus culinaires en opportunités de partage avec votre communauté locale et réduisez le gaspillage alimentaire tout en valorisant vos talents de cuisinier.
                                </p>
                            </div>
                            <div className="mb-5">
                                <img className="mx-auto mb-4" src="mdi_fish-food.png" alt="fonctionnalité" />
                                <h3 className="text-xl md:text-2xl font-bold">Découvrez des saveurs uniques</h3>
                                <p className="opacity-75 px-2 md:px-4">
                                    Explorez une diversité de plats préparés par vos voisins, découvrez de nouvelles cuisines et savourez des repas authentiques que vous ne trouverez pas ailleurs.
                                </p>
                            </div>
                            <div className="mb-5">
                                <img className="mx-auto mb-4" src="game-icons_receive-money.png" alt="fonctionnalité" />
                                <h3 className="text-xl md:text-2xl font-bold">Réduisez votre budget repas</h3>
                                <p className="opacity-75 px-2 md:px-4">
                                    Accédez à des plats délicieux à prix réduits tout en permettant aux cuisiniers amateurs de rentabiliser leurs préparations en trop.
                                </p>
                            </div>

                            <div className="mb-5">
                                <img className="mx-auto mb-4" src="../../public/fa-solid_hands-helping.png" alt="fonctionnalité" />
                                <h3 className="text-xl md:text-2xl font-bold">Créez des liens dans votre quartier</h3>
                                <p className="opacity-75 px-2 md:px-4">
                                    Rencontrez les passionnés de cuisine autour de chez vous, échangez autour d'une passion commune et tissez des liens authentiques dans votre communauté.
                                </p>
                            </div>
                            <div className="mb-5">
                                <img className="mx-auto mb-4" src="../../public/fa6-solid_earth-africa.png" alt="fonctionnalité" />
                                <h3 className="text-xl md:text-2xl font-bold">Préservez notre planète</h3>
                                <p className="opacity-75 px-2 md:px-4">
                                    Chaque repas partagé sur MealMates représente un geste concret pour l'environnement en limitant le gaspillage alimentaire et l'empreinte carbone liée à la production alimentaire.
                                </p>
                            </div>
                            <div className="mb-5">
                                <img className="mx-auto mb-4" src="../../public/Base_feature_icon.png" alt="fonctionnalité" />
                                <h3 className="text-xl md:text-2xl font-bold">Simplifiez votre quotidien</h3>
                                <p className="opacity-75 px-2 md:px-4">
                                    Une interface intuitive pour proposer ou trouver des plats près de chez vous, des paiements sécurisés et un système d'évaluation transparent pour des échanges en toute confiance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Séparateur - Statistiques */}
                <div className="py-16 md:py-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="flex flex-col lg:flex-row items-center">
                            <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
                                <h4 className="mb-3 text-2xl md:text-3xl font-bold">Nos 18 années de succès</h4>
                                <span className="text-[#53B175] block">Grâce à nos atouts, nous avons atteint ces résultats</span>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[#53B175]">
                                    <div className="flex items-center mb-4">
                                        <div>
                                            <img src="../../public/Base_feature_icon4.png" alt="icône" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="mb-0 font-bold">10 000+</p>
                                            <span>Téléchargements par jour</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center mb-4">
                                        <div>
                                            <img src="../../public/Base_feature_icon4.png" alt="icône" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="mb-0 font-bold">2 Millions</p>
                                            <span>Utilisateurs</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center mb-4 sm:mb-0">
                                        <div>
                                            <img src="../../public/Base_feature_icon4.png" alt="icône" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="mb-0 font-bold">500+</p>
                                            <span>Clients</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center">
                                        <div>
                                            <img src="../../public/Base_feature_icon4.png" alt="icône" />
                                        </div>
                                        <div className="ml-3">
                                            <p className="mb-0 font-bold">140</p>
                                            <span>Pays</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deuxième section - Témoignages */}
                <div className="bg-[#53B175] text-white py-5">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="flex flex-col lg:flex-row">
                            <div className="w-full lg:w-5/12 mb-5 lg:mb-0">
                                <div className="relative mb-5">
                                    <img className="hidden lg:block absolute -top-10 -left-20" src="../../public/quote_mark.png"/>
                                    <h4 className="font-bold mb-2 text-2xl md:text-3xl">Témoignages de clients réels</h4>
                                    <span>Inspirez-vous de ces histoires.</span>
                                </div>
                                <div className="bg-gray-700 rounded-lg p-6 md:p-8 mb-6">
                                    <img className="max-w-32 mb-4" src="../../public/client_logo1.png" />
                                    <div className="relative pt-2">
                                        <img className="absolute top-0 left-0" src="../../public/small_quote_mark.png" />
                                        <p className="pl-4">
                                            Pour démarrer rapidement la conception de la page d'accueil de ma startup, je cherchais un kit UI. MealMates est l'un des meilleurs kits UI que j'ai pu trouver. Il est flexible, bien organisé et facilement modifiable.
                                        </p>
                                        <p className="font-bold mt-4">
                                            Floyd Miles <br /> <span className="font-normal">Vice-Président, GoPro</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full lg:w-7/12">
                                <div className="flex flex-col">
                                    <div className="w-full md:w-10/12 lg:w-full mx-auto mb-4">
                                        <div className="bg-gray-700 rounded-lg p-6 md:p-8">
                                            <img className="max-w-32 mb-4" src="../../public/client_logo2.png" />
                                            <div className="relative pt-2">
                                                <img className="absolute top-0 left-0" src="../../public/small_quote_mark.png" />
                                                <p className="pl-4">
                                                    J'ai utilisé MealMates et créé une page d'accueil pour ma startup en une semaine. Le kit UI de MealMates est simple et très intuitif, donc tout le monde peut l'utiliser.
                                                </p>
                                                <p className="font-bold mt-4">
                                                    Jane Cooper <br /> <span className="font-normal">PDG, Airbnb</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-8/12 lg:w-9/12 mx-auto">
                                        <div className="bg-gray-700 rounded-lg p-5">
                                            <img className="max-w-32 mb-4" src="../../public/client_logo3.png" />
                                            <div className="relative pt-2">
                                                <img className="absolute top-0 left-0" src="../../public/small_quote_mark.png" />
                                                <p className="pl-4">
                                                    MealMates nous a fait gagner du temps dans la conception de la page de notre entreprise.
                                                </p>
                                                <p className="font-bold mt-4">
                                                    Kristin Watson <br /> <span className="font-normal">Co-fondatrice, Strapi</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deuxième séparateur - Intégrations */}
                <div className="py-16 md:py-20">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="flex flex-col lg:flex-row items-center">
                            <div className="w-full lg:w-1/2 mb-5 lg:mb-0">
                                <h4 className="mb-3 text-2xl md:text-3xl font-bold">Connectez-vous avec vos applications préférées</h4>
                                <span className="text-[#53B175] block">Connectez-vous avec vos outils favoris que vous utilisez quotidiennement et gardez le contrôle sur vos activités.</span>
                            </div>
                            <div className="w-full lg:w-1/2 text-center">
                                <div className="relative">
                                    <img className="w-full" src="../../public/vector.png" />
                                    <img className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-4/5" src="../../public/vectorLogos.png" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Troisième section - Application mobile */}
                <div className="bg-[#53B175] text-white py-5">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="flex flex-col lg:flex-row items-center">
                            <div className="w-full lg:w-1/2 mb-5 lg:mb-0">
                                <div className="pe-0 lg:pe-5">
                                    <h4 className="font-bold mb-4 text-2xl md:text-3xl">Gérez tous vos restaurants depuis votre mobile</h4>
                                    <span className="block">Téléchargez l'application pour gérer vos restaurants, suivre les ventes et accomplir vos tâches sans procrastiner. Restez sur la bonne voie et terminez à temps !</span>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="flex">
                                    <div className="w-1/2 text-center">
                                        <img className="w-full" src="../../public/phone_mockup_1.png" alt="maquette téléphone 1" />
                                    </div>
                                    <div className="w-1/2 text-center mt-0 md:mt-5">
                                        <img className="w-full" src="../../public/phone_mockup_2.png" alt="maquette téléphone 2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pied de page */}
            <footer>
                <div className="py-5">
                    <div className="mx-auto max-w-6xl px-4">
                        <div className="flex flex-col lg:flex-row items-center">
                            <div className="w-full lg:w-1/2 mb-4 lg:mb-0">
                                <h4 className="mb-3 text-2xl md:text-3xl font-bold">Abonnez-vous à notre newsletter</h4>
                                <span className="text-[#53B175] block">Abonnez-vous pour recevoir chaque semaine des nouvelles de notre entreprise et restez informé</span>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="w-full sm:w-7/12">
                                        <input className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#53B175] focus:border-transparent" type="text" placeholder="Entrez votre email" />
                                    </div>
                                    <div className="w-full sm:w-5/12">
                                        <button className="w-full bg-[#53B175] text-white p-3 rounded hover:bg-opacity-90 transition-all font-medium">S'abonner</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-center py-6 mb-0 text-sm">©️ 2023 MealMates. Tous droits réservés</p>
            </footer>
        </div>
    );
}

export default Home;