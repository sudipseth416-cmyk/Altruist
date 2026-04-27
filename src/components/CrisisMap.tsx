"use client";

import React, { useEffect, useRef } from "react";
import type { CrisisLocation, CrisisNeed } from "@/lib/types";

interface CrisisMapProps {
  crisisLocations: CrisisLocation[];
  parsedNeeds: CrisisNeed[];
  onMarkerClick?: (id: string) => void;
}

const URGENCY_COLORS: Record<string, string> = {
  critical: "#fb7185",
  high: "#fbbf24",
  medium: "#22d3ee",
  low: "#34d399",
};

const URGENCY_PULSE: Record<string, string> = {
  critical: "rgba(251,113,133,0.4)",
  high: "rgba(251,191,36,0.3)",
  medium: "rgba(34,211,238,0.2)",
  low: "rgba(52,211,153,0.15)",
};

export default function CrisisMap({
  crisisLocations,
  parsedNeeds,
  onMarkerClick,
}: CrisisMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    /* Clean up any previous Leaflet instance on this DOM node (handles HMR / strict mode) */
    const container = mapRef.current as HTMLDivElement & { _leaflet_id?: number };
    if (container._leaflet_id) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      delete container._leaflet_id;
    }

    if (mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      // Fix Leaflet default icon issue
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current!, {
        center: [20, 78],
        zoom: 4,
        zoomControl: false,
        attributionControl: false,
      });

      // Dark tile layer
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          maxZoom: 19,
          subdomains: "abcd",
        }
      ).addTo(map);

      // Add zoom control to bottom-right
      L.control.zoom({ position: "bottomright" }).addTo(map);

      // attribution
      L.control
        .attribution({ position: "bottomleft", prefix: false })
        .addAttribution('© <a href="https://carto.com/">CARTO</a>')
        .addTo(map);

      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const updateMarkers = async () => {
      const L = (await import("leaflet")).default;
      const map = mapInstanceRef.current;

      // Clear existing markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      // Combine crisis locations and parsed needs
      const allPoints = [
        ...crisisLocations.map((c) => ({
          id: c.id,
          lat: c.coordinates[0],
          lng: c.coordinates[1],
          name: c.name,
          urgency: c.urgency,
          category: c.category,
          population: c.population,
          description: c.description,
          isNew: false,
        })),
        ...parsedNeeds.map((n) => ({
          id: n.id,
          lat: n.coordinates[0],
          lng: n.coordinates[1],
          name: n.location,
          urgency: n.urgency,
          category: n.category,
          population: n.population,
          description: n.description,
          isNew: true,
        })),
      ];

      for (const point of allPoints) {
        const color = URGENCY_COLORS[point.urgency] || "#22d3ee";
        const pulseColor = URGENCY_PULSE[point.urgency] || "rgba(34,211,238,0.2)";

        // Custom pulsing circle marker
        const icon = L.divIcon({
          className: "crisis-marker",
          html: `
            <div style="position:relative;width:24px;height:24px;">
              <div style="
                position:absolute;
                width:24px;height:24px;
                border-radius:50%;
                background:${color};
                opacity:0.9;
                box-shadow: 0 0 12px ${pulseColor}, 0 0 24px ${pulseColor};
                ${point.urgency === "critical" ? "animation: markerPulse 1.5s ease-in-out infinite;" : ""}
              "></div>
              <div style="
                position:absolute;
                top:4px;left:4px;
                width:16px;height:16px;
                border-radius:50%;
                background:${color};
                border: 2px solid rgba(255,255,255,0.8);
              "></div>
              ${point.isNew ? `<div style="
                position:absolute;
                top:-8px;right:-8px;
                width:14px;height:14px;
                border-radius:50%;
                background:#34d399;
                border:2px solid #060a14;
                font-size:8px;
                display:flex;align-items:center;justify-content:center;
                color:white;font-weight:bold;
              ">+</div>` : ""}
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([point.lat, point.lng], { icon }).addTo(map);

        // Popup
        marker.bindPopup(
          `<div style="
            background:#0f1629;
            color:#e2e8f0;
            padding:14px;
            border-radius:12px;
            border:1px solid rgba(255,255,255,0.08);
            min-width:220px;
            font-family:Inter,system-ui,sans-serif;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          ">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <span style="
                display:inline-block;width:8px;height:8px;border-radius:50%;
                background:${color};
                box-shadow: 0 0 8px ${pulseColor};
              "></span>
              <strong style="font-size:13px;color:white;">${point.name}</strong>
            </div>
            <div style="display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap;">
              <span style="
                font-size:10px;font-weight:600;text-transform:uppercase;
                letter-spacing:0.05em;
                padding:3px 8px;border-radius:6px;
                background:${color}20;color:${color};
                border:1px solid ${color}30;
              ">${point.urgency}</span>
              <span style="
                font-size:10px;font-weight:500;
                padding:3px 8px;border-radius:6px;
                background:rgba(255,255,255,0.05);color:#94a3b8;
                border:1px solid rgba(255,255,255,0.08);
              ">${point.category}</span>
            </div>
            <p style="font-size:11px;color:#94a3b8;line-height:1.5;margin:0 0 6px 0;">
              ${point.description}
            </p>
            ${point.population > 0 ? `
              <div style="
                font-size:10px;color:#64748b;
                padding-top:6px;border-top:1px solid rgba(255,255,255,0.06);
              ">
                👥 <strong style="color:#e2e8f0">${point.population.toLocaleString()}</strong> people affected
              </div>
            ` : ""}
          </div>`,
          {
            className: "custom-popup",
            closeButton: true,
            maxWidth: 280,
          }
        );

        marker.on("click", () => {
          onMarkerClick?.(point.id);
        });

        markersRef.current.push(marker);
      }

      // Fit bounds if we have points
      if (allPoints.length > 0) {
        const bounds = L.latLngBounds(
          allPoints.map((p) => [p.lat, p.lng] as [number, number])
        );
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 6 });
      }
    };

    updateMarkers();
  }, [crisisLocations, parsedNeeds, onMarkerClick]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-white/[0.06]">
      {/* Map container */}
      <div ref={mapRef} className="absolute inset-0 z-0" />

      {/* Overlay: Map title */}
      <div
        className="absolute top-3 left-3 z-[500] px-3.5 py-2 rounded-xl flex items-center gap-2"
        style={{
          background: "linear-gradient(135deg, rgba(6,10,20,0.92), rgba(15,22,41,0.88))",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-ngo-accent opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-ngo-accent" />
        </div>
        <span className="text-[11px] font-semibold text-white tracking-wide">
          CRISIS MAP
        </span>
        <span className="text-[10px] text-slate-500 font-medium">
          {crisisLocations.length + parsedNeeds.length} active
        </span>
      </div>

      {/* Legend */}
      <div
        className="absolute bottom-3 left-3 z-[500] px-3 py-2.5 rounded-xl"
        style={{
          background: "linear-gradient(135deg, rgba(6,10,20,0.92), rgba(15,22,41,0.88))",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center gap-3.5">
          {Object.entries(URGENCY_COLORS).map(([level, color]) => (
            <div key={level} className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ background: color, boxShadow: `0 0 6px ${color}40` }}
              />
              <span className="text-[9px] text-slate-400 font-medium capitalize">
                {level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for marker pulse animation */}
      <style jsx global>{`
        @keyframes markerPulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.4); opacity: 0.3; }
        }
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
          border-radius: 12px !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
        }
        .leaflet-popup-tip {
          background: #0f1629 !important;
          border: 1px solid rgba(255,255,255,0.08) !important;
          box-shadow: none !important;
        }
        .leaflet-popup-close-button {
          color: #64748b !important;
          font-size: 18px !important;
          top: 8px !important;
          right: 8px !important;
        }
        .leaflet-popup-close-button:hover {
          color: #e2e8f0 !important;
        }
      `}</style>
    </div>
  );
}
