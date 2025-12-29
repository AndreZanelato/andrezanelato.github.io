import { Header } from "@/components/Header";
import { ExternalLink, Cloud, Waves, Wind } from "lucide-react";

const Apis = () => {
  const apis = [
    {
      name: "OpenWeatherMap",
      description: "Fornece dados meteorológicos em tempo real, incluindo temperatura, umidade, pressão atmosférica, velocidade do vento, nascer e pôr do sol.",
      icon: Cloud,
      url: "https://openweathermap.org/api",
      endpoints: ["Weather API 2.5", "Forecast API"],
      dataProvided: ["Temperatura", "Sensação térmica", "Umidade", "Pressão", "Vento", "Visibilidade", "Nascer/Pôr do Sol"],
    },
    {
      name: "WorldTides",
      description: "API especializada em dados de marés, fornecendo horários e alturas de marés altas e baixas para qualquer localização costeira.",
      icon: Waves,
      url: "https://www.worldtides.info/",
      endpoints: ["Extremes API v3"],
      dataProvided: ["Horários das marés", "Altura das marés", "Tipo (alta/baixa)", "Estação de referência"],
    },
  ];

  return (
    <div className="min-h-screen sky-gradient">
      <Header />
      
      <main className="container mx-auto max-w-lg px-4 pb-8">
        <div className="-mt-4 space-y-4">
          <div className="glass-card rounded-xl p-5 shadow-card">
            <h1 className="text-xl font-bold mb-2">APIs Utilizadas</h1>
            <p className="text-sm text-muted-foreground">
              O Maré de Bolso utiliza as seguintes APIs para fornecer dados precisos e em tempo real.
            </p>
          </div>

          {apis.map((api) => {
            const IconComponent = api.icon;
            return (
              <div key={api.name} className="glass-card rounded-xl p-5 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold">{api.name}</h2>
                  </div>
                  <a
                    href={api.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    Documentação
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {api.description}
                </p>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Endpoints utilizados:</p>
                    <div className="flex flex-wrap gap-2">
                      {api.endpoints.map((endpoint) => (
                        <span
                          key={endpoint}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {endpoint}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Dados fornecidos:</p>
                    <div className="flex flex-wrap gap-2">
                      {api.dataProvided.map((data) => (
                        <span
                          key={data}
                          className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full"
                        >
                          {data}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="glass-card rounded-xl p-5 shadow-card">
            <h2 className="text-lg font-bold mb-2">Sobre os Dados</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Todos os dados são obtidos em tempo real das APIs oficiais. Em caso de falha na conexão, 
              dados ilustrativos são exibidos para manter a experiência do usuário.
            </p>
            <p className="text-sm text-muted-foreground">
              A previsão de pesca é gerada localmente com base nos dados meteorológicos, 
              fases da lua e condições das marés.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Apis;