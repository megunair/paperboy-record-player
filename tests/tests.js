// tests.js - Unit tests for PAPERBOY Record Player

/**
 * @jest-environment jsdom
 */

// Mock setup for audio player
beforeEach(() => {
  // Set up document body with necessary HTML structure
  document.body.innerHTML = `
    <div class="container">
      <div class="record-player">
        <div class="speaker-panel">
          <div class="level-controls">
            <div class="slider-container">
              <div class="level-slider" id="bass-slider">
                <div class="slider-fill"></div>
                <div class="slider-knob"></div>
              </div>
              <div class="level-slider" id="mid-slider">
                <div class="slider-fill"></div>
                <div class="slider-knob"></div>
              </div>
              <div class="level-slider" id="treble-slider">
                <div class="slider-fill"></div>
                <div class="slider-knob"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="turntable">
          <div class="record" id="record"></div>
          <div class="tonearm" id="tonearm"></div>
          <div class="player-controls">
            <div class="volume-knob" id="volume-knob">
              <div class="knob-indicator"></div>
            </div>
            <div class="media-buttons">
              <button class="media-button" id="prev-button">
                <i class="fas fa-backward"></i>
              </button>
              <button class="media-button" id="play-button">
                <i class="fas fa-play"></i>
              </button>
              <button class="media-button" id="next-button">
                <i class="fas fa-forward"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <audio id="audio-player" src="demo.mp3"></audio>
      <div class="track-info">
        <h2>Now Playing: Demo Track</h2>
        <p>PAPERBOY • Interactive Record Player</p>
      </div>
    </div>
  `;

  // Mock Audio API
  window.HTMLMediaElement.prototype.play = jest.fn();
  window.HTMLMediaElement.prototype.pause = jest.fn();
  
  // Load the script
  require('./script.js');
});

// Test suite for core playback functionality
describe('Core Playback Functionality', () => {
  test('Play button toggles play state', () => {
    const playButton = document.getElementById('play-button');
    const record = document.getElementById('record');
    const tonearm = document.getElementById('tonearm');
    
    // Initial state
    expect(record.classList.contains('playing')).toBe(false);
    expect(tonearm.classList.contains('playing')).toBe(false);
    
    // Click play
    playButton.click();
    
    // Check if state changes to playing
    expect(record.classList.contains('playing')).toBe(true);
    expect(tonearm.classList.contains('playing')).toBe(true);
    expect(playButton.innerHTML).toContain('fa-pause');
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    
    // Click again to pause
    playButton.click();
    
    // Check if state changes back to paused
    expect(record.classList.contains('playing')).toBe(false);
    expect(tonearm.classList.contains('playing')).toBe(false);
    expect(playButton.innerHTML).toContain('fa-play');
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });
  
  test('Previous button loads the previous track', () => {
    const prevButton = document.getElementById('prev-button');
    const audioPlayer = document.getElementById('audio-player');
    
    // Get initial track source
    const initialSrc = audioPlayer.src;
    
    // Click previous
    prevButton.click();
    
    // Check if source changed (moving to previous track)
    expect(audioPlayer.src).not.toBe(initialSrc);
  });
  
  test('Next button loads the next track', () => {
    const nextButton = document.getElementById('next-button');
    const audioPlayer = document.getElementById('audio-player');
    
    // Get initial track source
    const initialSrc = audioPlayer.src;
    
    // Click next
    nextButton.click();
    
    // Check if source changed (moving to next track)
    expect(audioPlayer.src).not.toBe(initialSrc);
  });
});

// Test suite for visual feedback
describe('Visual Feedback', () => {
  test('Record spins when playing', () => {
    const playButton = document.getElementById('play-button');
    const record = document.getElementById('record');
    
    // Before playing
    expect(getComputedStyle(record).animationName).toBeFalsy();
    
    // Start playing
    playButton.click();
    
    // Check if animation is active
    expect(record.classList.contains('playing')).toBe(true);
    
    // Stop playing
    playButton.click();
    
    // Check if animation stopped
    expect(record.classList.contains('playing')).toBe(false);
  });
  
  test('Tonearm moves to position when playing', () => {
    const playButton = document.getElementById('play-button');
    const tonearm = document.getElementById('tonearm');
    
    // Initial tonearm position
    expect(tonearm.classList.contains('playing')).toBe(false);
    
    // Start playing
    playButton.click();
    
    // Check if tonearm moved
    expect(tonearm.classList.contains('playing')).toBe(true);
    
    // Stop playing
    playButton.click();
    
    // Check if tonearm returned
    expect(tonearm.classList.contains('playing')).toBe(false);
  });
});

// Test suite for track management
describe('Track Management', () => {
  test('Track info updates when changing tracks', () => {
    const nextButton = document.getElementById('next-button');
    const trackTitle = document.querySelector('.track-info h2');
    const initialTitle = trackTitle.textContent;
    
    // Change track
    nextButton.click();
    
    // Check if track info updated
    expect(trackTitle.textContent).not.toBe(initialTitle);
  });
  
  test('Cycles through tracks correctly', () => {
    const nextButton = document.getElementById('next-button');
    const audioPlayer = document.getElementById('audio-player');
    
    // Record initial state
    const initialSrc = audioPlayer.src;
    
    // Click through all tracks to cycle back to the first one
    nextButton.click(); // track 2
    nextButton.click(); // track 3
    nextButton.click(); // should cycle back to track 1
    
    // We should be back at the first track
    expect(audioPlayer.src).toBe(initialSrc);
  });
});

// Test suite for User Controls
describe('User Controls - Volume', () => {
  test('Volume knob updates audio volume', () => {
    const volumeKnob = document.getElementById('volume-knob');
    const audioPlayer = document.getElementById('audio-player');
    const initialVolume = audioPlayer.volume;
    
    // Simulate dragging volume knob down (reducing volume)
    const mousedownEvent = new MouseEvent('mousedown', {
      clientY: 100,
      bubbles: true
    });
    
    const mousemoveEvent = new MouseEvent('mousemove', {
      clientY: 150, // Move down to reduce volume
      bubbles: true
    });
    
    const mouseupEvent = new MouseEvent('mouseup', {
      bubbles: true
    });
    
    volumeKnob.dispatchEvent(mousedownEvent);
    document.dispatchEvent(mousemoveEvent);
    document.dispatchEvent(mouseupEvent);
    
    // Volume should have decreased
    expect(audioPlayer.volume).toBeLessThan(initialVolume);
  });
});

// Test suite for Accessibility
describe('Accessibility', () => {
  test('Play button can be triggered with keyboard', () => {
    const playButton = document.getElementById('play-button');
    
    // Simulate keyboard enter press
    const keyEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      bubbles: true
    });
    
    playButton.focus();
    playButton.dispatchEvent(keyEvent);
    
    // Check if play state changed
    expect(document.getElementById('record').classList.contains('playing')).toBe(true);
  });
  
  test('Controls have appropriate tab index for keyboard navigation', () => {
    const controls = document.querySelectorAll('.media-button');
    
    // Check if all controls can be tabbed to
    controls.forEach(control => {
      expect(control.tabIndex).not.toBe(-1);
    });
  });
});

// Test suite for Responsive Design
describe('Responsive Design', () => {
  test('UI adapts to smaller viewport sizes', () => {
    // Mock a mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500
    });
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    
    const recordPlayer = document.querySelector('.record-player');
    const style = window.getComputedStyle(recordPlayer);
    
    // Check if layout has changed to mobile version
    expect(style.flexDirection).toBe('column');
  });
});

// Test suite for User Experience
describe('User Experience Tests', () => {
  test('Record player provides feedback when track changes', () => {
    const nextButton = document.getElementById('next-button');
    const trackInfo = document.querySelector('.track-info');
    
    const initialText = trackInfo.textContent;
    nextButton.click();
    
    expect(trackInfo.textContent).not.toBe(initialText);
  });
  
  test('Equalizer sliders adjust and maintain their positions', () => {
    const bassSlider = document.getElementById('bass-slider');
    const bassKnob = bassSlider.querySelector('.slider-knob');
    const bassFill = bassSlider.querySelector('.slider-fill');
    
    // Initial position
    const initialHeight = bassFill.style.height;
    
    // Simulate dragging
    const mousedownEvent = new MouseEvent('mousedown', {
      clientY: 100,
      bubbles: true
    });
    
    const mousemoveEvent = new MouseEvent('mousemove', {
      clientY: 50, // Move up to increase value
      bubbles: true
    });
    
    const mouseupEvent = new MouseEvent('mouseup', {
      bubbles: true
    });
    
    bassKnob.dispatchEvent(mousedownEvent);
    document.dispatchEvent(mousemoveEvent);
    document.dispatchEvent(mouseupEvent);
    
    // Value should have changed
    expect(bassFill.style.height).not.toBe(initialHeight);
  });
});

// Test suite for Error States and Edge Cases
describe('Error States and Edge Cases', () => {
  test('Player handles unavailable audio sources gracefully', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playButton = document.getElementById('play-button');
    
    // Simulate a bad audio source
    audioPlayer.src = 'nonexistent-file.mp3';
    
    // Try to play
    playButton.click();
    
    // Trigger error event
    const errorEvent = new ErrorEvent('error');
    audioPlayer.dispatchEvent(errorEvent);
    
    // UI shouldn't crash and should stay in a consistent state
    expect(document.body.contains(playButton)).toBe(true);
  });
  
  test('Player returns to initial state after track ends', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playButton = document.getElementById('play-button');
    
    // Start playing
    playButton.click();
    
    // Simulate track ending
    const endedEvent = new Event('ended');
    audioPlayer.dispatchEvent(endedEvent);
    
    // Check if player moved to next track and is ready to play
    expect(document.getElementById('play-button').innerHTML).toContain('fa-play');
  });
});
