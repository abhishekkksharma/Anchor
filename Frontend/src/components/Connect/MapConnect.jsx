import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/components/ui/map";

const locations = [
  {
    id: 1,
    name: "Sukhna Lake",
    lng: 76.8081,
    lat: 30.7421,
  },
  {
    id: 2,
    name: "Rock Garden",
    lng: 76.805,
    lat: 30.7525,
  },
  {
    id: 3,
    name: "Elante Mall",
    lng: 76.804,
    lat: 30.7056,
  },
  {
    id: 4,
    name: "Capitol Complex",
    lng: 76.8095,
    lat: 30.758,
  },
  {
    id: 5,
    name: "Sector 17 Plaza",
    lng: 76.7821,
    lat: 30.7398,
  },
];
const theme = localStorage.getItem("theme");

function MapConnect() {
  return (
    <div className="h-96 w-full">
      <Map center={[76.7794, 30.7333]} zoom={12}>
        {locations.map((location) => (
          <MapMarker
            key={location.id}
            longitude={location.lng}
            latitude={location.lat}
          >
            <MarkerContent>
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-blue-500 opacity-30 animate-ping" />
                <div className="relative size-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-white shadow-xl hover:scale-110 transition-transform duration-200" />
              </div>
            </MarkerContent>

            <MarkerTooltip>{location.name}</MarkerTooltip>

            <MarkerPopup>
              <div className="space-y-1">
                <p className="font-medium">{location.name}</p>
                <p className="text-xs text-muted-foreground">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </p>
              </div>
            </MarkerPopup>
          </MapMarker>
        ))}
      </Map>
    </div>
  );
}

export default MapConnect;
