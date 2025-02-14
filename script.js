const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const audioElement = document.getElementById('audio-element');
const analyser = audioContext.createAnalyser();
const canvas = document.getElementById('visualizer');
const ctx = canvas.getContext('2d');

const audioSource = audioContext.createMediaElementSource(audioElement);
audioSource.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

canvas.width = 400;
canvas.height = 400;

let hue = 0;

function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);

    analyser.getByteFrequencyData(dataArray);

    ctx.fillStyle = 'rgb(0, 0, 0)'; // Black background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150; // Adjust circle size

    ctx.lineWidth = 2; // Adjust line thickness

    hue = (hue + 0.5) % 360; // Rainbow color effect

    for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const angle = (i / bufferLength) * Math.PI * 2; // Full circle
        const lineLength = (value / 255) * radius; // Scale line length

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + lineLength);
        const y2 = centerY + Math.sin(angle) * (radius + lineLength);

        ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`; // Rainbow color
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    }
}

audioElement.addEventListener('play', () => {
    audioContext.resume().then(() => {
        drawVisualizer();
    });
});
