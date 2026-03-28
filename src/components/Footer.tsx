import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-navy text-primary-foreground">
      <div className="container-premium py-16">
        <div className="grid md:grid-cols-3 gap-12">
          <div>
            <div className="font-heading font-extrabold text-2xl tracking-tight mb-2">ARGENBATH</div>
            <div className="text-xs tracking-widest uppercase text-primary-foreground/50 mb-4">Portátiles</div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-xs">
              Soluciones sanitarias portátiles de nivel profesional para obras y eventos en Pinamar y Costa Atlántica.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-primary-foreground/50 mb-6">Servicios</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li>Alquiler para obras</li>
              <li>Alquiler para eventos</li>
              <li>Baños premium</li>
              <li>Módulos premium</li>
              <li>Limpieza y mantenimiento</li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-primary-foreground/50 mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-foreground/40" />
                +54 9 2254 414116
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle className="w-4 h-4 text-primary-foreground/40" />
                <a href="https://wa.me/5492254414116" target="_blank" rel="noopener noreferrer" className="hover:text-primary-foreground transition-colors">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-foreground/40" />
                argenbath@gmail.com
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-primary-foreground/40" />
                Pinamar, Buenos Aires
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} Argenbath Portátiles. Todos los derechos reservados.
          </p>
          <p className="text-xs text-primary-foreground/30">
            Pinamar · GBA · Buenos Aires · Argentina
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

