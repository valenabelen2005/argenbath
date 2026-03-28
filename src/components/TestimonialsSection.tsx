import { Star, Quote } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const testimonials = [
  {
    name: "Martín Gutiérrez",
    role: "Director de Obra — Constructora del Sur",
    text: "Trabajamos con Argenbath en tres obras simultáneas en Pinamar. La logística impecable y el mantenimiento constante nos permitieron enfocarnos en lo nuestro sin preocupaciones.",
  },
  {
    name: "Lucía Fernández",
    role: "Organizadora de Eventos — LF Producciones",
    text: "Para nuestro evento de 500 personas necesitábamos unidades premium que estuvieran a la altura. Argenbath cumplió con creces. Profesionalismo total.",
  },
  {
    name: "Diego Morales",
    role: "Jefe de Operaciones — Desarrollos Costeros SA",
    text: "Llevamos dos temporadas trabajando con ellos. La respuesta es inmediata, las unidades siempre en perfecto estado. Son nuestro proveedor fijo en la zona.",
  },
];

const trustedBy = [
  "Constructora del Sur",
  "Desarrollos Costeros SA",
  "LF Producciones",
  "Municipalidad de Pinamar",
  "Costa Build Group",
];

const TestimonialsSection = () => {
  return (
    <section className="section-padding bg-gradient-corporate">
      <div className="container-premium">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-4 block">
              Testimonios
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight">
              La confianza de nuestros clientes
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.name} delay={i * 0.1}>
              <div className="bg-card rounded-lg p-8 shadow-card border border-border/50 h-full flex flex-col">
                <Quote className="w-8 h-8 text-primary/20 mb-4" />
                <p className="text-foreground/80 text-sm leading-relaxed flex-1 mb-6">"{t.text}"</p>
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <div>
                  <div className="font-heading font-bold text-foreground">{t.name}</div>
                  <div className="text-muted-foreground text-xs mt-1">{t.role}</div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal>
          <div className="text-center">
            <p className="text-sm text-muted-foreground tracking-widest uppercase mb-8">
              Confían en nosotros
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
              {trustedBy.map((name) => (
                <span key={name} className="text-steel font-heading font-semibold text-sm md:text-base tracking-wide">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;

