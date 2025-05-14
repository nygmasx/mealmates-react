import React from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { FiCheck, FiMail } from "react-icons/fi";

const RegisterConfirmation = () => {
    const navigate = useNavigate();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-md">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <FiCheck className="text-button-green w-8 h-8" />
                    </div>

                    <h1 className="text-2xl font-bold mb-2 text-center">Inscription réussie !</h1>

                    <div className="flex items-center gap-2 text-button-green mb-4">
                        <FiMail className="w-5 h-5" />
                        <span className="font-medium">Email de confirmation envoyé</span>
                    </div>

                    <p className="text-gray-600 text-center mb-6">
                        Un email de confirmation a été envoyé à l'adresse que vous avez fournie.
                        Veuillez vérifier votre boîte de réception et cliquer sur le lien pour activer votre compte.
                    </p>

                    <div className="bg-gray-50 p-4 rounded-lg w-full mb-6">
                        <p className="text-sm text-gray-500 mb-2">
                            <strong>Attention :</strong> Si vous ne trouvez pas l'email dans votre boîte de réception,
                            veuillez vérifier votre dossier de spam.
                        </p>
                        <p className="text-sm text-gray-500">
                            L'email expire dans 24 heures. Si vous ne le recevez pas, vous pourrez
                            demander un nouvel email de confirmation.
                        </p>
                    </div>

                    <div className="flex flex-col w-full gap-3">
                        <Button
                            onClick={() => navigate("/login")}
                            className="w-full bg-button-green text-white py-3 rounded-lg"
                        >
                            Se connecter
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => navigate("/")}
                            className="w-full border-button-green text-button-green"
                        >
                            Retour à l'accueil
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <img src="/assets/logo-mealmates.png" alt="Logo MealMate" className="h-10" />
            </div>
        </div>
    );
};

export default RegisterConfirmation;
