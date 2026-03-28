import ScrollReveal from "./ScrollReveal";
import product1 from "@/assets/product-1.webp";
import product2 from "@/assets/product-2.webp";
import product3 from "@/assets/product-3.webp";
import product4 from "@/assets/product-4.webp";

const products = [
  {
    image: product1,
    name: "Baño Químico Estándar",
    description: "Unidad resistente y funcional para obras de toda escala. Fácil de transportar e instalar.",
  },
  {
    image: product2,
    name: "Tráiler Sanitario VIP",
    description: "Módulo premium con agua corriente, iluminación y terminaciones de lujo para eventos exclusivos.",
  },
  {
    image: product3,
    name: "Baño Industrial Reforzado",
    description: "Unidad de alta resistencia para obras de gran envergadura y condiciones exigentes.",
  },
  {
    image: product4,
    name: "Módulo Sanitario Premium",
    description: "Módulo con múltiples puestos, ideal para obrador o eventos con alto flujo de personas.",
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
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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

