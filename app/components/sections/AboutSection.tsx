export default function AboutSection() {
  return (
    <section id="about" className="py-10 bg-zinc-900 text-zinc-50 relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-150 h-150 rounded-full bg-zinc-800/50 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-100 h-100 rounded-full bg-zinc-800/30 blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Images */}
          <div className="relative">
            <div className="aspect-4/5 rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1000&auto=format&fit=crop" 
                alt="Boutique Interior" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-64 aspect-square rounded-2xl overflow-hidden border-4 border-zinc-900 shadow-2xl hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop" 
                alt="Fashion Detail" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="lg:pl-8">
            <h2 className="text-sm font-medium tracking-widest uppercase text-zinc-400 mb-4">Our Story</h2>
            <h3 className="text-4xl md:text-5xl font-serif mb-8 leading-tight">
              Where Elegance <br/>Meets Everyday Life.
            </h3>
            
            <div className="space-y-6 text-zinc-300 text-lg leading-relaxed mb-10">
              <p>
                At T&amp;D Ladies Fashion, we believe that true style is a reflection of your innermost self.
                Founded with a passion for premium aesthetics and uncompromising quality, our boutique 
                curates collections that empower you to express your unique identity.
              </p>
              <p>
                From tailored skirts and blouses to expressive statement pieces, every item in our store is selected 
                to offer you the finest in modern fashion. We do more than just sell clothes; we curate wardrobes that 
                inspire confidence.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 py-8 border-t border-zinc-800">
              <div>
                <h4 className="text-3xl font-serif text-white mb-2">10+</h4>
                <p className="text-sm text-zinc-400">Years of Excellence</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif text-white mb-2">Premium</h4>
                <p className="text-sm text-zinc-400">Quality Guaranteed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
