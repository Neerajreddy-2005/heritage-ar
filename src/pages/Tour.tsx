import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface HeritageSite {
  name: string;
  location: [number, number];
  category: string;
  description: string;
  year: string;
  image?: string;
  fullInfo?: boolean; // Added for the new card overlay
}

const heritageSites: HeritageSite[] = [
  {
    name: "Taj Mahal",
    location: [27.1751, 78.0421],
    category: "historical",
    description: "A stunning white marble mausoleum built in the 17th century by Emperor Shah Jahan in memory of his wife Mumtaz Mahal.",
    year: "1632-1653",
    image: "heritage-pics/tajmahal.jpg"
  },
  {
    name: "Red Fort",
    location: [28.6562, 77.2410],
    category: "historical",
    description: "An iconic fort in Delhi built by Emperor Shah Jahan, representing Mughal architecture in India.",
    year: "1638-1648",
    image: "heritage-pics/redfort.jpg"
  },
  {
    name: "Hawa Mahal",
    location: [26.9239, 75.8267],
    category: "historical",
    description: "A palace in Jaipur known as the 'Palace of Winds', celebrated for its unique façade with numerous windows.",
    year: "1799",
    image: "heritage-pics/hawamahal.jpg"
  },
  {
    name: "Gateway of India",
    location: [18.921984, 72.834654],
    category: "historical",
    description: "A monumental arch in Mumbai, built to commemorate the visit of King George V and Queen Mary.",
    year: "1924",
    image: "heritage-pics/gateway.jpg"
  },
  {
    name: "India Gate",
    location: [28.6129, 77.2295],
    category: "historical",
    description: "A war memorial in New Delhi dedicated to the soldiers who sacrificed their lives during World War I.",
    year: "1931",
    image: "heritage-pics/indiagate.jpg"
  },
  {
    name: "Charminar",
    location: [17.3616, 78.4747],
    category: "historical",
    description: "A 16th-century mosque and monument in Hyderabad with four grand arches.",
    year: "1591",
    image: "heritage-pics/charminar.jpg"
  },
  {
    name: "Sanchi Stupa",
    location: [23.4759, 77.7389],
    category: "historical",
    description: "An ancient Buddhist complex in India famous for its well-preserved stupas and carvings.",
    year: "3rd century BCE",
    image: "heritage-pics/sanchistupa.jpg"
  },
  {
    name: "Victoria Mahal",
    location: [22.5448, 88.3422],
    category: "historical",
    description: "A majestic structure reflecting colonial-era grandeur and heritage, reminiscent of Indo-Saracenic architecture.",
    year: "1906",
    image: "heritage-pics/vitoriamahal.jpg"
  },
  {
    name: "Qutub Minar",
    location: [28.5244, 77.1855],
    category: "historical",
    description: "A towering minaret in Delhi, built in the early 13th century as a victory monument.",
    year: "1193-1368",
    image: "heritage-pics/qutubminar.jpg"
  },
  {
    name: "Mysore Palace",
    location: [12.3051, 76.6551],
    category: "historical",
    description: "A magnificent palace in India known for its grandeur, intricate artistry, and cultural festivities.",
    year: "1399; current structure from 1912",
    image: "heritage-pics/mysore place.jpg"
  },
];

const categories = [
  { id: 'all', name: 'All', color: 'bg-gray-500' },
  { id: 'historical', name: 'Historical', color: 'bg-yellow-700' },
];

const heritageIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const indiaBounds: [[number, number], [number, number]] = [
  [6.5546079, 68.1113787],   // Southwest corner (approx)
  [35.6745457, 97.395561]    // Northeast corner (approx)
];

const Tour: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSite, setSelectedSite] = useState<HeritageSite | null>(null);

  const filteredSites = selectedCategory === 'all'
    ? heritageSites
    : heritageSites.filter(site => site.category === selectedCategory);

  return (
    <div className="min-h-screen bg-heritage-950 relative">
      <Header title="Heritage Tour" showBackButton />
      <main className="container mx-auto px-4 pt-24 pb-16 relative z-0">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Explore Heritage Sites</h1>
            <p className="text-heritage-300 max-w-2xl mx-auto">
              Discover India's most iconic heritage sites. Click on a marker to learn more about each site.
            </p>
          </div>
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${selectedCategory === category.id 
                    ? 'bg-accent text-white' 
                    : 'bg-heritage-800 text-heritage-300 hover:bg-heritage-700'
                  }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          {/* Map Integration */}
          <div className="bg-heritage-900/50 rounded-xl p-2 h-[600px] relative z-0 overflow-hidden">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={5}
              style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
              maxBounds={indiaBounds}
              maxBoundsViscosity={1.0}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {filteredSites.map(site => (
                <Marker
                  key={site.name}
                  position={site.location}
                  icon={heritageIcon}
                  eventHandlers={{
                    click: () => setSelectedSite(site),
                  }}
                />
              ))}
            </MapContainer>
            {/* Card overlay for selected site */}
            {selectedSite && (
              <div className="absolute left-1/2 top-8 transform -translate-x-1/2 z-[1000] w-full max-w-md bg-heritage-900/95 rounded-xl shadow-xl p-6 border border-heritage-800">
                <button className="float-right text-heritage-400 hover:text-white" onClick={() => setSelectedSite(null)}>
                  Close
                </button>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedSite.name}</h3>
                {selectedSite.image && (
                  <img
                    src={`/${selectedSite.image}`}
                    alt={selectedSite.name}
                    className="w-full h-auto mb-2 rounded"
                    style={{ maxWidth: 400 }}
                  />
                )}
                <p className="text-heritage-300 mb-2 line-clamp-3">{selectedSite.description}</p>
                <p className="text-heritage-400 mb-2"><strong>Period:</strong> {selectedSite.year}</p>
                <p className="text-heritage-400 mb-4"><strong>Category:</strong> {selectedSite.category.charAt(0).toUpperCase() + selectedSite.category.slice(1)}</p>
                {!selectedSite.fullInfo ? (
                  <button
                    className="bg-accent text-white px-4 py-2 rounded hover:bg-accent/80 transition"
                    onClick={() => setSelectedSite({ ...selectedSite, fullInfo: true })}
                  >
                    Learn More
                  </button>
                ) : (
                  <>
                    <p className="text-heritage-200 mb-2">{selectedSite.description}</p>
                    {/* Add more detailed info here if available */}
                    <a
                      href={`/models/${encodeURIComponent(selectedSite.name)}`}
                      className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Model
                    </a>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Tour; 