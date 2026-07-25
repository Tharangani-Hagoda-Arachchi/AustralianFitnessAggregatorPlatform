import { useMemo } from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import { useTheme } from '../context/TheamContext.jsx';



const containerStyle = { width: '100%', height: '100%' };

// A minimal dark map style so the embed doesn't look jarring against a dark page.
const DARK_MAP_STYLE = [
    { elementType: 'geometry', stylers: [{ color: '#1d2b2f' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#1d2b2f' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#8ec3b9' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2a3d42' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#132226' }] },
    { featureType: 'poi', stylers: [{ visibility: 'off' }] },
];

const GymMap = ({ lat, lng, name }) => {
    const { theme } = useTheme();
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    // Hooks must run unconditionally, so call useJsApiLoader even if the key is
    // missing — it just never finishes loading, and we fall back below.
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: apiKey || '',
        id: 'google-map-script',
    });

    const center = useMemo(() => ({ lat, lng }), [lat, lng]);

    // No API key configured: fall back to a keyless embed so the feature still
    // works out of the box, and note how to upgrade to the full interactive map.
    if (!apiKey) {
        return (
            <div className="overflow-hidden rounded-xl2 border border-ink/10">
                <iframe
                    title={`Map showing ${name}`}
                    width="100%"
                    height="280"
                    style={{ border: 0 }}
                    loading="lazy"
                    src={`https://www.google.com/maps?q=${lat},${lng}&output=embed`}
                />
                <p className="border-t border-ink/10 bg-card px-3 py-2 text-[11px] text-ink/40">
                    Set VITE_GOOGLE_MAPS_API_KEY for the fully interactive map.
                </p>
            </div>
        );
    }

    if (!isLoaded) {
        return (
            <div className="flex h-70` items-center justify-center rounded-xl2 border border-ink/10 bg-card text-sm text-ink/50">
                Loading map…
            </div>
        );
    }
    return (
        <div className="overflow-hidden rounded-xl2 border border-ink/10">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                    styles: theme === 'dark' ? DARK_MAP_STYLE : undefined,
                }}
            >
                <MarkerF position={center} title={name} />
            </GoogleMap>
        </div>
    )
}

export default GymMap