// appsData.ts
import type { ElementType } from "react";
import { LayoutGrid, Cpu} from "lucide-react";

export interface AppData {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  category: string;
  rating: string;
  size: string;
  version: string;
  iconFallback: ElementType;
  iconUrl: string;
  screenshots: string[];
  downloadUrl: string; // Campo do link de download mantido
}

export const storeApps: AppData[] = [
  {
    id: "app-1",
    name: "Whatsapp Auto Desk",
    subtitle: "Sua Central de Inteligência e Automação para WhatsApp.",
    description: "O Auto Desk é a solução definitiva para quem busca escala e organização no atendimento via WhatsApp. Unindo ferramentas poderosas de auto-resposta com uma gestão de CRM de última geração, o programa elimina o trabalho manual e organiza seu fluxo de mensagens de forma intuitiva. Com um motor de sincronização otimizado para alta performance e um sistema inteligente de recompensas por visualização de anúncios, oferecemos o equilíbrio perfeito entre acessibilidade e poder tecnológico. Tome o controle do seu atendimento e escale seu negócio com a precisão que só o Auto Desk oferece.",
    category: "Produtividade",
    rating: "4.7",
    size: "147 MB",
    version: "2.1.0",
    iconFallback: LayoutGrid,
    iconUrl: "./img/icon/icon-whats.png", // De volta ao original
    screenshots: [
      "./img/screenshot/whats01.png", // De volta ao original (singular)
      "./img/screenshot/whats02.png",
      "./img/screenshot/whats03.png",
      "./img/screenshot/whats04.png",
      "./img/screenshot/whats05.png"
    ],
    // Link para o download direto via Google Drive
    downloadUrl: "https://pub-e8bb082dd1084a6d8d5f90675eab1031.r2.dev/whatsapp-auto-desk-1.0.0-setup.exe"
  },
  {
    id: "app-2",
    name: "Link Escola",
    subtitle: "Gestão Simplificada para notas e desempenho de alunos",
    description: "O Link Escola pode ser a solução definitiva para instituições que buscam escala, autonomia e fluidez no ensino via rede local. Unindo um motor de renderização modular — que permite a construção de aulas bloco a bloco — com uma infraestrutura de sincronização LAN, o software elimina a dependência da internet e centraliza a inteligência pedagógica com precisão. Com um sistema de controle de concorrência que impede conflitos de dados e uma interface desenhada para o máximo engajamento (unindo temas divertidos a uma mecânica de recompensas), o Software oferece o equilíbrio entre a robustez técnica e a generosidade de uma ferramenta acessível. Tome o controle do fluxo educacional e escale o aprendizado com a autoridade e o refinamento que só o Link Escola Pro entrega.",
    category: "Educação",
    rating: "4.6",
    size: "122 MB",
    version: "1.0.5",
    iconFallback: Cpu,
    iconUrl: "./img/icon/icon-escola.png",
    screenshots: [
      "./img/screenshot/img-w01.png", 
      "./img/screenshot/img-w02.png", 
      "./img/screenshot/img-w03.png", 
      "./img/screenshot/img-w04.png", 
      "./img/screenshot/img-w05.png"
    ],
    // Link para o download direto via Google Drive
    downloadUrl: "https://pub-e8bb082dd1084a6d8d5f90675eab1031.r2.dev/software-escolar-1.0.0-setup.exe"
  }
];
