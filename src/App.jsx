import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form.jsx";
import { ConnexionForm } from "@/components/connexion-form.jsx";
import { InscriptionForm } from "@/components/inscription-form.jsx";

function App() {
  return (
    // <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[url(../assets/sac-course.png)] bg-right-top bg-no-repeat p-6">
    //   <div className="flex w-full max-w-2xl flex-col gap-6">
    //     <LoginForm />
    //   </div>
    // </div>

    // <div className="flex min-h-svh flex-col items-center gap-6 bg-right-top bg-no-repeat p-6">
    //   <div className="flex w-full max-w-2xl flex-col gap-6">
    //     <ConnexionForm />
    //   </div>
    // </div>

    <div className="flex min-h-svh flex-col items-center gap-6 bg-right-top bg-no-repeat p-6">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <InscriptionForm />
      </div>
    </div>
  );
}

export default App;
