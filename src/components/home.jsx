export function Home({

}) {
    return (
        <div className="inter">
            {/* En-tête du site */}
            <header>
                <div className="fullPageMargin position-relative">
                    {/* Barre de navigation */}
                    <div className="col-12 position-absolute top-0 mt-5">
                        <div className="row mx-0">
                            {/* Logo */}
                            <div className='col-1 position-relative image-logo'>
                                <img className='position-absolute top-0' src="../../public/logo-mealmate.png" alt="logo" />
                            </div>

                            {/* Menu de navigation */}
                            <div className="col d-flex me-auto">
                                <nav>
                                    <ul className='d-flex bold'>
                                        <li>Services</li>
                                        <li className="mx-5">Tarifs</li>
                                        <li className="me-5">Carrière</li>
                                        <li>Contact</li>
                                    </ul>
                                </nav>
                            </div>
                            {/* Bouton d'inscription */}
                            <div className='col d-flex'>
                                <button className='col-2 ms-auto btn btn-success col-3 p-3'>S'inscrire</button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Section principale de l'en-tête */}
                    <div className="row mx-0">
                        {/* Texte de présentation */}
                        <div className="header-description d-flex col-6 my-auto flex-column">
                            <h1 className="mt-auto">
                                Donnez vos repas,<br></br> au lieu de les <span className="text-success">Gaspiller</span>
                            </h1>
                            <p className="text-success mt-3">
                                Mealmate est une plateforme qui vous permet de donner vos repas non consommés à des personnes dans le besoin.
                            </p>
                            <button className="btn mb-auto btn-success col-3 p-3 mt-3">S'inscrire</button>
                        </div>
                        {/* Image de l'application mobile */}
                        <div className="col-5 d-flex my-auto ps-5">
                            <img className="w-75 h-75 mt-5 pt-5 ms-auto" src="../../public/mobile.png" alt="application-mobile" />
                        </div>
                    </div>
                </div>
            </header>

            {/* Corps principal du site */}
            <section>
                {/* Première section - Pourquoi MealMates */}
                <div className="firstSection container-fluid bg-success fullHeight d-flex text-light">
                    <div className="mb-auto h-100 d-flex flex-column p-5">
                        <div className="col-12 text-center mt-5">
                            <h2 className="bold">
                                Pourquoi MealMates ?
                            </h2>
                            <p className="opacity-75">Fonctionnalités adaptées à vos besoins</p>
                        </div>

                        {/* Grille des caractéristiques (première ligne) */}
                        <div className="col-9 text-center row m-auto">
                            <div className="col-4">
                                <img className="d-flex mx-auto" src="mdi_neighbourhood.png" alt="fonctionnalité" />
                                <h3>Partager vos plats faits maison</h3>
                                <p className="opacity-75">
                                    Transformez vos surplus culinaires en opportunités de partage avec votre communauté locale et réduisez le gaspillage alimentaire tout en valorisant vos talents de cuisinier.
                                </p>
                            </div>
                            <div className="col-4 mx-auto">
                                <img className="d-flex mx-auto" src="mdi_fish-food.png" alt="fonctionnalité" />
                                <h3>Découvrez des saveurs uniques</h3>
                                <p className="opacity-75">
                                    Explorez une diversité de plats préparés par vos voisins, découvrez de nouvelles cuisines et savourez des repas authentiques que vous ne trouverez pas ailleurs.
                                </p>
                            </div>
                            <div className="col-4 px-4">
                                <img className="d-flex mx-auto" src="game-icons_receive-money.png" alt="fonctionnalité" />
                                <h3>Réduisez votre budget repas</h3>
                                <p className="opacity-75">
                                    Accédez à des plats délicieux à prix réduits tout en permettant aux cuisiniers amateurs de rentabiliser leurs préparations en trop.
                                </p>
                            </div>
                        </div>
                        
                        {/* Grille des caractéristiques (deuxième ligne) */}
                        <div className="col-9 text-center row m-auto mt-0">
                            <div className="col-4">
                                <img className="d-flex mx-auto" src="../../public/fa-solid_hands-helping.png" alt="fonctionnalité" />
                                <h3 className="px-5">Créez des liens dans votre quartier</h3>
                                <p className="opacity-75">
                                    Rencontrez les passionnés de cuisine autour de chez vous, échangez autour d'une passion commune et tissez des liens authentiques dans votre communauté.
                                </p>
                            </div>
                            <div className="col-4 mx-auto">
                                <img className="d-flex mx-auto" src="../../public/fa6-solid_earth-africa.png" alt="fonctionnalité" />
                                <h3>Préservez notre planète</h3>
                                <p className="opacity-75">
                                    Chaque repas partagé sur MealMates représente un geste concret pour l'environnement en limitant le gaspillage alimentaire et l'empreinte carbone liée à la production alimentaire.
                                </p>
                            </div>
                            <div className="col-4">
                                <img className="d-flex mx-auto" src="../../public/Base_feature_icon.png" alt="fonctionnalité" />
                                <h3 className="pt-3">Simplifiez votre quotidien</h3>
                                <p className="opacity-75">
                                    Une interface intuitive pour proposer ou trouver des plats près de chez vous, des paiements sécurisés et un système d'évaluation transparent pour des échanges en toute confiance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Séparateur - Statistiques */}
                <div className="sectionSeparator d-flex container-fluid">
                    <div className="col-9 p-5 d-flex m-auto">
                        <div className="col-6 ms-3 my-auto">
                            <h4 className="w-75">Nos 18 années de succès</h4>
                            <span className="text-success">Grâce à nos atouts, nous avons atteint ces résultats</span>
                        </div>
                        <div className="col-6 row text-success">
                            <div className="col-6 d-flex">
                                <div className="my-auto">
                                    <img src="../../public/Base_feature_icon4.png" alt="icône" />
                                </div>
                                <div className="ms-5">
                                    <p>10 000+</p>
                                    <span>
                                        Téléchargements par jour
                                    </span>
                                </div>
                            </div>

                            <div className="col-6 d-flex">
                                <div className="my-auto">
                                    <img src="../../public/Base_feature_icon4.png" alt="icône" />
                                </div>
                                <div className="ms-5">
                                    <p>2 Millions</p>
                                    <span>
                                        Utilisateurs
                                    </span>
                                </div>
                            </div>

                            <div className="col-6 d-flex mt-5">
                                <div className="my-auto">
                                    <img src="../../public/Base_feature_icon4.png" alt="icône" />
                                </div>
                                <div className="ms-5">
                                    <p>500+</p>
                                    <span>
                                        Clients
                                    </span>
                                </div>
                            </div>

                            <div className="col-6 d-flex mt-5">
                                <div className="my-auto">
                                    <img src="../../public/Base_feature_icon4.png" alt="icône" />
                                </div>
                                <div className="ms-5">
                                    <p>140</p>
                                    <span>
                                        Pays
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deuxième section - Témoignages */}
                <div className="secondSection bg-success text-light d-flex container-fluid">
                    <div className="col-9 p-5 d-flex m-auto">
                        <div className="col-6 ms-auto mb-auto">
                            <div className="col-10 ms-auto position-relative">
                                <img className="position-absolute quote" src="../../public/quote_mark.png"/>
                                <h4 className="bold">Témoignages de clients réels</h4>
                                <span>Inspirez-vous de ces histoires.</span>
                            </div>
                            <div className="card col-6 ms-auto me-5 text-light mt-5">
                                <img className="col-4 mb-4" src="../../public/client_logo1.png" />
                                <div className="position-relative ms-3 pt-3 ps-2">
                                    <img className="position-absolute left-0" src="../../public/small_quote_mark.png" />
                                    <p>
                                        Pour démarrer rapidement la conception de la page d'accueil de ma startup, je cherchais un kit UI. MealMates est l'un des meilleurs kits UI que j'ai pu trouver. Il est flexible, bien organisé et facilement modifiable.
                                    </p>
                                    <p className="cardFooter">
                                        Floyd Miles <br /> <span>Vice-Président, GoPro</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-6 mt-5 pt-3 row">
                            <div className="card col-10 text-light mb-5">
                                <img className="col-3 mb-4" src="../../public/client_logo2.png" />
                                <div className="position-relative ms-3 pt-3 ps-2">
                                    <img className="position-absolute left-0" src="../../public/small_quote_mark.png" />
                                    <p>
                                        J'ai utilisé MealMates et créé une page d'accueil pour ma startup en une semaine. Le kit UI de MealMates est simple et très intuitif, donc tout le monde peut l'utiliser.
                                    </p>
                                    <p className="cardFooter">
                                        Jane Cooper <br /> <span>PDG, Airbnb</span>
                                    </p>
                                </div>
                            </div>
                            <div className="card col-7 text-light">
                                <img className="col-3 mb-4" src="../../public/client_logo3.png" />
                                <div className="position-relative ms-3 pt-3 ps-2">
                                    <img className="position-absolute left-0" src="../../public/small_quote_mark.png" />
                                    <p>
                                        MealMates nous a fait gagner du temps dans la conception de la page de notre entreprise.
                                    </p>
                                    <p className="cardFooter">
                                        Kristin Watson <br /> <span>Co-fondatrice, Strapi</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deuxième séparateur - Intégrations */}
                <div className="secondSectionSeparator d-flex container-fluid">
                    <div className="col-9 p-5 d-flex m-auto">
                        <div className="col-6 ms-3 my-auto">
                            <h4 className="w-75">Connectez-vous avec vos applications préférées</h4>
                            <span className="text-success">Connectez-vous avec vos outils favoris que vous utilisez quotidiennement et gardez le contrôle sur vos activités.</span>
                        </div>
                        <div className="col-6 row text-success">
                            <div className="position-relative">
                                <img className="mx-auto" src="../../public/vector.png" />
                                <img className="position-absolute top-7 left-0 right-0 mx-auto" src="../../public/vectorLogos.png" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Troisième section - Application mobile */}
                <div className="thirdSection bg-success text-light d-flex container-fluid">
                    <div className="col-6 p-5 d-flex m-auto me-0">
                        <div className="col-9 ms-auto my-auto">
                            <h4 className="bold">Gérez tous vos restaurants depuis votre mobile</h4>
                            <span>Téléchargez l'application pour gérer vos restaurants, suivre les ventes et accomplir vos tâches sans procrastiner. Restez sur la bonne voie et terminez à temps !</span>
                        </div>
                    </div>
                    <div className="col-6 row mx-0 ms-5">
                        <div className="col d-flex mb-auto">
                            <img src="../../public/phone_mockup_1.png" alt="maquette téléphone 1" />
                        </div>
                        <div className="col d-flex mt-auto">
                            <img src="../../public/phone_mockup_2.png" alt="maquette téléphone 2" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Pied de page */}
            <footer>
                <div className="footer d-flex container-fluid">
                    <div className="col-9 p-5 d-flex m-auto">
                        <div className="col-6 ms-3 my-auto">
                            <h4>Abonnez-vous à notre newsletter</h4>
                            <span className="text-success">Abonnez-vous pour recevoir chaque semaine des nouvelles de notre entreprise et restez informé</span>
                        </div>
                        <div className="col-6 h-100 mt-3 row text-success">
                            <div className="col-6 d-flex">
                                <input className="form-control" type="text" placeholder="Entrez votre email" />
                            </div>
                            <div className="col-6 d-flex">
                                <button className="btn btn-success">S'abonner</button>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-center">©️ 2023 MealMates. Tous droits réservés</p>
            </footer>
        </div>
    );
}