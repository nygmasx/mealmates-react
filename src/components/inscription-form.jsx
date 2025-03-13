import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InscriptionForm({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div>
            <img src="/assets/logo-mealmate.png" alt="Logo MealMate" className="max-w-3/4  mx-auto" />
          </div>
          <div className="flex flex-col gap-10">
            <div className="flex flex-col left-center gap-2">
              <h1 className="text-3xl font-medium">Inscription</h1>
              <p className="text-m text-gray-500 font-medium">Entrez vos informations d'identification</p>
            </div>
            <div className="flex flex-col gap-6 max-w-m">
              <div className="grid gap-3">
                <Label className="text-gray-500">Nom d'utilisateur</Label>
                <Input id="username" type="username" placeholder="Fethi Ammar" required className="p-0" />
              </div>
              <div className="grid gap-3">
                <Label className="text-gray-500">Email</Label>
                <Input id="email" type="email" placeholder="fethiammar@mealmates.fr" required className="p-0" />
              </div>
              <div className="grid gap-3">
                <Label className="text-gray-500">Mot de passe</Label>
                <Input id="password" type="password" placeholder="● ● ● ● ● ●" required className="p-0" />
              </div>
              <p className="text-gray-500">En continuant, vous acceptez nos conditions de service et notre politique de confidentialité.</p>
            </div>
          </div>
          <div className="grid gap-4 flex-col">
            <Button variant="outline" type="button" className="w-full text-xl font-light bg-button-green text-white h-16 rounded-2xl">
              Se connecter
            </Button>
            <p className="text-center">
              Vous avez déjà un compte ?{" "}
              <a href="" className="text-button-green">
                S'identifier
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
