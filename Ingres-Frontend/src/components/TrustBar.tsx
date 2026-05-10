export const TrustBar = () => {
  const partners = [
    { name: "CGWB", logo: "Central Ground Water Board" },
    { name: "IIT Delhi", logo: "Indian Institute of Technology" },
    { name: "Ministry of Jal Shakti", logo: "Government of India" },
    { name: "NITI Aayog", logo: "National Institution" }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto">
      <p className="text-sand-light/70 text-sm font-medium mb-6 text-center">
        Trusted by leading institutions across India
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
        {partners.map((partner, index) => (
          <div
            key={partner.name}
            className="flex items-center justify-center p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/10 transition-smooth"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-2 mx-auto">
                <span className="text-white/80 font-bold text-xs">
                  {partner.name.split(' ').map(word => word[0]).join('')}
                </span>
              </div>
              <p className="text-white/70 text-xs font-medium">{partner.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};