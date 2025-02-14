const playPauseButton = document.getElementById('playPauseButton');
const audioFile = document.getElementById('audioFile');
const audio = document.getElementById('myAudio');
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
let audioContext;
let analyser;
let source;

audioFile.addEventListener('change', function(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    audio.src = e.target.result;
    if (!audioContext) {
        setupAudioContext();
      let isPlaying = false; // Keep track of play state

playPauseButton.addEventListener('click', function() {
    if (!audioContext) { // First time setup
        setupAudioContext();
        audio.play(); // Start playing on first click
        isPlaying = true;
        playPauseButton.textContent = "Pause"; // Change button text
    } else {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            playPauseButton.textContent = "Play"; // Change button text
        } else {
            audio.play();
            isPlaying = true;
            playPauseButton.textContent = "Pause"; // Change button text
        }
    }
});
    }
  }
  reader.readAsDataURL(file);
});

function setupAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 2048;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

     audio.play().then(() => {
      drawVisualizer(bufferLength, dataArray);
    }).catch(error => {
        console.error("Error playing audio:", error);
    });;


}

function drawVisualizer(bufferLength, dataArray) {
    requestAnimationFrame(() => drawVisualizer(bufferLength, dataArray));
    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const barWidth = (canvas.width / bufferLength) * 2.5; // Spacing between the bars
    let barHeight;
    let x = 0;

    for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        // Create gradient
        const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
        gradient.addColorStop(0, 'blue');   // Start color
        gradient.addColorStop(1, 'purple'); // End color

        ctx.fillStyle = gradient;
        ctx.fillRect(x, canvas.height - barHeight/2, barWidth, barHeight/2);

        x += barWidth + 1; // Add space between bars
    }

    //Draw horizontal line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
}
