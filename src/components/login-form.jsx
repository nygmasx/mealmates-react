import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm({ className, ...props }) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center w-full gap-10">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-3xl font-medium">
                Sauvons des repas, <br /> Rejoignez MealMates.
              </h1>
            </div>
            <div className="flex flex-col gap-6 max-w-xs">
              <div className="grid gap-3">
                <Input id="email" type="email" placeholder="example@domain.fr" required />
              </div>
              <p className="text-gray-500">Ou connectez-vous avec les médias sociaux</p>
            </div>
          </div>
          <div className="grid gap-4 flex-col">
            <Button variant="outline" type="button" className="w-full text-xl font-light bg-google-blue text-white h-14 rounded-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="white" />
              </svg>
              Continuer avec Google
            </Button>
            <Button variant="outline" type="button" className="w-full text-xl font-light bg-facebook-blue text-white h-14 rounded-2xl">
              <svg width="24px" height="24px" viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg">
                <title>Facebook icon</title>
                <svg width="12" height="25" viewBox="0 0 12 25" fill="white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.57353 3.99578H11.7117V0.169457C11.3428 0.117316 10.0742 0 8.59666 0C5.51381 0 3.40197 1.99237 3.40197 5.65425V9.02435H0V13.3019H3.40197V24.0649H7.57294V13.3029H10.8373L11.3555 9.02535H7.57197V6.0784C7.57294 4.84206 7.89694 3.99578 9.57353 3.99578Z" fill="white" />
                </svg>
              </svg>
              Continuer avec Facebook
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
