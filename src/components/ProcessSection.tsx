import { MessageSquare, ClipboardCheck, TruckIcon, Settings } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Nos contactás",
    description: "Escribinos por WhatsApp o completá el formulario con los datos de tu proyecto.",
  },
  {
    icon: ClipboardCheck,
    number: "02",
    title: "Te asesoramos",
    description: "Evaluamos tu necesidad y te recomendamos la mejor solución con presupuesto detallado.",
  },
  {
    icon: TruckIcon,
    number: "03",
    title: "Coordinamos entrega",
    description: "Programamos la entrega e instalación en el lugar y fecha que necesites.",
  },
  {
    icon: Settings,
    number: "04",
    title: "Servicio continuo",
    description: "Mantenimiento programado, limpieza y soporte durante todo el período de alquiler.",
  },
];

const ProcessSection = () => {
  return (
    <section id="proceso" className="section-padding bg-card">
      <div className="container-premium">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-4 block">
              Cómo funciona
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight">
              Simple, rápido y profesional
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 0.12}>
              <div className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
                )}
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <span className="text-xs font-bold tracking-widest text-primary/40 uppercase mb-2 block">
                  Paso {step.number}
                </span>
                <h3 className="text-lg font-heading font-bold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;

