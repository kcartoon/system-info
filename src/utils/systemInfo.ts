import os from 'os';
import { networkInterfaces } from 'os';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface NetworkAdapter {
  name: string;
  macAddress: string;
}

interface SystemInfo {
  recordNumber: number;
  domainName: string;
  computerName: string;
  computerModel: string;
  serialNumber: string;
  operatingSystem: string;
  networkAdapters: NetworkAdapter[];
}

const CSV_FILE_PATH = path.join(process.cwd(), 'sav', 'system_info.csv');

export const getSystemInfo = async (): Promise<SystemInfo> => {
  console.log('Démarrage de la collecte des informations système...');

  // Création du dossier sav s'il n'existe pas
  const savDir = path.join(process.cwd(), 'sav');
  if (!fs.existsSync(savDir)) {
    console.log('Création du dossier sav...');
    fs.mkdirSync(savDir);
  }

  // Récupération des informations système
  console.log('Récupération des informations système en cours...');
  
  const computerName = os.hostname();
  console.log(`Nom de l'ordinateur: ${computerName}`);
  
  const domainName = execSync('wmic computersystem get domain').toString().split('\n')[1].trim();
  console.log(`Nom du domaine: ${domainName}`);
  
  const computerModel = execSync('wmic computersystem get model').toString().split('\n')[1].trim();
  console.log(`Modèle de l'ordinateur: ${computerModel}`);
  
  const serialNumber = execSync('wmic bios get serialnumber').toString().split('\n')[1].trim();
  console.log(`Numéro de série: ${serialNumber}`);
  
  const operatingSystem = `${os.type()} ${os.release()}`;
  console.log(`Système d'exploitation: ${operatingSystem}`);

  // Récupération des adaptateurs réseau
  console.log('Récupération des informations réseau...');
  const networkAdapters: NetworkAdapter[] = [];
  const interfaces = networkInterfaces();
  
  Object.entries(interfaces).forEach(([name, infos]) => {
    if (infos) {
      infos.forEach(info => {
        if (info.mac !== '00:00:00:00:00:00') {
          networkAdapters.push({
            name,
            macAddress: info.mac
          });
          console.log(`Interface réseau trouvée: ${name} (${info.mac})`);
        }
      });
    }
  });

  // Gestion du numéro d'enregistrement
  let recordNumber = 1;
  if (fs.existsSync(CSV_FILE_PATH)) {
    const records = fs.readFileSync(CSV_FILE_PATH, 'utf-8').split('\n');
    if (records.length > 1) {
      const lastRecord = records[records.length - 2]; // -2 car le dernier élément est une ligne vide
      recordNumber = parseInt(lastRecord.split(',')[0]) + 1;
    }
  }
  console.log(`Numéro d'enregistrement attribué: ${recordNumber}`);

  const systemInfo: SystemInfo = {
    recordNumber,
    domainName,
    computerName,
    computerModel,
    serialNumber,
    operatingSystem,
    networkAdapters
  };

  // Vérification des doublons
  if (fs.existsSync(CSV_FILE_PATH)) {
    console.log('Vérification des doublons...');
    const content = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const isDuplicate = content.includes(`${computerName},${serialNumber}`);
    if (isDuplicate) {
      console.error('ERREUR: Cet ordinateur a déjà été enregistré.');
      throw new Error('Cet ordinateur a déjà été enregistré.');
    }
  }

  // Sauvegarde dans le fichier CSV
  console.log('Sauvegarde des informations dans le fichier CSV...');
  const csvHeader = 'Record Number,Domain Name,Computer Name,Computer Model,Serial Number,Operating System,Network Adapters\n';
  const networkAdaptersStr = networkAdapters.map(a => `${a.name}(${a.macAddress})`).join(';');
  const csvLine = `${recordNumber},${domainName},${computerName},${computerModel},${serialNumber},${operatingSystem},"${networkAdaptersStr}"\n`;

  if (!fs.existsSync(CSV_FILE_PATH)) {
    fs.writeFileSync(CSV_FILE_PATH, csvHeader);
  }
  fs.appendFileSync(CSV_FILE_PATH, csvLine);
  console.log('Informations système sauvegardées avec succès!');

  return systemInfo;
};