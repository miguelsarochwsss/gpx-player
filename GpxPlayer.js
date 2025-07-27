// src/GpxPlayer.js

import React, { useState } from 'react';

function GpxPlayer() {
  const [tempo, setTempo] = useState(1);
  const [points, setPoints] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parser = new DOMParser();
      const xml = parser.parseFromString(text, 'application/xml');
      const trkpts = Array.from(xml.getElementsByTagName('trkpt'));
      const coords = trkpts.map(pt => ({
        lat: pt.getAttribute('lat'),
        lon: pt.getAttribute('lon'),
        ele: pt.getElementsByTagName('ele')[0]?.textContent || null,
      }));
      setPoints(coords);
    };
    reader.readAsText(file);
  };

  const play = () => {
    let i = 0;
    const interval = setInterval(() => {
      if (i >= points.length) return clearInterval(interval);
      console.log(points[i]); // Aqui você pode mostrar no console ou em mapa
      i++;
    }, 1000 / tempo);
  };

  return (
    <div>
      <h1>Leitor de Arquivos GPX</h1>
      <input type="file" accept=".gpx" onChange={handleFile} />
      <div>
        <label>Velocidade:</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={tempo}
          onChange={(e) => setTempo(parseFloat(e.target.value))}
        />
        <span> {tempo}x</span>
      </div>
      <button onClick={play}>▶️ Tocar</button>
    </div>
  );
}

export default GpxPlayer;
