import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ConnexionForm({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-10">
            <div className="flex flex-col left-center gap-2">
              <h1 className="text-3xl font-medium">Connexion</h1>
              <p className="text-m text-gray-500 font-medium">Entrez votre email et mot de passe</p>
            </div>
            <div className="flex flex-col gap-6 max-w-m">
              <div className="grid gap-3">
                <Label className="text-gray-500">Emain</Label>
                <Input id="username" type="username" placeholder="Fethi Ammar" required className="p-0" />
              </div>
              <div className="grid gap-3">
                <Label className="text-gray-500">Mot de passe </Label>
                <Input id="email" type="email" placeholder="* * * * * *" required className="p-0" />
              </div>
              <p className="text-m text-right">Mot de passe oublier ?</p>
            </div>
          </div>
          <div className="grid gap-4 flex-col">
            <Button variant="outline" type="button" className="w-full text-xl font-light bg-button-green text-white h-16 rounded-2xl">
              Se connecter
            </Button>
            <p className="text-center">
              Vous n'avez pas de compte ?{" "}
              <a href="" className="text-button-green">
                S'inscire
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
