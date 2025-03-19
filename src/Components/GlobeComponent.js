import React, { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';
import * as THREE from 'three';

const GlobeComponent = () => {
    const globeEl = useRef();

    useEffect(() => {
        const globe = globeEl.current;

        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 0.35;

        globe.pointOfView({ altitude: 2 }, 5000);

        // Bulutlar ekleyin
        const CLOUDS_IMG_URL = '/images/clouds.webp';
        const CLOUDS_ALT = 0.004;
        const CLOUDS_ROTATION_SPEED = -0.006;

        new THREE.TextureLoader().load(CLOUDS_IMG_URL, cloudsTexture => {
            const clouds = new THREE.Mesh(
                new THREE.SphereGeometry(globe.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
                new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
            );
            globe.scene().add(clouds);

            (function rotateClouds() {
                clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
                requestAnimationFrame(rotateClouds);
            })();
        });

    }, []);

    return (
        <div style={{ width: '100%', height: '100%' }}> {/* Boyutu HeroSection'a uyumlu yap */}
            <Globe
                ref={globeEl}
                globeImageUrl="/images/earth-blue-marble.webp"
                backgroundImageUrl="/images/night-sky.webp"
            />
        </div>
    );
};

export default GlobeComponent;