import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";

const WHATSAPP_URL = "https://wa.me/5492254414116?text=Hola%2C%20quiero%20solicitar%20un%20presupuesto";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Servicios", href: "#servicios" },
    { label: "Productos", href: "#productos" },
    { label: "Proceso", href: "#proceso" },
    { label: "FAQ", href: "#faq" },
    { label: "Contacto", href: "#contacto" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-visible ${
        scrolled
          ? "bg-card/95 backdrop-blur-md shadow-corporate border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="container-premium flex items-center justify-between h-20 md:h-24 overflow-visible">
        <a href="#" className="flex items-center overflow-visible">
          <img
            src={logo}
            alt="Grupo ArgenBath S.A."
            className={`w-36 md:w-48 h-auto transition-all duration-300 ${!scrolled ? "brightness-0 invert" : ""}`}
          />
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-primary ${
                scrolled ? "text-foreground/80" : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className={`gap-2 ${!scrolled ? "border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent" : ""}`}>
              <Phone className="w-4 h-4" />
              WhatsApp
            </Button>
          </a>
          <a href="#contacto">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary-light">
              Solicitar presupuesto
            </Button>
          </a>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`lg:hidden p-2 transition-colors ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-card border-t border-border shadow-corporate">
          <div className="container-premium py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-foreground/80 font-medium py-2 hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full gap-2">
                  <Phone className="w-4 h-4" />
                  WhatsApp
                </Button>
              </a>
              <a href="#contacto">
                <Button className="w-full bg-primary text-primary-foreground">
                  Solicitar presupuesto
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

