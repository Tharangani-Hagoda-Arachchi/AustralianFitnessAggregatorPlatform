import React from 'react'
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const SCANNER_ELEMENT_ID = 'qr-scanner-viewport';

const QrScanner = ({ onScan, active }) => {
    const scannerRef = useRef(null);
    const [cameraError, setCameraError] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        if (!active) return;

        const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
        scannerRef.current = scanner;
        let stopped = false;

        scanner
            .start(
                { facingMode: 'environment' }, // rear camera on phones/tablets at the front desk
                { fps: 10, qrbox: { width: 240, height: 240 } },
                (decodedText) => {
                    if (stopped) return;
                    stopped = true;
                    scanner.pause(true);
                    onScan(decodedText);
                    // Resume scanning shortly after, in case staff need to scan the next member
                    setTimeout(() => {
                        if (scannerRef.current) {
                            scanner.resume();
                            stopped = false;
                        }
                    }, 2000);
                },
                () => {
                    // Per-frame "no QR code found" callback — expected constantly, ignore.
                }
            )
            .then(() => setIsScanning(true))
            .catch((err) => {
                setCameraError(
                    'Could not access the camera. Check permissions, or use manual entry below.'
                );
                console.error('QR scanner start error:', err);
            });

        return () => {
            if (scannerRef.current) {
                scannerRef.current
                    .stop()
                    .then(() => scannerRef.current?.clear())
                    .catch(() => { });
            }
        };
    }, [active, onScan]);

    if (!active) return null;
    return (
        <div>
            <div
                id={SCANNER_ELEMENT_ID}
                className="mx-auto w-full max-w-xs overflow-hidden rounded-xl2 border border-ink/10 bg-black"
            />
            {cameraError && (
                <p className="mt-3 text-center text-sm text-clay-500">{cameraError}</p>
            )}
            {isScanning && !cameraError && (
                <p className="mt-3 text-center text-xs text-ink/50">
                    Point the camera at the member's QR pass.
                </p>
            )}
        </div>
    )
}

export default QrScanner