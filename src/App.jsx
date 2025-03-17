import { GalleryVerticalEnd } from "lucide-react";
import { LoginForm } from "@/components/login-form.jsx";

function App() {
  return (
    <div className="flex min-h-svh flex-col items-center pt-40 gap-6 bg-[url(../assets/sac-course.png)] bg-right-top bg-no-repeat p-6">
      <div>
        <img src="/assets/logo-mealmate.png" alt="Logo MealMate" className="max-w-2/5 mx-auto" />
      </div>
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <LoginForm />
      </div>
    </div>
  );
}

export default App;
