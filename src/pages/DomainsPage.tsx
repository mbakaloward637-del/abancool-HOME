import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe, ArrowRight, Shield, RefreshCw, Lock, Headphones, CheckCircle2 } from "lucide-react";
import datacenter from "@/assets/hero-datacenter.jpg";

const extensions = [
  { ext: ".com", price: "1,500", desc: "Most popular worldwide" },
  { ext: ".net", price: "1,600", desc: "Networks & tech" },
  { ext: ".org", price: "1,500", desc: "Organizations & NGOs" },
  { ext: ".co.ke", price: "1,200", desc: "Kenyan businesses" },
  { ext: ".africa", price: "2,200", desc: "Pan-African identity" },
  { ext: ".tech", price: "2,000", desc: "Technology companies" },
  { ext: ".online", price: "1,800", desc: "Online presence" },
  { ext: ".store", price: "1,800", desc: "E-commerce shops" },
];

const domainFeatures = [
  { icon: Shield, title: "WHOIS Privacy", desc: "Free domain privacy protection" },
  { icon: RefreshCw, title: "Auto Renewal", desc: "Never lose your domain" },
  { icon: Lock, title: "Domain Lock", desc: "Prevent unauthorized transfers" },
  { icon: Headphones, title: "DNS Management", desc: "Full DNS control panel" },
];

export default function DomainsPage() {
  const [query, setQuery] = useState("");

  return (
    <>
      {/* Hero with search */}
      <section className="relative min-h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={datacenter} alt="Infrastructure" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-hero/85" />
        </div>
        <div className="relative container-max px-4 lg:px-8 py-20 text-center">
          <span className="section-label justify-center !text-accent">Domain Registration</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-hero-foreground leading-tight mb-4">
            Find Your Perfect <span className="text-accent">Domain</span>
          </h1>
          <p className="text-hero-foreground/70 text-lg max-w-xl mx-auto mb-8">
            Establish your online presence with a professional domain name. Starting from KSh 1,200/year.
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 bg-card/10 backdrop-blur-sm p-2 rounded-sm border border-hero-foreground/10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Enter your desired domain name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10 h-12 bg-card text-foreground rounded-sm border-0"
                />
              </div>
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 h-12 rounded-sm font-semibold uppercase text-xs tracking-wider">
                Search
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {[".com", ".co.ke", ".africa", ".tech"].map((ext) => (
                <span key={ext} className="text-hero-foreground/50 text-sm font-medium">{ext}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-accent">
        <div className="container-max px-4 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {domainFeatures.map((f) => (
              <div key={f.title} className="flex items-center gap-3 text-accent-foreground">
                <f.icon className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-heading font-bold text-xs">{f.title}</div>
                  <div className="text-[10px] opacity-80">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing grid */}
      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="section-label justify-center">Pricing</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">Domain <span className="text-accent">Extensions</span></h2>
            <p className="text-muted-foreground mt-3">All domains include free WHOIS privacy and DNS management.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-border">
            {extensions.map((d, i) => (
              <motion.div
                key={d.ext}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 border-r border-b bg-card group hover:bg-accent transition-colors duration-500"
              >
                <Globe className="w-8 h-8 text-accent mx-auto mb-3 group-hover:text-accent-foreground transition-colors duration-500" />
                <div className="font-heading font-bold text-xl mb-1 text-center group-hover:text-accent-foreground transition-colors duration-500">{d.ext}</div>
                <div className="text-accent font-bold text-center text-lg group-hover:text-accent-foreground transition-colors duration-500">KSh {d.price}</div>
                <div className="text-xs text-muted-foreground text-center group-hover:text-accent-foreground/70 transition-colors duration-500">/year</div>
                <div className="text-[10px] text-muted-foreground/60 text-center mt-1 group-hover:text-accent-foreground/50 transition-colors duration-500">{d.desc}</div>
                <Button size="sm" className="mt-4 w-full text-xs rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 group-hover:bg-accent-foreground group-hover:text-accent transition-colors duration-500">
                  Register
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk / Transfer */}
      <section className="section-padding bg-section-alt">
        <div className="container-max max-w-4xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border rounded-sm p-8">
              <h3 className="font-heading font-bold text-xl mb-3">Bulk Domain Registration</h3>
              <p className="text-muted-foreground text-sm mb-4">Registering multiple domains? Contact us for volume discounts and custom packages.</p>
              <Link to="/contact">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-sm font-semibold uppercase text-xs tracking-wider">
                  Get Quote <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <div className="bg-card border rounded-sm p-8">
              <h3 className="font-heading font-bold text-xl mb-3">Transfer Your Domain</h3>
              <p className="text-muted-foreground text-sm mb-4">Transfer your existing domain to Abancool and enjoy free 1-year extension.</p>
              <ul className="space-y-2 mb-4">
                {["Free 1-year extension", "No downtime during transfer", "Free DNS management"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <Button variant="outline" className="rounded-sm font-semibold uppercase text-xs tracking-wider">
                  Start Transfer <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
