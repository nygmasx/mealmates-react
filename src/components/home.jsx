export function Home({}) {
    return (
        <div className="inter">
            {/* En-tête du site */}
            <header>
                <div className="fullPageMargin">
                    {/* Barre de navigation responsive */}
                    <div className="container py-4">
                        <div className="row align-items-center">
                            {/* Logo */}
                            <div className="col-12 col-md-2 text-center text-md-start mb-3 mb-md-0">
                                <img className="img-fluid" style={{maxHeight: "60px"}} src="../../public/logo-mealmate.png" alt="logo" />
                            </div>

                            {/* Menu de navigation */}
                            <div className="col-12 col-md-7">
                                <nav className="d-flex justify-content-center justify-content-md-start">
                                    <ul className="d-flex flex-wrap bold list-unstyled m-0 p-0">
                                        <li className="me-4 mb-2">Services</li>
                                        <li className="mx-4 mb-2">Tarifs</li>
                                        <li className="mx-4 mb-2">Carrière</li>
                                        <li className="ms-4 mb-2">Contact</li>
                                    </ul>
                                </nav>
                            </div>
                            
                            {/* Bouton d'inscription */}
                            <div className="col-12 col-md-3 text-center text-md-end mt-3 mt-md-0">
                                <button className="btn btn-success px-4 py-2">S'inscrire</button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Section principale de l'en-tête */}
                    <div className="container">
                        <div className="row py-5 min-vh-75 align-items-center">
                            {/* Texte de présentation */}
                            <div className="col-12 col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
                                <h1 className="mb-4">
                                    Donnez vos repas,<br className="d-none d-lg-block"></br> au lieu de les <span className="text-success">Gaspiller</span>
                                </h1>
                                <p className="text-success my-4">
                                    Mealmate est une plateforme qui vous permet de donner vos repas non consommés à des personnes dans le besoin.
                                </p>
                                <button className="btn btn-success px-4 py-2 mt-2">S'inscrire</button>
                            </div>
                            
                            {/* Image de l'application mobile */}
                            <div className="col-12 col-lg-6 text-center">
                                <img className="img-fluid" style={{maxWidth: "80%"}} src="../../public/mobile.png" alt="application-mobile" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Corps principal du site */}
            <section>
                {/* Première section - Pourquoi MealMates */}
                <div className="firstSection container-fluid bg-success py-5 text-light">
                    <div className="container">
                        <div className="row mb-5">
                            <div className="col-12 text-center">
                                <h2 className="bold mb-3">
                                    Pourquoi MealMates ?
                                </h2>
                                <p className="opacity-75">Fonctionnalités adaptées à vos besoins</p>
                            </div>
                        </div>

                        {/* Grille des caractéristiques (première ligne) */}
                        <div className="row text-center">
                            <div className="col-12 col-md-6 col-lg-4 mb-5">
                                <img className="mx-auto d-block mb-4" src="mdi_neighbourhood.png" alt="fonctionnalité" />
                                <h3>Partager vos plats faits maison</h3>
                                <p className="opacity-75 px-2 px-md-4">
                                    Transformez vos surplus culinaires en opportunités de partage avec votre communauté locale et réduisez le gaspillage alimentaire tout en valorisant vos talents de cuisinier.
                                </p>
                            </div>
                            <div className="col-12 col-md-6 col-lg-4 mb-5">
                                <img className="mx-auto d-block mb-4" src="mdi_fish-food.png" alt="fonctionnalité" />
                                <h3>Découvrez des saveurs uniques</h3>
                                <p className="opacity-75 px-2 px-md-4">
                                    Explorez une diversité de plats préparés par vos voisins, découvrez de nouvelles cuisines et savourez des repas authentiques que vous ne trouverez pas ailleurs.
                                </p>
                            </div>
                            <div className="col-12 col-md-6 col-lg-4 mb-5">
                                <img className="mx-auto d-block mb-4" src="game-icons_receive-money.png" alt="fonctionnalité" />
                                <h3>Réduisez votre budget repas</h3>
                                <p className="opacity-75 px-2 px-md-4">
                                    Accédez à des plats délicieux à prix réduits tout en permettant aux cuisiniers amateurs de rentabiliser leurs préparations en trop.
                                </p>
                            </div>
                        
                            {/* Grille des caractéristiques (deuxième ligne) */}
                            <div className="col-12 col-md-6 col-lg-4 mb-5">
                                <img className="mx-auto d-block mb-4" src="../../public/fa-solid_hands-helping.png" alt="fonctionnalité" />
                                <h3>Créez des liens dans votre quartier</h3>
                                <p className="opacity-75 px-2 px-md-4">
                                    Rencontrez les passionnés de cuisine autour de chez vous, échangez autour d'une passion commune et tissez des liens authentiques dans votre communauté.
                                </p>
                            </div>
                            <div className="col-12 col-md-6 col-lg-4 mb-5">
                                <img className="mx-auto d-block mb-4" src="../../public/fa6-solid_earth-africa.png" alt="fonctionnalité" />
                                <h3>Préservez notre planète</h3>
                                <p className="opacity-75 px-2 px-md-4">
                                    Chaque repas partagé sur MealMates représente un geste concret pour l'environnement en limitant le gaspillage alimentaire et l'empreinte carbone liée à la production alimentaire.
                                </p>
                            </div>
                            <div className="col-12 col-md-6 col-lg-4 mb-5">
                                <img className="mx-auto d-block mb-4" src="../../public/Base_feature_icon.png" alt="fonctionnalité" />
                                <h3>Simplifiez votre quotidien</h3>
                                <p className="opacity-75 px-2 px-md-4">
                                    Une interface intuitive pour proposer ou trouver des plats près de chez vous, des paiements sécurisés et un système d'évaluation transparent pour des échanges en toute confiance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Séparateur - Statistiques */}
                <div className="sectionSeparator container-fluid py-5">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                                <h4 className="mb-3">Nos 18 années de succès</h4>
                                <span className="text-success d-block">Grâce à nos atouts, nous avons atteint ces résultats</span>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="row text-success">
                                    <div className="col-12 col-sm-6 d-flex align-items-center mb-4">
                                        <div>
                                            <img src="../../public/Base_feature_icon4.png" alt="icône" />
                                        </div>
                                        <div className="ms-3">
                                            <p className="mb-0 fw-bold">10 000+</p>
                                            <span>Téléchargements par jour</span>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 d-flex align-items-center mb-4">
                                        <div>
                                            <img src="../../public/Base_feature_icon4.png" alt="icône" />
                                        </div>
                                        <div className="ms-3">
                                            <p className="mb-0 fw-bold">2 Millions</p>
                                            <span>Utilisateurs</span>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 d-flex align-items-center mb-4 mb-sm-0">
                                        <div>
                                            <img src="../../public/Base_feature_icon4.png" alt="icône" />
                                        </div>
                                        <div className="ms-3">
                                            <p className="mb-0 fw-bold">500+</p>
                                            <span>Clients</span>
                                        </div>
                                    </div>

                                    <div className="col-12 col-sm-6 d-flex align-items-center">
                                        <div>
                                            <img src="../../public/Base_feature_icon4.png" alt="icône" />
                                        </div>
                                        <div className="ms-3">
                                            <p className="mb-0 fw-bold">140</p>
                                            <span>Pays</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Deuxième section - Témoignages */}
                <div className="secondSection bg-success text-light py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-lg-5 mb-5 mb-lg-0">
                                <div className="position-relative mb-5">
                                    <img className="d-none d-lg-block" style={{position: "absolute", top: "-40px", left: "-80px"}} src="../../public/quote_mark.png"/>
                                    <h4 className="bold mb-2">Témoignages de clients réels</h4>
                                    <span>Inspirez-vous de ces histoires.</span>
                                </div>
                                <div className="card text-light mb-4">
                                    <img style={{maxWidth: "120px"}} className="mb-4" src="../../public/client_logo1.png" />
                                    <div className="position-relative pt-2">
                                        <img className="position-absolute" style={{top: "0", left: "0"}} src="../../public/small_quote_mark.png" />
                                        <p className="ps-4">
                                            Pour démarrer rapidement la conception de la page d'accueil de ma startup, je cherchais un kit UI. MealMates est l'un des meilleurs kits UI que j'ai pu trouver. Il est flexible, bien organisé et facilement modifiable.
                                        </p>
                                        <p className="fw-bold mt-4">
                                            Floyd Miles <br /> <span className="fw-normal">Vice-Président, GoPro</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-7">
                                <div className="row">
                                    <div className="col-12 col-md-10 col-lg-12 mx-auto mb-4">
                                        <div className="card text-light">
                                            <img style={{maxWidth: "120px"}} className="mb-4" src="../../public/client_logo2.png" />
                                            <div className="position-relative pt-2">
                                                <img className="position-absolute" style={{top: "0", left: "0"}} src="../../public/small_quote_mark.png" />
                                                <p className="ps-4">
                                                    J'ai utilisé MealMates et créé une page d'accueil pour ma startup en une semaine. Le kit UI de MealMates est simple et très intuitif, donc tout le monde peut l'utiliser.
                                                </p>
                                                <p className="fw-bold mt-4">
                                                    Jane Cooper <br /> <span className="fw-normal">PDG, Airbnb</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 col-md-8 col-lg-9 mx-auto">
                                        <div className="card text-light">
                                            <img style={{maxWidth: "120px"}} className="mb-4" src="../../public/client_logo3.png" />
                                            <div className="position-relative pt-2">
                                                <img className="position-absolute" style={{top: "0", left: "0"}} src="../../public/small_quote_mark.png" />
                                                <p className="ps-4">
                                                    MealMates nous a fait gagner du temps dans la conception de la page de notre entreprise.
                                                </p>
                                                <p className="fw-bold mt-4">
                                                    Kristin Watson <br /> <span className="fw-normal">Co-fondatrice, Strapi</span>
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
                <div className="secondSectionSeparator py-5">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-12 col-lg-6 mb-5 mb-lg-0">
                                <h4 className="mb-3">Connectez-vous avec vos applications préférées</h4>
                                <span className="text-success d-block">Connectez-vous avec vos outils favoris que vous utilisez quotidiennement et gardez le contrôle sur vos activités.</span>
                            </div>
                            <div className="col-12 col-lg-6 text-center">
                                <div className="position-relative">
                                    <img className="img-fluid" src="../../public/vector.png" />
                                    <img className="position-absolute top-50 start-50 translate-middle" style={{maxWidth: "80%"}} src="../../public/vectorLogos.png" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Troisième section - Application mobile */}
                <div className="thirdSection bg-success text-light py-5">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-12 col-lg-6 mb-5 mb-lg-0">
                                <div className="pe-0 pe-lg-5">
                                    <h4 className="bold mb-4">Gérez tous vos restaurants depuis votre mobile</h4>
                                    <span className="d-block">Téléchargez l'application pour gérer vos restaurants, suivre les ventes et accomplir vos tâches sans procrastiner. Restez sur la bonne voie et terminez à temps !</span>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="row">
                                    <div className="col-6 text-center">
                                        <img className="img-fluid" src="../../public/phone_mockup_1.png" alt="maquette téléphone 1" />
                                    </div>
                                    <div className="col-6 text-center mt-5 mt-md-0">
                                        <img className="img-fluid" src="../../public/phone_mockup_2.png" alt="maquette téléphone 2" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pied de page */}
            <footer>
                <div className="footer py-5">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                                <h4 className="mb-3">Abonnez-vous à notre newsletter</h4>
                                <span className="text-success d-block">Abonnez-vous pour recevoir chaque semaine des nouvelles de notre entreprise et restez informé</span>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="row g-3">
                                    <div className="col-12 col-sm-7">
                                        <input className="form-control w-100" type="text" placeholder="Entrez votre email" />
                                    </div>
                                    <div className="col-12 col-sm-5">
                                        <button className="btn btn-success w-100">S'abonner</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="text-center py-3 mb-0">©️ 2023 MealMates. Tous droits réservés</p>
            </footer>
        </div>
    );
}