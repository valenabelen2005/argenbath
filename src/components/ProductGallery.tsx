import ScrollReveal from "./ScrollReveal";
import product1 from "@/assets/product-1.webp";
import product2 from "@/assets/product-2.webp";
import product3 from "@/assets/product-3.webp";
import product4 from "@/assets/product-4.webp";

const products = [
  {
    image: product1,
    name: "Baño para Obras y Proyectos",
    description: "Unidad práctica y resistente para obras y proyectos en movimiento. Fácil de transportar e instalar en cualquier terreno, ideal para cubrir necesidades básicas con rapidez y eficiencia.",
  },
  {
    image: product2,
    name: "Baños Premium para Eventos",
    description: "Solución premium para eventos que requieren imagen y confort. Equipado con acabados de calidad, iluminación y agua corriente, pensado para ofrecer una experiencia superior.",
  },
  {
    image: product3,
    name: "Solución Sanitaria para Obras de Gran Escala",
    description: "Diseñado para obras de gran escala y alto uso continuo. Estructura reforzada y alta durabilidad para soportar condiciones exigentes sin comprometer el servicio.",
  },
  {
    image: product4,
    name: "Módulos Sanitarios de Alta Capacidad",
    description: "Módulo sanitario de mayor capacidad, ideal para eventos o proyectos con alto flujo de personas. Ofrece mayor comodidad, múltiples puestos y una presencia más profesional.",
  },
];

const ProductGallery = () => {
  return (
    <section id="productos" className="section-padding bg-gradient-corporate">
      <div className="container-premium">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-4 block">
              Nuestros productos
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground tracking-tight">
              Equipamiento de primer nivel
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ScrollReveal key={product.name} delay={i * 0.1}>
              <div className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 border border-border/50 h-full">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-heading font-bold text-foreground mb-2">{product.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGallery;

