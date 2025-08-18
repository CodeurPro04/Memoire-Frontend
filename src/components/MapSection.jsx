import React from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const MapSection = () => {
  return (
    <section className="relative h-[500px] w-full">
      {/* Carte Google Maps */}
      <iframe
        className="absolute inset-0 w-full h-full"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127118.28814897728!2d-4.062066210663938!3d5.3486155225480925!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1ea5311959121%3A0x3fe70ddce19221a6!2sAbidjan!5e0!3m2!1sfr!2sci!4v1744779253268!5m2!1sfr!2sci"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>

      {/* Bouton itinéraire */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <Button
          className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg px-8 py-4 flex items-center"
          onClick={() =>
            window.open("https://www.google.com/maps/dir/?api=1&destination=Abidjan", "_blank")
          }
        >
          <MapPin className="mr-2 h-5 w-5 text-sky-600" />
          Itinéraire vers nos bureaux
        </Button>
      </div>
    </section>
  );
};

export default MapSection;
