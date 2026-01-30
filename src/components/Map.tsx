
'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, CircleMarker } from 'react-leaflet';
import { LatLngTuple, Icon } from 'leaflet';
import { Locate, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Next.js
import L from 'leaflet';

const DEFAULT_CENTER: LatLngTuple = [31.5204, 74.3587]; // Lahore
const DEFAULT_ZOOM = 13;


// Separate component to handle map events and new reports
function ReportLayer({
    newReportPosition,
    setNewReportPosition,
    setReports
}: {
    newReportPosition: LatLngTuple | null,
    setNewReportPosition: (pos: LatLngTuple | null) => void,
    setReports: React.Dispatch<React.SetStateAction<any[]>>
}) {
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useMapEvents({
        dblclick(e) {
            setNewReportPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReportPosition) return;

        setSubmitting(true);
        try {
            const { data, error } = await supabase
                .from('reports')
                .insert([
                    {
                        latitude: newReportPosition[0],
                        longitude: newReportPosition[1],
                        description: description
                    }
                ])
                .select();

            if (error) throw error;

            if (data) {
                setReports(prev => [...prev, data[0]]);
                setNewReportPosition(null);
                setDescription('');
                alert("Report submitted successfully!");
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            alert("Failed to submit report. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return newReportPosition === null ? null : (
        <Popup position={newReportPosition}>
            <div className="p-2 min-w-[200px]">
                <h3 className="font-bold mb-2 text-sm uppercase text-slate-700">Report Open Manhole</h3>
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <textarea
                        className="w-full p-2 border border-slate-300 rounded text-sm min-h-[60px]"
                        placeholder="Describe the hazard..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <div className="flex gap-2 justify-end">
                        <button
                            type="button"
                            onClick={() => setNewReportPosition(null)}
                            className="px-3 py-1 text-xs text-slate-500 hover:text-slate-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-3 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-500 disabled:opacity-50"
                        >
                            {submitting ? 'Submitting...' : 'Report Hazard'}
                        </button>
                    </div>
                </form>
            </div>
        </Popup>
    );
}

function LocateControl({ onLocate, loading }: { onLocate: () => void, loading: boolean }) {
    // Prevent click propagation to map
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        onLocate();
    };

    return (
        <div className="leaflet-bottom leaflet-right">
            <div className="leaflet-control leaflet-bar">
                <button
                    onClick={handleClick}
                    className="flex items-center justify-center bg-white hover:bg-slate-100 text-slate-800 p-2 w-10 h-10 shadow-md border-none cursor-pointer"
                    title="Locate me"
                    disabled={loading}
                    style={{ zIndex: 1000, pointerEvents: 'auto' }}
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    ) : (
                        <Locate className="w-5 h-5" />
                    )}
                </button>
            </div>
        </div>
    );
}

export default function Map() {
    const [center, setCenter] = useState<LatLngTuple>(DEFAULT_CENTER);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [mapKey, setMapKey] = useState(0); // Force re-render on locate
    const [reports, setReports] = useState<any[]>([]);
    const [newReportPosition, setNewReportPosition] = useState<LatLngTuple | null>(null);

    // Memoize icon to prevent recreation on re-renders, but safe for client-side
    const customIcon = new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    useEffect(() => {
        const fetchReports = async () => {
            const { data, error } = await supabase
                .from('reports')
                .select('*')
                .eq('status', 'open');

            if (error) {
                console.error("Error fetching reports:", error);
            } else {
                setReports(data || []);
            }
        };

        fetchReports();
    }, []);

    const handleLocateMe = () => {
        setLoadingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newCenter: LatLngTuple = [
                        position.coords.latitude,
                        position.coords.longitude
                    ];
                    setCenter(newCenter);
                    setMapKey(prev => prev + 1); // Remount/Update map center
                    setLoadingLocation(false);
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Could not access your location. Please check permissions.");
                    setLoadingLocation(false);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
            setLoadingLocation(false);
        }
    };

    return (
        <div className="w-full h-full relative isolate">
            <MapContainer
                key={mapKey}
                center={center}
                zoom={DEFAULT_ZOOM}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
                style={{ height: 'calc(100vh - 64px)', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* User Location Marker */}
                <Marker position={center} icon={customIcon}>
                    <Popup>
                        {center === DEFAULT_CENTER ? "Lahore, Pakistan" : "Selected Location"}
                    </Popup>
                </Marker>

                {/* Existing Reports */}
                {reports.map((report) => (
                    <CircleMarker
                        key={report.id}
                        center={[report.latitude, report.longitude]}
                        pathOptions={{ color: 'red', fillColor: '#f87171', fillOpacity: 0.7 }}
                        radius={10}
                    >
                        <Popup>
                            <div className="min-w-[150px]">
                                <h4 className="font-bold text-red-600 mb-1">Open Manhole</h4>
                                <p className="text-sm text-slate-700">{report.description || "No description provided."}</p>
                                <span className="text-xs text-slate-400 mt-2 block">
                                    Reported: {new Date(report.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}

                {/* New Report Form Layer */}
                <ReportLayer
                    newReportPosition={newReportPosition}
                    setNewReportPosition={setNewReportPosition}
                    setReports={setReports}
                />

            </MapContainer>

            <div className="absolute bottom-8 right-8 z-[1000]">
                <button
                    onClick={handleLocateMe}
                    className="flex items-center justify-center p-3 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all border border-blue-400"
                >
                    {loadingLocation ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <Locate className="w-6 h-6" />
                    )}
                </button>
            </div>

            {/* Instruction Overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-md pointer-events-none md:pointer-events-auto">
                <p className="text-sm font-medium text-slate-700">Double-click map to report a hazard</p>
            </div>
        </div>
    );
}
