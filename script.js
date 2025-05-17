// PAPERBOY Record Player JavaScript

// DOM Elements
const record = document.getElementById('record');
const tonearm = document.getElementById('tonearm');
const playButton = document.getElementById('play-button');
const prevButton = document.getElementById('prev-button');
const nextButton = document.getElementById('next-button');
const volumeKnob = document.getElementById('volume-knob');
const knobIndicator = document.querySelector('.knob-indicator');
const audioPlayer = document.getElementById('audio-player');
const bassSlider = document.getElementById('bass-slider');
const midSlider = document.getElementById('mid-slider');
const trebleSlider = document.getElementById('treble-slider');
const sliders = document.querySelectorAll('.level-slider');

// State
let isPlaying = false;
let currentVolume = 0.7; // 0 - 1
let knobRotation = calculateKnobRotation(currentVolume);
let currentTrack = 0;
let isDragging = false;
let activeDragElement = null;
let startY = 0;
let startValue = 0;

// Sample tracks
const tracks = [
    {
        title: 'Demo Track',
        artist: 'PAPERBOY',
        url: 'https://cdn.freesound.org/previews/630/630443_1648170-lq.mp3'
    },
    {
        title: 'Lofi Beat',
        artist: 'PAPERBOY',
        url: 'https://cdn.freesound.org/previews/633/633789_7464753-lq.mp3'
    },
    {
        title: 'Ambient Sound',
        artist: 'PAPERBOY',
        url: 'https://cdn.freesound.org/previews/612/612092_5674468-lq.mp3'
    }
];

// Initialize
function init() {
    // Set initial volume
    audioPlayer.volume = currentVolume;
    updateVolumeKnob();
    
    // Add event listeners
    playButton.addEventListener('click', togglePlay);
    prevButton.addEventListener('click', playPrevious);
    nextButton.addEventListener('click', playNext);
    volumeKnob.addEventListener('mousedown', startVolumeChange);
    volumeKnob.addEventListener('touchstart', startVolumeChange, { passive: false });
    
    // Add slider event listeners
    sliders.forEach(slider => {
        const knob = slider.querySelector('.slider-knob');
        knob.addEventListener('mousedown', startSliderDrag);
        knob.addEventListener('touchstart', startSliderDrag, { passive: false });
    });
    
    // Global mouse/touch move and up events
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('touchmove', handleDrag, { passive: false });
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchend', stopDrag);
    
    // Initialize slider values and audio player
    updateSliders();
    loadTrack(currentTrack);
    
    // Add audio event listeners
    audioPlayer.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayState();
        playNext();
    });
}

// Toggle play/pause
function togglePlay() {
    isPlaying = !isPlaying;
    updatePlayState();
    
    if (isPlaying) {
        audioPlayer.play();
    } else {
        audioPlayer.pause();
    }
}

// Update visual play state
function updatePlayState() {
    if (isPlaying) {
        playButton.innerHTML = '<i class="fas fa-pause"></i>';
        record.classList.add('playing');
        tonearm.classList.add('playing');
    } else {
        playButton.innerHTML = '<i class="fas fa-play"></i>';
        record.classList.remove('playing');
        tonearm.classList.remove('playing');
    }
}

// Play previous track
function playPrevious() {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) {
        audioPlayer.play();
    }
}

// Play next track
function playNext() {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) {
        audioPlayer.play();
    }
}

// Load track
function loadTrack(index) {
    const track = tracks[index];
    audioPlayer.src = track.url;
    
    // Update track info display
    document.querySelector('.track-info h2').textContent = `Now Playing: ${track.title}`;
    document.querySelector('.track-info p').textContent = `${track.artist} • Interactive Record Player`;
}

// Volume knob functions
function startVolumeChange(e) {
    e.preventDefault();
    isDragging = true;
    activeDragElement = 'volume';
    
    // Record the start position
    if (e.type === 'mousedown') {
        startY = e.clientY;
    } else if (e.type === 'touchstart') {
        startY = e.touches[0].clientY;
    }
    
    startValue = currentVolume;
}

function calculateKnobRotation(volume) {
    // Map volume (0-1) to rotation (-150 to 150 degrees)
    return -150 + (volume * 300);
}

function updateVolumeKnob() {
    knobIndicator.style.transform = `translateX(-50%) rotate(${knobRotation}deg)`;
}

// Slider drag functions
function startSliderDrag(e) {
    e.preventDefault();
    isDragging = true;
    activeDragElement = e.target;
    
    // Record the start position
    if (e.type === 'mousedown') {
        startY = e.clientY;
    } else if (e.type === 'touchstart') {
        startY = e.touches[0].clientY;
    }
    
    const slider = activeDragElement.parentElement;
    const fill = slider.querySelector('.slider-fill');
    startValue = parseFloat(fill.style.height || 
                 window.getComputedStyle(fill).height) / 100;
}

function handleDrag(e) {
    if (!isDragging) return;
    
    let currentY;
    if (e.type === 'mousemove') {
        currentY = e.clientY;
    } else if (e.type === 'touchmove') {
        e.preventDefault(); // Prevent scrolling
        currentY = e.touches[0].clientY;
    }
    
    const deltaY = (startY - currentY) / 200; // Adjust sensitivity
    
    if (activeDragElement === 'volume') {
        // Update volume
        let newVolume = Math.min(Math.max(startValue + deltaY, 0), 1);
        currentVolume = newVolume;
        audioPlayer.volume = currentVolume;
        
        // Update knob rotation
        knobRotation = calculateKnobRotation(currentVolume);
        updateVolumeKnob();
    } else {
        // Handle slider movement
        const slider = activeDragElement.parentElement;
        const fill = slider.querySelector('.slider-fill');
        
        let newHeight = Math.min(Math.max((startValue + deltaY) * 100, 0), 100);
        fill.style.height = `${newHeight}%`;
        
        // Update knob position
        activeDragElement.style.bottom = `calc(${newHeight}% - 7.5px)`;
        
        // Apply audio effect based on slider (simplified simulation)
        if (slider.id === 'bass-slider') {
            // Simulate bass adjustment - in a real app we would use Web Audio API
            console.log('Bass adjusted to', newHeight);
        } else if (slider.id === 'mid-slider') {
            // Simulate mid adjustment
            console.log('Mid adjusted to', newHeight);
        } else if (slider.id === 'treble-slider') {
            // Simulate treble adjustment
            console.log('Treble adjusted to', newHeight);
        }
    }
}

function stopDrag() {
    isDragging = false;
    activeDragElement = null;
}

// Initialize sliders to their default values
function updateSliders() {
    // Bass slider (60%)
    const bassFill = bassSlider.querySelector('.slider-fill');
    const bassKnob = bassSlider.querySelector('.slider-knob');
    bassFill.style.height = '60%';
    bassKnob.style.bottom = 'calc(60% - 7.5px)';
    
    // Mid slider (40%)
    const midFill = midSlider.querySelector('.slider-fill');
    const midKnob = midSlider.querySelector('.slider-knob');
    midFill.style.height = '40%';
    midKnob.style.bottom = 'calc(40% - 7.5px)';
    
    // Treble slider (80%)
    const trebleFill = trebleSlider.querySelector('.slider-fill');
    const trebleKnob = trebleSlider.querySelector('.slider-knob');
    trebleFill.style.height = '80%';
    trebleKnob.style.bottom = 'calc(80% - 7.5px)';
}

// Create dock light effects
function setupDockLights() {
    const dockButtons = document.querySelectorAll('.dock-button');
    
    // Random blinking effect for dock lights
    setInterval(() => {
        dockButtons.forEach(button => {
            if (Math.random() > 0.7) {
                button.classList.toggle('light-on');
            }
        });
    }, 1000);
}

// Add visual detail to speaker grid
function setupSpeakerGrid() {
    const grid = document.querySelector('.speaker-grid');
    
    // Create dot pattern for speaker
    for (let i = 0; i < 100; i++) {
        const dot = document.createElement('div');
        dot.style.width = '4px';
        dot.style.height = '4px';
        dot.style.backgroundColor = '#222';
        dot.style.borderRadius = '50%';
        dot.style.position = 'absolute';
        
        // Calculate position in grid
        const row = Math.floor(i / 10);
        const col = i % 10;
        
        dot.style.top = `${row * 10 + 7}%`;
        dot.style.left = `${col * 10 + 7}%`;
        
        grid.appendChild(dot);
    }
}

// Run initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupDockLights();
    setupSpeakerGrid();
    
    // Add some initial animations
    setTimeout(() => {
        // Simulate loading the record by moving tonearm
        tonearm.style.transform = 'rotate(-45deg)';
        
        setTimeout(() => {
            // Return to initial position
            tonearm.style.transform = 'rotate(-30deg)';
        }, 1000);
    }, 500);
});
