import { useEffect, useRef, useState } from 'react'

const BARCODE_FORMATS = [
    'aztec', 'code_128', 'code_39', 'code_93', 'codabar',
    'data_matrix', 'ean_13', 'ean_8', 'itf', 'pdf417',
    'qr_code', 'upc_a', 'upc_e',
]

export default function BarcodeScanner({ open, title = 'Scan Barcode', helper, onClose, onDetected }) {
    const videoRef = useRef(null)
    const streamRef = useRef(null)
    const rafRef = useRef(null)
    const detectedRef = useRef(false)
    const onDetectedRef = useRef(onDetected)
    const [error, setError] = useState('')
    const [manualCode, setManualCode] = useState('')

    useEffect(() => {
        onDetectedRef.current = onDetected
    }, [onDetected])

    useEffect(() => {
        if (!open) return undefined

        let cancelled = false
        detectedRef.current = false
        setError('')
        setManualCode('')

        const stopScanner = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            rafRef.current = null
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop())
                streamRef.current = null
            }
        }

        const startScanner = async () => {
            if (!('BarcodeDetector' in window)) {
                setError('Camera barcode scanning is not supported by this browser yet. You can still enter the barcode manually below.')
                return
            }

            if (!navigator.mediaDevices?.getUserMedia) {
                setError('Camera access is not available in this browser. Enter the barcode manually below.')
                return
            }

            try {
                const supportedFormats = await window.BarcodeDetector.getSupportedFormats?.()
                const usableFormats = supportedFormats?.filter(format => BARCODE_FORMATS.includes(format)) || []
                const detector = usableFormats.length
                    ? new window.BarcodeDetector({ formats: usableFormats })
                    : new window.BarcodeDetector()
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { ideal: 'environment' } },
                    audio: false,
                })

                if (cancelled) {
                    stream.getTracks().forEach(track => track.stop())
                    return
                }

                streamRef.current = stream
                if (videoRef.current) {
                    videoRef.current.srcObject = stream
                    await videoRef.current.play()
                }

                const scanFrame = async () => {
                    if (cancelled || detectedRef.current || !videoRef.current) return

                    if (videoRef.current.readyState >= 2) {
                        try {
                            const codes = await detector.detect(videoRef.current)
                            const barcode = codes.find(code => code.rawValue)?.rawValue
                            if (barcode) {
                                detectedRef.current = true
                                stopScanner()
                                onDetectedRef.current(barcode.trim())
                                return
                            }
                        } catch (scanError) {
                            setError('Could not read the barcode clearly. Align it inside the frame or enter it manually.')
                        }
                    }

                    rafRef.current = requestAnimationFrame(scanFrame)
                }

                rafRef.current = requestAnimationFrame(scanFrame)
            } catch (cameraError) {
                setError('Camera permission was blocked or no camera was found. Enter the barcode manually below.')
            }
        }

        startScanner()

        return () => {
            cancelled = true
            stopScanner()
        }
    }, [open])

    if (!open) return null

    const submitManualCode = () => {
        const code = manualCode.trim()
        if (code) onDetectedRef.current(code)
    }

    return (
        <div className="barcode-scanner-backdrop" role="dialog" aria-modal="true" aria-labelledby="barcode-scanner-title">
            <div className="barcode-scanner-card">
                <div className="barcode-scanner-header">
                    <div>
                        <h3 id="barcode-scanner-title">{title}</h3>
                        <p>{helper || 'Point your phone camera at the barcode.'}</p>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close barcode scanner">✕</button>
                </div>

                <div className="barcode-video-shell">
                    <video ref={videoRef} muted playsInline autoPlay />
                    <div className="barcode-scan-frame">
                        <span />
                        <span />
                        <span />
                        <span />
                    </div>
                    <div className="barcode-scan-line" />
                </div>

                {error && <div className="barcode-scanner-error">⚠️ {error}</div>}

                <div className="barcode-manual-entry">
                    <label htmlFor="manual-barcode">Manual barcode entry</label>
                    <div>
                        <input
                            id="manual-barcode"
                            type="text"
                            value={manualCode}
                            onChange={event => setManualCode(event.target.value)}
                            onKeyDown={event => event.key === 'Enter' && submitManualCode()}
                            placeholder="Type or paste barcode number"
                        />
                        <button type="button" onClick={submitManualCode}>Use Code</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
