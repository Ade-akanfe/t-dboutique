export default function LocationSection() {
  return (
    <section className="py-10 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-zinc-900 mb-4">Visit Our Boutique</h2>
          <p className="text-zinc-500">
            Experience our premium collection in person. Our style consultants are ready to help you find the perfect look.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Info Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-zinc-100 flex flex-col justify-between">
            <div>
              <div className="mb-10">
                <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-900 mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Location
                </h3>
                <p className="text-zinc-600 leading-relaxed">
                  T&amp;D Ladies Fashion<br />
                  123 Fashion Avenue<br />
                  New York, NY 10001
                </p>
              </div>

              <div>
                <h3 className="text-sm font-bold tracking-widest uppercase text-zinc-900 mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Opening Hours
                </h3>
                <ul className="space-y-3 text-zinc-600">
                  <li className="flex justify-between"><span>Monday - Friday</span> <span>10:00 AM - 8:00 PM</span></li>
                  <li className="flex justify-between"><span>Saturday</span> <span>10:00 AM - 9:00 PM</span></li>
                  <li className="flex justify-between"><span>Sunday</span> <span>11:00 AM - 6:00 PM</span></li>
                </ul>
              </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-zinc-100">
              <p className="text-zinc-900 font-medium mb-1">Contact Us</p>
              <a href="mailto:contact@tdfashiontrend.com" className="text-zinc-500 hover:text-zinc-900 transition-colors block">contact@tdfashiontrend.com</a>
              <a href="tel:+2348105535967" className="text-zinc-500 hover:text-zinc-900 transition-colors block">+234 810 553 5967</a>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden h-[500px] shadow-sm border border-zinc-100 bg-zinc-200">
            {/* Embedded Google Map - Using a general NY location as placeholder */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.2528000654!2d-74.14448744574972!3d40.69763123330614!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1707323136270!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Boutique Location"
            ></iframe>
          </div>
          
        </div>
      </div>
    </section>
  );
}
