document.addEventListener('DOMContentLoaded', () => {
    // Audio Elements
    const clickSound = document.getElementById('click-sound');
    const successSound = document.getElementById('success-sound');

    // Make audio softer
    if (clickSound) clickSound.volume = 0.5;
    if (successSound) successSound.volume = 0.6;

    function playSound(audioEl) {
        if (audioEl) {
            audioEl.currentTime = 0;
            audioEl.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    // Screens
    const mainScreen = document.getElementById('main-screen');
    const persuasionScreen = document.getElementById('persuasion-screen');
    const successScreen = document.getElementById('success-screen');

    // Buttons
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    
    // Persuasion Elements
    const btnNext = document.getElementById('btn-next');
    const persuasionText = document.getElementById('persuasion-text');
    const stickerEl = document.querySelector('#sticker-container .sticker');
    const stickerContainer = document.getElementById('sticker-container');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    // Final Choice
    const btnFinalYes = document.getElementById('btn-final-yes');
    const btnFinalNo = document.getElementById('btn-final-no');
    const persuasionButtons = document.getElementById('persuasion-buttons');
    const finalChoiceButtons = document.getElementById('final-choice-buttons');

    // Reset Elements
    const btnReadAgain = document.getElementById('btn-read-again');

    // State
    const persuasionSteps = [
        { emoji: '🥺', text: "Are you sureee? 🥺" },
        { emoji: '🤔', text: "Think again 💕" },
        { emoji: '😤', text: "System doesn’t accept ‘No’ 😤" },
        { emoji: '😒', text: "You might regret this 😌❤️" },
        { emoji: '🐾', text: "Don't break my heart 💔" },
        { emoji: '🐰', text: "Pretty please? With a cherry on top? 🍒" },
        { emoji: '😡', text: "Okay, now I'm getting mad... just kidding 🤭" },
        { emoji: '💖', text: "Just click YES already! You know you want to 😚" }
    ];
    let currentStep = 0;
    
    // Functions to switch screens
    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            setTimeout(() => { if (!s.classList.contains('active')) s.classList.add('hidden'); }, 500);
        });
        
        screen.classList.remove('hidden');
        // Force reflow
        void screen.offsetWidth;
        screen.classList.add('active');
    }

    function createHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerText = ['💖', '💕', '💘', '💗', '💓'][Math.floor(Math.random() * 5)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 4 + 's';
        heart.style.fontSize = Math.random() * 1.5 + 1 + 'rem';
        
        document.getElementById('hearts-container').appendChild(heart);
        
        setTimeout(() => {
            heart.remove();
        }, 7000);
    }

    let bgHeartsInterval;
    function startBgHearts() {
        if (!bgHeartsInterval) {
            bgHeartsInterval = setInterval(createHeart, 800);
        }
    }

    function stopBgHearts() {
        if (bgHeartsInterval) {
            clearInterval(bgHeartsInterval);
            bgHeartsInterval = null;
        }
    }

    function triggerSuccessHearts() {
        for(let i=0; i<30; i++) {
            setTimeout(createHeart, i * 100);
        }
        setInterval(createHeart, 300);
    }

    // Event Listeners
    startBgHearts();

    btnYes.addEventListener('click', () => {
        playSound(clickSound);
        handleYes();
    });

    btnNo.addEventListener('click', () => {
        playSound(clickSound);
        startPersuasion();
    });

    function handleYes() {
        showScreen(successScreen);
        stopBgHearts();
        triggerSuccessHearts();
        playSound(successSound);
    }

    function startPersuasion() {
        currentStep = 0;
        updatePersuasionUI();
        showScreen(persuasionScreen);
        persuasionButtons.classList.remove('hidden');
        finalChoiceButtons.classList.add('hidden');
        resetEscapeButton();
    }

    function resetEscapeButton() {
        btnFinalNo.style.position = 'static';
        btnFinalNo.style.transform = 'none';
        btnFinalNo.style.transition = 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
    }

    btnNext.addEventListener('click', () => {
        playSound(clickSound);
        currentStep++;
        
        // Re-trigger animation
        stickerContainer.classList.remove('sticker-anim');
        void stickerContainer.offsetWidth; // trigger reflow
        stickerContainer.classList.add('sticker-anim');

        if (currentStep < persuasionSteps.length) {
            updatePersuasionUI();
        } else {
            // Reached the end of persuasion
            stickerEl.innerText = "👀";
            persuasionText.innerText = "So... what's your final answer? 💖";
            progressFill.style.width = '100%';
            progressText.innerText = '100%';
            
            persuasionButtons.classList.add('hidden');
            finalChoiceButtons.classList.remove('hidden');
        }
    });

    function updatePersuasionUI() {
        const step = persuasionSteps[currentStep];
        stickerEl.innerText = step.emoji;
        persuasionText.innerText = step.text;
        
        const progressPercentage = Math.floor(((currentStep + 1) / persuasionSteps.length) * 90) + 10;
        progressFill.style.width = `${progressPercentage}%`;
        progressText.innerText = `${progressPercentage}%`;
    }

    btnFinalYes.addEventListener('click', () => {
        playSound(clickSound);
        handleYes();
    });

    // Make NO button runaway randomly on screen
    function moveButtonRandomly(btn) {
        const padding = 20;
        // Calculate bounded random position on the screen
        const maxX = window.innerWidth - btn.clientWidth - (padding * 2);
        const maxY = window.innerHeight - btn.clientHeight - (padding * 2);
        
        const x = Math.max(padding, Math.random() * maxX);
        const y = Math.max(padding, Math.random() * maxY);
        
        btn.style.left = `${x}px`;
        btn.style.top = `${y}px`;
        btn.style.transform = 'none'; // remove hover effect transforms
    }

    btnFinalNo.addEventListener('click', function(e) {
        playSound(clickSound);
        // Playful escape jump
        stickerEl.innerText = "😭";
        persuasionText.innerText = "You clicked it again?! Try catching it now! 🏃💨";
        
        const btn = this;
        btn.style.position = 'fixed';
        btn.style.transition = 'all 0.2s ease-out';
        btn.style.zIndex = '100';
        moveButtonRandomly(btn);
    });

    btnFinalNo.addEventListener('mouseover', function(e) {
        if(this.style.position === 'fixed') {
            moveButtonRandomly(this);
        }
    });

    btnReadAgain.addEventListener('click', () => {
        playSound(clickSound);
        // Soft reset
        showScreen(mainScreen);
        stopBgHearts();
        startBgHearts();
        
        // Ensure NO button reset if they played persuasion game again
        resetEscapeButton();
    });
});
