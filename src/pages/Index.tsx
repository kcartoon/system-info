import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const modules = [
    {
      title: "Développement Web",
      description: "Maîtrisez les technologies web modernes : HTML, CSS, JavaScript et les frameworks populaires.",
      image: "photo-1487058792275-0ad4aaf24ca7",
      path: "/web-development"
    },
    {
      title: "Programmation",
      description: "Apprenez les fondamentaux de la programmation et développez des applications robustes.",
      image: "photo-1461749280684-dccba630e2f6",
      path: "/programming"
    },
    {
      title: "Design Numérique",
      description: "Découvrez les principes du design UI/UX et créez des interfaces utilisateur attrayantes.",
      image: "photo-1473091534298-04dcbce3278c",
      path: "/digital-design"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Formation Numérique</h1>
        <p className="text-xl text-muted-foreground">
          Choisissez votre parcours de spécialisation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Card key={module.title} className="group hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="relative w-full h-48 mb-4 overflow-hidden rounded-t-lg">
                <img
                  src={`https://source.unsplash.com/${module.image}`}
                  alt={module.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <CardTitle className="text-2xl">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full"
                onClick={() => navigate(module.path)}
              >
                Commencer la formation
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Index;