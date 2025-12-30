interface LocationMapProps {
  latitude: number;
  longitude: number;
  locationName?: string;
}

export function LocationMap({ latitude, longitude, locationName }: LocationMapProps) {
  const mapUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=12&output=embed`;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">
          📍 Localização {locationName && `- ${locationName}`}
        </h3>
      </div>
      <div className="aspect-video w-full">
        <iframe
          src={mapUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Mapa de ${locationName || 'localização'}`}
        />
      </div>
    </div>
  );
}
