import ScrollReveal from "@/components/animations/ScrollReveal";

const teamMembers = [
  {
    name: "James Harrington",
    role: "Founder & CEO",
    since: "2009",
    bio: "15 years of curating the world's finest automobiles.",
  },
  {
    name: "Sophia Lane",
    role: "Head of Acquisitions",
    since: "2013",
    bio: "Sourcing exceptional vehicles from auctions and private collections worldwide.",
  },
  {
    name: "Marcus Chen",
    role: "Client Experience Director",
    since: "2016",
    bio: "Ensuring every client receives a truly personal journey.",
  },
  {
    name: "Elena Vasquez",
    role: "Finance & Partnerships",
    since: "2018",
    bio: "Making premium ownership accessible through tailored solutions.",
  },
];

export default function TeamSection() {
  return (
    <section className="mb-24">
      <ScrollReveal>
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-widest text-primary uppercase">
            Our People
          </p>
          <h2
            className="text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Meet the Team
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member, index) => (
          <ScrollReveal key={member.name} delay={index * 0.12}>
            <div className="h-full rounded-2xl border border-border bg-surface-light p-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-2xl font-bold text-primary">
                {member.name.charAt(0)}
              </div>
              <h3
                className="mt-4 text-lg font-bold"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {member.name}
              </h3>
              <p className="mt-1 text-xs font-medium tracking-widest text-primary uppercase">
                {member.role}
              </p>
              <p className="mt-1 text-xs text-muted">Since {member.since}</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/60">
                {member.bio}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
