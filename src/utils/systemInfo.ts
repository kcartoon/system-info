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
  // Création du dossier sav s'il n'existe pas
  const savDir = path.join(process.cwd(), 'sav');
  if (!fs.existsSync(savDir)) {
    fs.mkdirSync(savDir);
  }

  // Récupération des informations système
  const computerName = os.hostname();
  const domainName = execSync('wmic computersystem get domain').toString().split('\n')[1].trim();
  const computerModel = execSync('wmic computersystem get model').toString().split('\n')[1].trim();
  const serialNumber = execSync('wmic bios get serialnumber').toString().split('\n')[1].trim();
  const operatingSystem = `${os.type()} ${os.release()}`;

  // Récupération des adaptateurs réseau
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
    const content = fs.readFileSync(CSV_FILE_PATH, 'utf-8');
    const isDuplicate = content.includes(`${computerName},${serialNumber}`);
    if (isDuplicate) {
      throw new Error('Cet ordinateur a déjà été enregistré.');
    }
  }

  // Sauvegarde dans le fichier CSV
  const csvHeader = 'Record Number,Domain Name,Computer Name,Computer Model,Serial Number,Operating System,Network Adapters\n';
  const networkAdaptersStr = networkAdapters.map(a => `${a.name}(${a.macAddress})`).join(';');
  const csvLine = `${recordNumber},${domainName},${computerName},${computerModel},${serialNumber},${operatingSystem},"${networkAdaptersStr}"\n`;

  if (!fs.existsSync(CSV_FILE_PATH)) {
    fs.writeFileSync(CSV_FILE_PATH, csvHeader);
  }
  fs.appendFileSync(CSV_FILE_PATH, csvLine);

  return systemInfo;
};