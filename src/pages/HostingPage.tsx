import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Shield, Zap, Clock, Headphones, Star } from "lucide-react";
import datacenter from "@/assets/hero-datacenter.jpg";

const plans = [
  {
    name: "Starter",
    price: "500",
    monthly: "50",
    features: ["2GB SSD Storage", "10GB Bandwidth", "Free SSL Certificate", "2 Email Accounts", "1 Website", "cPanel Access", "Weekly Backups"],
  },
  {
    name: "Basic",
    price: "1,000",
    monthly: "100",
    features: ["5GB SSD Storage", "20GB Bandwidth", "Free SSL Certificate", "5 Email Accounts", "2 Websites", "cPanel Access", "Weekly Backups"],
  },
  {
    name: "Business",
    price: "2,000",
    monthly: "200",
    popular: true,
    features: ["15GB SSD Storage", "Unlimited Bandwidth", "Free SSL Certificate", "Unlimited Email Accounts", "5 Websites", "cPanel Access", "Daily Backups", "Free Domain"],
  },
  {
    name: "Professional",
    price: "3,000",
    monthly: "300",
    features: ["30GB SSD Storage", "Unlimited Bandwidth", "Free SSL Certificate", "Unlimited Email Accounts", "10 Websites", "cPanel Access", "Daily Backups", "Staging Environment"],
  },
  {
    name: "Enterprise",
    price: "4,500",
    monthly: "450",
    features: ["60GB SSD Storage", "Unlimited Bandwidth", "Free SSL Certificate", "Unlimited Email Accounts", "Unlimited Websites", "cPanel Access", "Real-time Backups", "Priority Support", "Dedicated IP"],
  },
];

const features = [
  { icon: Zap, title: "Lightning Fast", desc: "NVMe SSD storage for blazing-fast load times" },
  { icon: Shield, title: "DDoS Protection", desc: "Enterprise-grade security for your websites" },
  { icon: Clock, title: "99.9% Uptime", desc: "Guaranteed uptime with redundant infrastructure" },
  { icon: Headphones, title: "24/7 Support", desc: "Expert support team available around the clock" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function HostingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={datacenter} alt="Data center" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-hero/75" />
        </div>
        <div className="relative container-max px-4 lg:px-8 py-20">
          <span className="section-label !text-accent">Web Hosting</span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold text-hero-foreground leading-tight">
            Premium <span className="text-accent">Hosting</span> Plans
          </h1>
          <p className="text-hero-foreground/70 text-lg max-w-2xl mt-4">
            Fast, secure, and reliable SSD hosting with 99.9% uptime. Starting from KSh 500/year.
          </p>
        </div>
      </section>

      {/* Features bar */}
      <section className="bg-accent">
        <div className="container-max px-4 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="flex items-center gap-3 text-accent-foreground">
                <f.icon className="w-6 h-6 flex-shrink-0" />
                <div>
                  <div className="font-heading font-bold text-sm">{f.title}</div>
                  <div className="text-xs opacity-80">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="section-padding bg-background">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="section-label justify-center">Choose Your Plan</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">
              Hosting <span className="text-accent">Packages</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-lg mx-auto">All plans include free setup, cPanel, and 30-day money back guarantee.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-0 border border-border">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className={`p-6 border-r border-b last:border-r-0 flex flex-col ${plan.popular ? "bg-hero text-hero-foreground relative" : "bg-card"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-0 left-0 right-0">
                    <div className="bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 text-center flex items-center justify-center gap-1">
                      <Star className="w-3 h-3" /> Most Popular
                    </div>
                  </div>
                )}
                <div className={plan.popular ? "mt-6" : ""}>
                  <h3 className="font-heading font-bold text-xl mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-heading font-bold text-accent">KSh {plan.price}</span>
                    <span className={`text-sm ${plan.popular ? "text-hero-foreground/60" : "text-muted-foreground"}`}>/year</span>
                  </div>
                  <div className={`text-xs mb-6 ${plan.popular ? "text-hero-foreground/40" : "text-muted-foreground/60"}`}>
                    or KSh {plan.monthly}/month
                  </div>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${plan.popular ? "text-hero-foreground/80" : "text-muted-foreground"}`}>
                      <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" /> {f}
                    </li>
                  ))}
                </ul>
                <Button className={`w-full rounded-sm font-semibold uppercase text-xs tracking-wider ${
                  plan.popular
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}>
                  Order Now <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="section-padding bg-section-alt">
        <div className="container-max">
          <div className="text-center mb-12">
            <span className="section-label justify-center">Compare</span>
            <h2 className="font-heading text-3xl font-bold">Feature <span className="text-accent">Comparison</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-card border rounded-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-heading font-bold">Feature</th>
                  {plans.map((p) => (
                    <th key={p.name} className={`p-4 font-heading font-bold text-center ${p.popular ? "bg-accent/10 text-accent" : ""}`}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Storage", values: ["2GB", "5GB", "15GB", "30GB", "60GB"] },
                  { feature: "Bandwidth", values: ["10GB", "20GB", "Unlimited", "Unlimited", "Unlimited"] },
                  { feature: "Websites", values: ["1", "2", "5", "10", "Unlimited"] },
                  { feature: "Email Accounts", values: ["2", "5", "Unlimited", "Unlimited", "Unlimited"] },
                  { feature: "Free SSL", values: ["✓", "✓", "✓", "✓", "✓"] },
                  { feature: "Daily Backups", values: ["✗", "✗", "✓", "✓", "✓"] },
                  { feature: "Free Domain", values: ["✗", "✗", "✓", "✓", "✓"] },
                  { feature: "Priority Support", values: ["✗", "✗", "✗", "✗", "✓"] },
                ].map((row) => (
                  <tr key={row.feature} className="border-b last:border-0">
                    <td className="p-4 font-medium">{row.feature}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className={`p-4 text-center ${plans[i]?.popular ? "bg-accent/5" : ""} ${v === "✓" ? "text-accent font-bold" : v === "✗" ? "text-muted-foreground/40" : "text-muted-foreground"}`}>
                        {v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-hero" />
        <div className="relative container-max px-4 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-hero-foreground mb-4">
            Need Help Choosing?
          </h2>
          <p className="text-hero-foreground/60 mb-8 max-w-md mx-auto">
            Our team is ready to help you pick the perfect hosting plan for your needs.
          </p>
          <Link to="/contact">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold uppercase text-sm tracking-wider px-8 h-12 rounded-sm">
              Contact Sales <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
