import {useAuth} from "@/context/AuthContext.jsx";
import { Button } from "@/components/ui/button";

function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <div className="flex flex-col min-h-screen">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
                    <div className="flex items-center">
                        <img
                            src="/assets/logo-mealmates.png"
                            alt="Logo MealMate"
                            className="h-12"
                        />
                    </div>
                    <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              {user?.firstName} {user?.lastName}
            </span>
                        <Button
                            variant="outline"
                            onClick={logout}
                            className="text-button-green border-button-green"
                        >
                            Se déconnecter
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto py-6 px-6">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                        Tableau de bord
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">
                                Profil utilisateur
                            </h2>
                            <div className="space-y-2">
                                <p><span className="font-medium">Nom:</span> {user?.lastName}</p>
                                <p><span className="font-medium">Prénom:</span> {user?.firstName}</p>
                                <p><span className="font-medium">Email:</span> {user?.email}</p>
                                <p><span className="font-medium">Statut:</span> {user?.isVerified ? 'Vérifié' : 'Non vérifié'}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow">
                            <h2 className="text-lg font-medium text-gray-800 mb-4">
                                Activité récente
                            </h2>
                            <p className="text-gray-600">
                                Aucune activité récente à afficher.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;
