import React, { useState, useRef, useEffect } from 'react';
import GPXParser from 'gpxparser';

export default function GpxPlayer() {
  const [gpxData, setGpxData] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [intervalMs, setIntervalMs] = useState(500); // Controle do tempo
  const intervalRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const gpxText = event.target.result;
      const parser = new GPXParser();
      parser.parse(gpxText);
      setGpxData(parser.tracks[0]?.segments[0] || []);
      setCurrentIndex(0);
      setPlaying(false);
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (playing && gpxData && currentIndex < gpxData.length) {
      intervalRef.current = setTimeout(() => {
        setCurrentIndex((idx) => idx + 1);
      }, intervalMs);
    } else {
      clearTimeout(intervalRef.current);
    }
    return () => clearTimeout(intervalRef.current);
  }, [playing, currentIndex, gpxData, intervalMs]);

  const togglePlay = () => {
    if (!gpxData) return;
    if (playing) setPlaying(false);
    else if (currentIndex >= gpxData.length) setCurrentIndex(0);
    setPlaying((p) => !p);
  };

  return (
    <div>
      <input type="file" accept=".gpx,text/xml" onChange={handleFileUpload} />
      {gpxData && (
        <div style={{ marginTop: 20 }}>
          <button onClick={togglePlay}>{playing ? 'Pausar' : 'Tocar'}</button>
          <label style={{ marginLeft: 10 }}>
            Velocidade (ms):{' '}
            <input
              type="number"
              value={intervalMs}
              min={100}
              max={2000}
              step={100}
              onChange={(e) => setIntervalMs(Number(e.target.value))}
            />
          </label>
          <div style={{ marginTop: 20 }}>
            <strong>Nota atual:</strong>{' '}
            {gpxData[currentIndex]
              ? JSON.stringify(gpxData[currentIndex])
              : 'Fim da tablatura'}
          </div>
        </div>
      )}
    </div>
  );
}
