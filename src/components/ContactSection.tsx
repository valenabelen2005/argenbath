import { useState } from "react";
import { Send, MapPin, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ScrollReveal from "./ScrollReveal";
import { useToast } from "@/hooks/use-toast";

const WHATSAPP_URL = "https://wa.me/5492254414116?text=Hola%2C%20quiero%20solicitar%20un%20presupuesto";

const FORMSPREE_URL = "https://formspree.io/f/xpqoqzvw";

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    telefono: "",
    email: "",
    servicio: "",
    zona: "",
    fecha: "",
    mensaje: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre,
          empresa: formData.empresa,
          telefono: formData.telefono,
          email: formData.email,
          servicio: formData.servicio,
          zona: formData.zona,
          fecha: formData.fecha,
          mensaje: formData.mensaje,
        }),
      });
      if (res.ok) {
        toast({ title: "Mensaje enviado", description: "Nos comunicaremos con vos a la brevedad." });
        setFormData({ nombre: "", empresa: "", telefono: "", email: "", servicio: "", zona: "", fecha: "", mensaje: "" });
      } else {
        toast({ title: "Error al enviar", description: "Intentá de nuevo o contactanos por WhatsApp.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error de conexión", description: "Verificá tu internet e intentá de nuevo.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contacto" className="section-padding bg-gradient-corporate">
      <div className="container-premium">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-4 block">
              Contacto
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight">
              Pedí tu presupuesto sin compromiso
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
          <ScrollReveal className="lg:col-span-3" direction="left">
            <form onSubmit={handleSubmit} className="bg-card rounded-xl p-8 md:p-10 shadow-card border border-border/50 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Nombre *</label>
                  <Input
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    placeholder="Tu nombre"
                    className="h-12 bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Empresa (opcional)</label>
                  <Input
                    value={formData.empresa}
                    onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                    placeholder="Nombre de la empresa"
                    className="h-12 bg-background"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Teléfono (opcional)</label>
                  <Input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Ej: +54 9 2254 000000"
                    className="h-12 bg-background"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Email *</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="h-12 bg-background"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Servicio *</label>
                  <Select value={formData.servicio} onValueChange={(v) => setFormData({ ...formData, servicio: v })}>
                    <SelectTrigger className="h-12 bg-background">
                      <SelectValue placeholder="Seleccioná un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="obras">Alquiler para obras</SelectItem>
                      <SelectItem value="eventos">Alquiler para eventos</SelectItem>
                      <SelectItem value="premium">Baños premium</SelectItem>
                      <SelectItem value="modulos">Módulos premium</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Zona</label>
                  <Input
                    value={formData.zona}
                    onChange={(e) => setFormData({ ...formData, zona: e.target.value })}
                    placeholder="Ej: Pinamar, Cariló"
                    className="h-12 bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Fecha estimada</label>
                <Input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  className="h-12 bg-background"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Mensaje</label>
                <Textarea
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  placeholder="Contanos sobre tu proyecto..."
                  rows={4}
                  className="bg-background resize-none"
                />
              </div>

              <Button type="submit" size="lg" disabled={sending} className="w-full bg-primary text-primary-foreground hover:bg-primary-light h-14 text-base font-semibold gap-2">
                <Send className="w-5 h-5" />
                {sending ? "Enviando..." : "Enviar consulta"}
              </Button>
            </form>
          </ScrollReveal>

          <ScrollReveal className="lg:col-span-2" direction="right">
            <div className="space-y-6">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-green-600 text-primary-foreground rounded-xl p-6 shadow-elevated hover:bg-green-700 transition-colors group"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-foreground/10 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <div className="font-heading font-bold text-lg">WhatsApp directo</div>
                  <div className="text-sm opacity-80">Respuesta rápida, sin esperas</div>
                </div>
              </a>

              <div className="bg-card rounded-xl p-8 shadow-card border border-border/50 space-y-6">
                <h3 className="font-heading font-bold text-foreground text-lg">Datos de contacto</h3>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <Phone className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Teléfono</div>
                      <div className="text-sm text-muted-foreground">+54 9 2254 414116</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Mail className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Email</div>
                      <div className="text-sm text-muted-foreground">argenbath@gmail.com</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Ubicación</div>
                      <div className="text-sm text-muted-foreground">Pinamar, Buenos Aires, Argentina</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Zona de cobertura */}
              <div className="bg-card rounded-xl shadow-card border border-border/50 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="font-heading font-bold text-foreground text-lg">Zona de cobertura</h3>
                </div>
                <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-3">
                  Envíos en menos de 24 horas
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {[
                    "Pinamar", "Cariló", "Ostende", "Valeria del Mar",
                    "Gral. Rodríguez", "Capital Federal", "Vicente López", "San Vicente",
                    "Cañuelas", "Escobar", "Hudson", "Quilmes",
                    "Tigre", "Pilar",
                  ].map((zona) => (
                    <div key={zona} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {zona}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border">
                  ¡Y muchas más! Consultanos por tu zona.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

