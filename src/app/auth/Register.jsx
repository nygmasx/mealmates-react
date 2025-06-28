import {cn} from "@/lib/utils.js";
import {Label} from "@/components/ui/label.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Input} from "@/components/ui/input.jsx";
import {useState} from "react";
import {useNavigate} from "react-router";
import {useAuth} from "@/context/AuthContext.jsx";
import {showToast} from "@/utils/toast.js";

const Register = ({className, ...props}) => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const auth = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await auth.register(
                firstName,
                lastName,
                email,
                password
            );
            showToast.success('Inscription réussie! Vérifiez votre email.');
            navigate('/register-confirmation');
        } catch (err) {
            console.error("Erreur d'inscription:", err);
            showToast.error(
                err.response?.data?.message ||
                "L'inscription a échoué. Veuillez vérifier vos informations."
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
                                     className="max-w-3/4 mx-auto"/>
                            </div>
                            <div className="flex flex-col gap-10">
                                <div className="flex flex-col left-center gap-2">
                                    <h1 className="text-3xl font-medium">Inscription</h1>
                                    <p className="text-m text-gray-500 font-medium">Entrez vos informations
                                        d'identification</p>
                                </div>
                                <div className="flex flex-col gap-6 max-w-m">
                                    <div className="grid gap-3">
                                        <Label className="text-gray-500">Prénom</Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            placeholder="Prénom"
                                            required
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="p-0"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label className="text-gray-500">Nom</Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            placeholder="Nom"
                                            required
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="p-0"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label className="text-gray-500">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="email@mealmates.fr"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="p-0"
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label className="text-gray-500">Mot de passe</Label>
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
                                    <p className="text-gray-500">En continuant, vous acceptez nos conditions de service
                                        et notre politique de confidentialité.</p>
                                </div>
                            </div>
                            <div className="grid gap-4 flex-col">
                                <Button
                                    variant="outline"
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full text-xl font-light bg-button-green text-white h-16 rounded-2xl"
                                >
                                    {isLoading ? "Inscription en cours..." : "S'inscrire"}
                                </Button>
                                <p className="text-center">
                                    Vous avez déjà un compte ?{" "}
                                    <a href="/login" className="text-button-green">
                                        Se connecter
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

export default Register;
