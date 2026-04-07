import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.webp";

const WHATSAPP_URL = "https://wa.me/5492254414116?text=Hola%2C%20quiero%20solicitar%20un%20presupuesto";

const HeroSection = () => {
  return (
    <section aria-label="Hero" className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Baños portátiles premium en obra" width={1920} height={1080} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/90 via-primary/80 to-primary/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />

      <div className="relative container-premium pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 backdrop-blur-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground/90 tracking-wide">
              Servicio activo en Pinamar, GBA y toda la provincia
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-extrabold text-primary-foreground leading-[1.05] tracking-tight mb-6"
          >
            Soluciones sanitarias
            <br />
            <span className="text-primary-foreground/70">de nivel profesional</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-lg md:text-xl text-primary-foreground/70 max-w-xl mb-10 leading-relaxed font-light"
          >
            Más de 25 años brindando el mejor servicio en alquiler de baños portátiles, módulos y oficinas para obras y eventos. Somos fabricantes — stock permanente y entrega inmediata en Pinamar.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#contacto">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold text-base px-8 h-14 gap-2 shadow-elevated w-full sm:w-auto">
                Solicitar presupuesto
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold text-base px-8 h-14 gap-2 shadow-elevated w-full sm:w-auto">
                <MessageCircle className="w-5 h-5" />
                Escribinos por WhatsApp
              </Button>
            </a>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16 pt-8 border-t border-primary-foreground/10 grid grid-cols-3 gap-8 max-w-lg"
          >
            {[
              { value: "200+", label: "Unidades disponibles" },
              { value: "25+", label: "Años de experiencia" },
              { value: "365", label: "Días de atención al año" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-heading font-bold text-primary-foreground">{stat.value}</div>
                <div className="text-xs md:text-sm text-primary-foreground/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

