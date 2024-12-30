import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const DigitalDesign = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        Retour
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Design Numérique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Contenu du module de design numérique à venir...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DigitalDesign;