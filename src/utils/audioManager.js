import { Howl, Howler } from 'howler';

/**
 * Robust AudioManager using Howler.js
 * Manages ambient loops and triggered sound effects.
 */

const SOUNDS = {
    // Ambient Music
    ambient: new Howl({
        src: ['https://cdn.pixabay.com/audio/2025/03/13/audio_3482f307a8.mp3'], // Calm piano
        loop: true,
        volume: 0.15,
        html5: true, // Use HTML5 Audio for long tracks
    }),
    
    // SFX
    paper: new Howl({
        src: ['https://cdn.pixabay.com/audio/2021/08/03/audio_2d01f5f5b9.mp3'], // Paper rustle
        volume: 0.5,
    }),
    
    magic: new Howl({
        src: ['https://cdn.pixabay.com/audio/2024/12/20/audio_d3efed8c6c.mp3'], // Shimmering magic
        volume: 0.4,
    }),
    
    scratch: new Howl({
        src: ['https://cdn.pixabay.com/audio/2022/03/10/audio_eb9f1b0a59.mp3'], // Scratching sound
        volume: 0.4,
        loop: true
    }),
    
    whoosh: new Howl({
        src: ['https://cdn.pixabay.com/audio/2025/07/30/audio_b3087a581e.mp3'], // Blow/Whoosh
        volume: 0.6,
    }),
    
    popper: new Howl({
        src: ['https://cdn.pixabay.com/audio/2021/08/04/audio_12b0c7443c.mp3'], // Party popper
        volume: 0.5,
    }),
    
    twinkle: new Howl({
        src: ['https://cdn.pixabay.com/audio/2024/10/12/audio_515090dc3c.mp3'], // Soft chime/star
        volume: 0.3,
    }),
    
    click: new Howl({
        src: ['https://cdn.pixabay.com/audio/2025/08/03/audio_1df12d5efc.mp3'], // Soft bubble pop
        volume: 0.4,
    }),
    
    swipe: new Howl({
        src: ['https://cdn.pixabay.com/audio/2024/10/27/audio_60e0332d6f.mp3'], // Soft whoosh/swipe
        volume: 0.3,
    })
};

const audioManager = {
    play: (key, duration) => {
        if (SOUNDS[key]) {
            // 🔇 Don't play ambient if already playing
            if (key === 'ambient' && SOUNDS[key].playing()) return;

            const id = SOUNDS[key].play();
            
            // 🕒 Limit playback duration
            // Default 2s for paper as requested, or use the provided duration
            const limit = duration || (key === 'paper' ? 2000 : null);
            
            if (limit) {
                setTimeout(() => {
                    if (SOUNDS[key].playing(id)) {
                        SOUNDS[key].fade(SOUNDS[key].volume(), 0, 300, id);
                        setTimeout(() => SOUNDS[key].stop(id), 300);
                    }
                }, limit);
            }
        }
    },
    
    stop: (key) => {
        if (SOUNDS[key]) {
            SOUNDS[key].stop();
        }
    },
    
    fadeOut: (key, duration = 1000) => {
        if (SOUNDS[key]) {
            const sound = SOUNDS[key];
            sound.fade(sound.volume(), 0, duration);
            setTimeout(() => sound.stop(), duration);
        }
    },
    
    setVolume: (key, volume) => {
        if (SOUNDS[key]) {
            SOUNDS[key].volume(volume);
        }
    },

    muteAll: (muted) => {
        Howler.mute(muted);
    },
    
    isMuted: () => Howler._muted
};

export default audioManager;
