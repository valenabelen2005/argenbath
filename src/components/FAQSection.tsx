import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ScrollReveal from "./ScrollReveal";

const faqs = [
  {
    question: "¿Cuál es el tiempo mínimo de alquiler?",
    answer: "Trabajamos con alquileres desde un día para eventos hasta contratos prolongados para obras. Te asesoramos según tu necesidad específica.",
  },
  {
    question: "¿Incluyen mantenimiento y limpieza?",
    answer: "Sí. Todos nuestros servicios incluyen limpieza, desinfección y reposición de insumos con frecuencia programada según el tipo de uso y la cantidad de unidades.",
  },
  {
    question: "¿Qué zona cubren?",
    answer: "Nuestra base está en Pinamar y cubrimos toda la Costa Atlántica, incluyendo Ostende, Valeria del Mar, Cariló y zonas aledañas.",
  },
  {
    question: "¿Cómo solicito un presupuesto?",
    answer: "Podés escribirnos por WhatsApp o completar el formulario de contacto en esta página. Te respondemos en menos de 24 horas con una propuesta detallada.",
  },
  {
    question: "¿Tienen unidades premium para eventos?",
    answer: "Sí. Contamos con tráilers sanitarios VIP y módulos premium con agua corriente, iluminación, espejos y terminaciones de alta calidad.",
  },
  {
    question: "¿Se encargan del transporte e instalación?",
    answer: "Sí. Contamos con flota propia para entrega, instalación, mantenimiento programado y retiro de las unidades al finalizar el alquiler.",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="section-padding bg-card">
      <div className="container-premium">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-4 block">
              Preguntas frecuentes
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight">
              Resolvé tus dudas
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-background rounded-lg border border-border/50 px-6 data-[state=open]:shadow-card transition-shadow"
                >
                  <AccordionTrigger className="text-left font-heading font-semibold text-foreground hover:text-primary py-5 text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQSection;

