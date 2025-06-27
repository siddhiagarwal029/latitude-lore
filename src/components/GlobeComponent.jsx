import React, { useRef, useState, useEffect } from 'react';
import { Howl } from 'howler';
import Globe from 'react-globe.gl';
import locationsData from '../data/locations.json';

const GlobeComponent = () => {
  const globeRef = useRef();
  const soundRef = useRef(null);      // for lore point sound
  const bgSoundRef = useRef(null);    // for cosmic ambient
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    globeRef.current?.pointOfView({ lat: 20, lng: 0, altitude: 2 }, 2000);
    setLocations(locationsData);

    // 🔊 Play cosmic background loop
    const bgSound = new Howl({
      src: ['https://cdn.pixabay.com/audio/2025/02/14/audio_2f5ef5adb3.mp3'],
 // Replace with any cosmic mp3
      html5: true,
      loop: true,
      volume: 0.7

    });

    bgSound.play();
    bgSoundRef.current = bgSound;
    bgSound.once('loaderror', (id, err) => {
  console.error("Cosmic audio failed to load:", err);
});


    // Cleanup on component unmount
    return () => {
      bgSoundRef.current?.stop();
    };
  }, []);

  const handlePointClick = (point) => {
    setSelectedPoint(point);

    // 🔇 Stop any previous lore sound
    if (soundRef.current) {
      soundRef.current.stop();
    }

    // 🔊 Play new sound for selected point
    if (point.sound) {
      const sound = new Howl({
        src: [point.sound],
        html5: true
      });
      soundRef.current = sound;
      sound.play();
    }
  };

  return (
    <div style={{ height: '100vh', width: '100%', position: 'relative' }}>
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="black"
        pointsData={locations}
        pointLat={d => d.lat}
        pointLng={d => d.lng}
        pointAltitude={0.05}
        pointColor={() => "orange"}
        onPointClick={handlePointClick}
      />

      {selectedPoint && (
        <div
          onClick={() => {
            setSelectedPoint(null);
            soundRef.current?.stop(); // Stop lore sound
          }}
          style={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            color: '#111',
            maxWidth: '300px',
            cursor: 'pointer',
            transition: 'opacity 0.3s ease-in-out',
            zIndex: 10
          }}
        >
          <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
            {selectedPoint.name}
          </h3>
          <p style={{ fontSize: '0.95rem', marginTop: '0.5rem' }}>
            {selectedPoint.fact}
          </p>

          {selectedPoint.image && (
            <img
              src={selectedPoint.image}
              alt={selectedPoint.name}
              style={{
                width: '100%',
                borderRadius: '8px',
                marginTop: '1rem',
                objectFit: 'cover',
                maxHeight: '180px'
              }}
            />
          )}

          {selectedPoint.sound && (
            <p style={{ fontSize: '0.75rem', marginTop: '0.5rem', opacity: 0.7 }}>
              Sound playing... 🎧
            </p>
          )}

          <p style={{ fontSize: '0.75rem', marginTop: '0.75rem', opacity: 0.7 }}>
            (Click anywhere to close)
          </p>
        </div>
      )}
    </div>
  );
};

export default GlobeComponent;
