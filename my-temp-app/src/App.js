import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FloatingWords from './pages/FloatingWords';
import KoiPond from './pages/KoiPond';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<FloatingWords />} />
                <Route path="/koi-pond" element={<KoiPond />} />
            </Routes>
        </Router>
    );
}

export default App;