import {cn} from "@/lib/utils.js";
import {Label} from "@/components/ui/label.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {useState} from "react";
import {useNavigate} from "react-router";
import {useAuth} from "@/context/AuthContext.jsx";

export const Login = ({className, ...props}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await auth.login(email, password);
            navigate('/map');
        } catch (err) {
            console.error("Login error:", err);
            setError(
                err.response?.data?.message ||
                "La connexion a échoué. Veuillez vérifier vos identifiants."
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-svh flex-col items-center gap-6 bg-right-top bg-no-repeat p-6">
            <div className="flex w-full max-w-2xl flex-col gap-6">

                <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div>
                                <img src="/assets/logo-mealmates.png" alt="Logo MealMate"
                                     className="max-w-3/4  mx-auto"/>
                            </div>
                            <div className="flex flex-col gap-10">
                                <div className="flex flex-col left-center gap-2">
                                    <h1 className="text-3xl font-medium">Connexion</h1>
                                    <p className="text-m text-gray-500 font-medium">Entrez votre email et mot de
                                        passe</p>
                                </div>
                                {error && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                                        {error}
                                    </div>
                                )}
                                <div className="flex flex-col gap-6 max-w-m">
                                    <div className="grid gap-3">
                                        <Label className="text-gray-500">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="fethiammar@mealmate.fr"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="p-0"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label className="text-gray-500">Mot de passe </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="● ● ● ● ● ●"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="p-0"
                                        />
                                    </div>
                                    <p className="text-m text-right">Mot de passe oublié ?</p>
                                </div>
                            </div>
                            <div className="grid gap-4 flex-col">
                                <Button
                                    variant="outline"
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full text-xl font-light bg-button-green text-white h-16 rounded-2xl"
                                >
                                    {isLoading ? "Connexion en cours..." : "Se connecter"}
                                </Button>
                                <p className="text-center">
                                    Vous n'avez pas de compte ?{" "}
                                    <a href="/register" className="text-button-green">
                                        S'inscrire
                                    </a>
                                </p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
