import { Shield, MapPin, Headphones, Truck } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const values = [
  {
    icon: MapPin,
    title: "Cobertura en Pinamar",
    description: "Presencia local con logística optimizada para toda la zona de Pinamar y alrededores de la Costa Atlántica.",
  },
  {
    icon: Headphones,
    title: "Atención los 365 días",
    description: "Atendemos tus consultas todos los días del año. Respuesta personalizada por WhatsApp, teléfono o mail.",
  },
  {
    icon: Truck,
    title: "Entrega inmediata",
    description: "Stock permanente y flota propia para entrega, instalación, mantenimiento y retiro sin demoras.",
  },
];

const ValueProposition = () => {
  return (
    <section className="section-padding bg-gradient-corporate">
      <div className="container-premium">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-4 block">
              Por qué elegirnos
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight">
              El estándar más alto en sanitarios portátiles
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {values.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 0.1}>
              <div className="bg-card rounded-lg p-8 shadow-card hover:shadow-elevated transition-shadow duration-500 group border border-border/50 h-full">
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;

