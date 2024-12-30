import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const getSystemInfo = async () => {
    setLoading(true);
    try {
      // Simulation de la récupération des données système
      const mockData = {
        recordNumber: 1,
        domainName: "WORKGROUP",
        computerName: "DESKTOP-XYZ123",
        computerModel: "Dell XPS 15",
        serialNumber: "ABC123XYZ",
        operatingSystem: "Windows 10 Pro",
        networkAdapters: [
          { name: "Ethernet", macAddress: "00:11:22:33:44:55" },
          { name: "Wi-Fi", macAddress: "AA:BB:CC:DD:EE:FF" }
        ]
      };
      
      setSystemInfo(mockData);
      toast({
        title: "Succès",
        description: "Les informations système ont été récupérées avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des informations système:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de récupérer les informations système.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Collecteur d'Informations Système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={getSystemInfo}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Récupération en cours...
                </>
              ) : (
                "Récupérer les informations système"
              )}
            </Button>

            {systemInfo && (
              <Card>
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Information</TableHead>
                        <TableHead>Valeur</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">N° d'enregistrement</TableCell>
                        <TableCell>{systemInfo.recordNumber}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Nom du domaine</TableCell>
                        <TableCell>{systemInfo.domainName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Nom de l'ordinateur</TableCell>
                        <TableCell>{systemInfo.computerName}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Modèle</TableCell>
                        <TableCell>{systemInfo.computerModel}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Numéro de série</TableCell>
                        <TableCell>{systemInfo.serialNumber}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Système d'exploitation</TableCell>
                        <TableCell>{systemInfo.operatingSystem}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Adaptateurs réseau</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Adresse MAC</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {systemInfo.networkAdapters.map((adapter: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell>{adapter.name}</TableCell>
                            <TableCell>{adapter.macAddress}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;