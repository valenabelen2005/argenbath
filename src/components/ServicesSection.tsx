import { HardHat, PartyPopper, Star, Box, Sparkles, Truck, Building2 } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const services = [
  {
    icon: HardHat,
    title: "Alquiler para Obras",
    description: "Baños químicos resistentes y funcionales para todo tipo de obra civil. Cumplimiento normativo garantizado.",
  },
  {
    icon: PartyPopper,
    title: "Alquiler para Eventos",
    description: "Unidades limpias y presentables para eventos sociales, corporativos, deportivos y festivales.",
  },
  {
    icon: Star,
    title: "Baños Premium",
    description: "Unidades de alta gama con terminaciones superiores. Ideales para eventos exclusivos y proyectos de primer nivel.",
  },
  {
    icon: Box,
    title: "Módulos Premium",
    description: "Módulos sanitarios con múltiples puestos, agua corriente y terminaciones de calidad profesional.",
  },
  {
    icon: Sparkles,
    title: "Limpieza y Mantenimiento",
    description: "Servicio programado de limpieza, desinfección y reposición de insumos con frecuencia a medida.",
  },
  {
    icon: Truck,
    title: "Transporte y Logística",
    description: "Flota propia para entrega, instalación y retiro. Coordinación eficiente en toda la zona de cobertura.",
  },
  {
    icon: Building2,
    title: "Oficinas y Obradores",
    description: "Oficinas modulares, obradores y depósitos para obras y proyectos. Soluciones completas de espacio en cualquier terreno.",
  },
];

const ServicesSection = () => {
  return (
    <section id="servicios" className="section-padding bg-card">
      <div className="container-premium">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-4 block">
              Nuestros servicios
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight">
              Soluciones para cada necesidad
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <ScrollReveal key={service.title} delay={i * 0.08}>
              <div className="group relative bg-background rounded-lg p-8 border border-border/50 hover:border-primary/20 transition-all duration-500 hover:shadow-elevated h-full">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-light rounded-t-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="w-14 h-14 rounded-xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{service.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

