// appsData.ts
import type { ElementType } from "react";
import { LayoutGrid, Cpu, Ghost, Gamepad2, Box, Terminal } from "lucide-react";

export interface AppData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  rating: string;
  size: string;
  version: string;
  iconFallback: ElementType; // Usado caso não tenha imagem
  iconUrl: string;
  screenshots: string[];
}

export const storeApps: AppData[] = [
  {
    id: "app-1",
    name: "SheetsCode Premium",
    subtitle: "Engenharia do Poder & Automação Mobile",
    description: "Eleve a gestão e o processamento de dados para o próximo nível. Uma arquitetura móvel robusta desenhada para transformar fluxos de trabalho complexos em interações rápidas e intuitivas direto do seu smartphone. Acompanha dashboards analíticos e integração em tempo real.",
    category: "Produtividade",
    rating: "4.9",
    size: "45 MB",
    version: "2.1.0",
    iconFallback: LayoutGrid,
    iconUrl: "", // Insira sua URL aqui. Ex: "/icons/sheetscode.png"
    screenshots: ["", "", "", "", ""] // Pode adicionar quantas quiser
  },
  {
    id: "app-2",
    name: "Aetheris ERP",
    subtitle: "Gestão Simplificada para Empreendedores",
    description: "Um ecossistema limpo e direto focado em pequenos empreendedores que buscam clareza nas métricas sem o ruído dos sistemas tradicionais. Gerencie fluxo de caixa, estoque e clientes com uma interface que respeita o seu tempo.",
    category: "Negócios",
    rating: "5.0",
    size: "120 MB",
    version: "1.0.5",
    iconFallback: Cpu,
    iconUrl: "",
    screenshots: ["", "", ""]
  },
  {
    id: "app-3",
    name: "Star Sowing",
    subtitle: "Aventura Procedural Espacial",
    description: "Cultive vida no vazio do espaço sideral. Uma mistura de mecânicas de movimento fluido, parkour em gravidade zero e geração infinita de cenários astronômicos.",
    category: "Jogos",
    rating: "4.8",
    size: "1.2 GB",
    version: "RC-3",
    iconFallback: Gamepad2,
    iconUrl: "",
    screenshots: ["", "", ""]
  },
  {
    id: "app-4",
    name: "O Manifesto Secreto",
    subtitle: "Edição Digital Interativa",
    description: "Códigos de trapaça e táticas psicológicas para a vida real, agora em um formato digital com ritmo de leitura imersivo, direto e impactante. Domine a engenharia social.",
    category: "Estilo de Vida",
    rating: "4.9",
    size: "15 MB",
    version: "Edição de Colecionador",
    iconFallback: Box,
    iconUrl: "",
    screenshots: ["", "", ""]
  },
  {
    id: "app-5",
    name: "BrokenReality",
    subtitle: "Sincronização de Pensamentos",
    description: "Uma interface que respira. Aplicativo experimental focado em anotações subliminares e organização de ideias fragmentadas.",
    category: "Ferramentas",
    rating: "4.7",
    size: "32 MB",
    version: "Beta 0.9",
    iconFallback: Ghost,
    iconUrl: "",
    screenshots: ["", "", ""]
  }
];