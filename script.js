document.addEventListener('DOMContentLoaded', function() {
    display = document.getElementById('display');
    currentTheme = 'light';
    initializeThemes();
    updateSoundIcon('off');
});

let display;
let currentInput = '';
let needReset = false;
let currentTheme = 'light';
let soundIndex = 0;
let isSoundOn = false;

const themes = {
    light: {
        background: 'bg-gradient-to-br from-blue-100 to-white',
        calculator: 'bg-white',
        display: 'bg-gray-100 text-gray-900 drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] text-shadow-[0_2px_2px_rgba(0,0,0,0.1)]',
        buttons: {
            number: 'bg-gradient-to-b from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]',
            operator: 'bg-gradient-to-b from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2)]',
            function: 'bg-gradient-to-b from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-900 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.1)]'
        },
        settingsButton: 'bg-gradient-to-b from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 text-gray-900 shadow-lg',
        soundIndicator: {
            off: 'bg-red-500',
            on: 'bg-blue-500'
        }
    },
    dark: {
        background: 'bg-gradient-to-br from-gray-800 to-gray-900',
        calculator: 'bg-gray-800',
        display: 'bg-gray-700 text-white drop-shadow-[0_2px_2px_rgba(255,255,255,0.1)] text-shadow-[0_2px_2px_rgba(255,255,255,0.1)]',
        buttons: {
            number: 'bg-gradient-to-b from-gray-500 to-gray-600 hover:from-gray-400 hover:to-gray-500 text-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4)]',
            operator: 'bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]',
            function: 'bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4)]'
        },
        settingsButton: 'bg-gradient-to-b from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white shadow-lg',
        soundIndicator: {
            off: 'bg-red-500',
            on: 'bg-orange-500'
        }
    }
};

const sounds = {
    click1: 'sound/click1.wav',
    click2: 'sound/click2.wav',
    click3: 'sound/click3.wav'
};

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme();
}

function toggleSound() {
    soundIndex = (soundIndex + 1) % 4;
    
    if (soundIndex === 0) {
        isSoundOn = false;
        updateSoundIcon('off');
    } else {
        isSoundOn = true;
        const audio = document.getElementById('keySound');
        audio.src = `sound/click${soundIndex}.wav`;
        updateSoundIcon(soundIndex);
        playSound();
    }
}

function updateSoundIcon(status) {
    const soundIndicator = document.getElementById('soundIndicator');
    const soundIcon = document.getElementById('soundIcon');
    const theme = themes[currentTheme];
    
    if (status === 'off') {
        soundIndicator.textContent = 'X';
        soundIndicator.classList.remove(theme.soundIndicator.on);
        soundIndicator.classList.add(theme.soundIndicator.off);
        soundIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        `;
    } else {
        soundIndicator.textContent = status;
        soundIndicator.classList.remove(theme.soundIndicator.off);
        soundIndicator.classList.add(theme.soundIndicator.on);
        soundIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072M17.95 6.05a8 8 0 010 11.9M6.343 9.657a4 4 0 115.657 5.657l-5.657-5.657z" />
        `;
    }
}

function applyTheme() {
    const theme = themes[currentTheme];
    document.body.className = theme.background + ' min-h-screen';
    
    const calculator = document.querySelector('.calculator-container');
    calculator.className = `calculator-container ${theme.calculator} p-8 rounded-3xl shadow-2xl w-full max-w-xl`;
    
    const displayInput = document.getElementById('display');
    displayInput.className = `w-full p-6 text-right text-4xl border-none rounded-2xl ${theme.display} shadow-inner font-bold tracking-wider`;
    
    const numberButtons = document.querySelectorAll('.number-btn');
    const operatorButtons = document.querySelectorAll('.operator-btn');
    const functionButtons = document.querySelectorAll('.function-btn');
    
    numberButtons.forEach(btn => {
        btn.className = `number-btn ${theme.buttons.number} p-6 rounded-2xl shadow-lg active:shadow-inner active:translate-y-0.5 transform hover:translate-y-1 text-2xl font-bold transition-all duration-100`;
    });
    
    operatorButtons.forEach(btn => {
        btn.className = `operator-btn ${theme.buttons.operator} p-6 rounded-2xl shadow-lg active:shadow-inner active:translate-y-0.5 transform hover:translate-y-1 text-2xl font-bold transition-all duration-100`;
    });
    
    functionButtons.forEach(btn => {
        btn.className = `function-btn ${theme.buttons.function} p-6 rounded-2xl shadow-lg active:shadow-inner active:translate-y-0.5 transform hover:translate-y-1 text-2xl font-bold transition-all duration-100`;
    });
    
    const settingsButtons = document.querySelectorAll('.settings-btn');
    settingsButtons.forEach(btn => {
        btn.className = `settings-btn ${theme.settingsButton} p-2 rounded-lg active:shadow-inner active:translate-y-0.5 transform hover:translate-y-1 transition-all duration-100`;
    });
}

function initializeThemes() {
    applyTheme();
}

function appendNumber(num) {
    if (needReset) {
        currentInput = '';
        needReset = false;
    }
    currentInput += num;
    updateDisplay();
}

function appendOperator(operator) {
    if (currentInput !== '' && !needReset) {
        currentInput += operator;
        updateDisplay();
    }
}

function appendDecimal() {
    if (needReset) {
        currentInput = '0';
        needReset = false;
    }
    if (!currentInput.includes(',')) {
        currentInput += ',';
        updateDisplay();
    }
}

function appendNegative() {
    if (needReset) {
        currentInput = '';
        needReset = false;
    }
    if (currentInput.startsWith('-')) {
        currentInput = currentInput.substring(1);
    } else {
        currentInput = '-' + currentInput;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '';
    updateDisplay();
}

function deleteLastChar() {
    currentInput = currentInput.slice(0, -1);
    updateDisplay();
}

function calculate() {
    try {
        let expression = currentInput.replace(/,/g, '.').replace(/%/g, '/100');
        let result = eval(expression);
        currentInput = parseFloat(result.toFixed(8)).toString().replace('.', ',');
        needReset = true;
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        needReset = true;
        updateDisplay();
    }
}

function updateDisplay() {
    if (display) {
        const formattedInput = currentInput.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        display.value = formattedInput;
    }
}

function playSound() {
    if (isSoundOn) {
        const sound = document.getElementById('keySound');
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.log('Error playing sound:', error);
        });
    }
}