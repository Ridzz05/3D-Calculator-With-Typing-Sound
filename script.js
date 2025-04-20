document.addEventListener('DOMContentLoaded', function() {
    display = document.getElementById('display');
    calculationDisplay = document.getElementById('calculation-display');
    currentTheme = 'dark'; // Start with dark theme
    initializeThemes();
    updateSoundIcon('off');
    display.value = "0";
    
    // Add keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
    
    // Handle touch events to prevent default behaviors on mobile
    document.addEventListener('touchstart', function(e) {
        if (e.target.classList.contains('calc-btn')) {
            e.preventDefault();
        }
    }, { passive: false });
});

let display;
let calculationDisplay;
let currentInput = '';
let currentCalculation = '';
let needReset = false;
let currentTheme = 'dark';
let soundIndex = 0;
let isSoundOn = false;

const themes = {
    light: {
        background: 'bg-gradient-to-br from-blue-100 to-white',
        calculator: 'bg-white/90 backdrop-blur-lg',
        display: 'bg-gray-100/90 text-gray-900',
        displaySecondary: 'text-gray-500',
        buttons: {
            number: 'bg-gray-100/90 hover:bg-gray-200/90 active:bg-gray-300/90 text-gray-800',
            operator: 'bg-blue-400/90 hover:bg-blue-500/90 active:bg-blue-600/90 text-white',
            function: 'bg-gray-200/90 hover:bg-gray-300/90 active:bg-gray-400/90 text-gray-800',
            equal: 'bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 active:from-blue-600 active:to-blue-700 text-white'
        },
        settingsButton: 'bg-gray-200/30 hover:bg-gray-300/30 backdrop-blur-md text-gray-800',
        soundIndicator: {
            off: 'bg-red-500',
            on: 'bg-blue-500'
        }
    },
    dark: {
        background: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800',
        calculator: 'bg-white/10 backdrop-blur-lg',
        display: 'bg-white/20 text-white backdrop-blur-md',
        displaySecondary: 'text-gray-400',
        buttons: {
            number: 'bg-white/20 hover:bg-white/30 active:bg-white/40 text-white',
            operator: 'bg-teal-500/90 hover:bg-teal-600/90 active:bg-teal-700/90 text-white',
            function: {
                clear: 'bg-red-500/90 hover:bg-red-600/90 active:bg-red-700/90 text-white',
                delete: 'bg-amber-500/90 hover:bg-amber-600/90 active:bg-amber-700/90 text-white',
                percent: 'bg-indigo-500/90 hover:bg-indigo-600/90 active:bg-indigo-700/90 text-white'
            },
            equal: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:from-emerald-700 active:to-teal-700 text-white'
        },
        settingsButton: 'bg-white/20 hover:bg-white/30 backdrop-blur-md text-white',
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
    playSound();
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
    document.body.className = theme.background + ' min-h-screen flex items-center justify-center p-2 sm:p-4';
    
    const calculator = document.querySelector('.calculator-container');
    calculator.className = `calculator-container ${theme.calculator} p-4 sm:p-6 rounded-3xl mx-auto`;
    
    const displayContainer = calculator.querySelector('.mb-4, .mb-6').firstElementChild;
    displayContainer.className = `${theme.display} rounded-2xl p-3 sm:p-4`;
    
    const calculationDisplayEl = document.getElementById('calculation-display');
    calculationDisplayEl.className = `text-right ${theme.displaySecondary} text-sm mb-1 min-h-5`;
    
    const displayInput = document.getElementById('display');
    displayInput.className = `w-full text-right text-3xl sm:text-4xl bg-transparent border-none outline-none ${currentTheme === 'dark' ? 'text-white' : 'text-gray-900'} font-semibold`;
    
    const settingsButtons = document.querySelectorAll('.settings-btn');
    settingsButtons.forEach(btn => {
        btn.className = `settings-btn ${theme.settingsButton} p-2 sm:p-3 rounded-full transition-all duration-300 relative`;
    });
    
    // Update buttons based on theme
    const numberButtons = document.querySelectorAll('.number-btn');
    const operatorButtons = document.querySelectorAll('.operator-btn');
    const functionButtons = document.querySelectorAll('.function-btn');
    
    numberButtons.forEach(btn => {
        btn.className = `number-btn calc-btn ${theme.buttons.number} p-4 sm:p-5 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-semibold`;
    });
    
    operatorButtons.forEach(btn => {
        btn.className = `operator-btn calc-btn ${theme.buttons.operator} p-4 sm:p-5 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-semibold`;
    });
    
    // Special treatment for equals button
    const equalsButton = document.querySelector('.operator-btn:last-child');
    if (equalsButton) {
        equalsButton.className = `operator-btn calc-btn ${theme.buttons.equal} p-4 sm:p-5 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-semibold`;
    }
    
    // Apply special colors to function buttons in dark theme
    if (currentTheme === 'dark') {
        const clearButton = functionButtons[0];
        const deleteButton = functionButtons[1];
        const percentButton = functionButtons[2];
        
        if (clearButton) {
            clearButton.className = `function-btn calc-btn ${theme.buttons.function.clear} p-4 sm:p-5 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-semibold`;
        }
        
        if (deleteButton) {
            deleteButton.className = `function-btn calc-btn ${theme.buttons.function.delete} p-4 sm:p-5 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-semibold`;
        }
        
        if (percentButton) {
            percentButton.className = `function-btn calc-btn ${theme.buttons.function.percent} p-4 sm:p-5 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-semibold`;
        }
    } else {
        functionButtons.forEach(btn => {
            btn.className = `function-btn calc-btn ${theme.buttons.function} p-4 sm:p-5 rounded-xl sm:rounded-2xl text-lg sm:text-xl font-semibold`;
        });
    }
    
    // Update sound indicator after theme change
    if (isSoundOn) {
        updateSoundIcon(soundIndex);
    } else {
        updateSoundIcon('off');
    }
}

function initializeThemes() {
    applyTheme();
}

function appendNumber(num) {
    if (needReset) {
        currentInput = '';
        needReset = false;
    }
    
    // Replace 0 if it's the only digit
    if (currentInput === '0') {
        currentInput = num;
    } else {
        currentInput += num;
    }
    
    updateDisplay();
}

function appendOperator(operator) {
    // If there's no input yet, use 0 as the first operand for percentage
    if (currentInput === '' && operator === '%') {
        currentInput = '0';
    }
    
    if (currentInput !== '' && !needReset) {
        // If the last character is an operator, replace it
        const lastChar = currentInput.slice(-1);
        if (['+', '-', '*', '/', '%'].includes(lastChar)) {
            currentInput = currentInput.slice(0, -1) + operator;
        } else {
            currentInput += operator;
        }
        
        // Update calculation display
        currentCalculation = currentInput;
        updateDisplay();
    } else if (needReset && operator !== '%') {
        // Continue calculation with result
        needReset = false;
        currentInput += operator;
        // Update calculation display
        currentCalculation = currentInput;
        updateDisplay();
    }
}

function appendDecimal() {
    if (needReset) {
        currentInput = '0';
        needReset = false;
    }
    
    // Find the last number in the expression
    const parts = currentInput.split(/[\+\-\*\/]/);
    const lastPart = parts[parts.length - 1];
    
    // Only add decimal if the last number doesn't already have one
    if (!lastPart.includes('.')) {
        // If current input is empty or ends with an operator, add "0." instead of just "."
        if (currentInput === '' || /[\+\-\*\/]$/.test(currentInput)) {
            currentInput += '0.';
        } else {
            currentInput += '.';
        }
        updateDisplay();
    }
}

function appendNegative() {
    if (needReset) {
        currentInput = '0';
        needReset = false;
    }
    
    if (currentInput === '0' || currentInput === '') {
        currentInput = '-';
    } else {
        // Analyze the expression to handle negation correctly
        const lastOperatorIndex = Math.max(
            currentInput.lastIndexOf('+'), 
            currentInput.lastIndexOf('-'), 
            currentInput.lastIndexOf('*'), 
            currentInput.lastIndexOf('/')
        );
        
        if (lastOperatorIndex === -1) {
            // No operators, negate the whole expression
            currentInput = currentInput.startsWith('-') ? currentInput.substring(1) : '-' + currentInput;
        } else {
            // Check what comes after the last operator
            const lastPart = currentInput.substring(lastOperatorIndex + 1);
            if (lastPart === '') {
                // Operator is at the end, ignore or add zero
                currentInput += '0';
            } else if (lastPart.startsWith('-')) {
                // Remove the negative sign
                currentInput = currentInput.substring(0, lastOperatorIndex + 1) + lastPart.substring(1);
            } else {
                // Add negative sign to the last part
                currentInput = currentInput.substring(0, lastOperatorIndex + 1) + '-' + lastPart;
            }
        }
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    currentCalculation = '';
    updateDisplay();
}

function deleteLastChar() {
    if (currentInput.length > 0 && !needReset) {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === '') {
            currentInput = '0';
        }
    } else if (needReset) {
        currentInput = '0';
        needReset = false;
    }
    updateDisplay();
}

function calculate() {
    if (currentInput === '') return;
    
    try {
        // Save the calculation for display
        currentCalculation = currentInput + '=';
        
        // Replace percentage symbol with division by 100
        let expression = currentInput.replace(/%/g, '/100');
        
        let result = eval(expression);
        
        // Format the result to avoid floating point precision issues
        if (Number.isFinite(result)) {
            if (Number.isInteger(result)) {
                currentInput = result.toString();
            } else {
                // Limit decimal places for readability
                currentInput = parseFloat(result.toFixed(8)).toString();
                // Remove trailing zeros
                currentInput = currentInput.replace(/\.0+$|(\.\d*[1-9])0+$/, '$1');
            }
        } else {
            currentInput = 'Error';
        }
        
        needReset = true;
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        currentCalculation = '';
        needReset = true;
        updateDisplay();
    }
}

function updateDisplay() {
    if (display) {
        // Format the number with thousands separators
        let formattedInput = currentInput;
        
        // Only apply number formatting if it's not an error message and doesn't contain operators
        if (currentInput !== 'Error' && !(/[\+\-\*\/\%]/.test(currentInput))) {
            // Format number with thousands separators
            formattedInput = formatNumber(currentInput);
        }
        
        display.value = formattedInput || '0';
        
        // Update the calculation display
        if (calculationDisplay) {
            calculationDisplay.textContent = currentCalculation;
        }
    }
}

function formatNumber(numStr) {
    // Handle a possible minus sign at the beginning
    const isNegative = numStr.startsWith('-');
    if (isNegative) {
        numStr = numStr.substring(1);
    }
    
    // Split the number into integer and decimal parts
    const parts = numStr.split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    
    // Add thousands separators to the integer part
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Reassemble the number with proper formatting
    return (isNegative ? '-' : '') + integerPart + decimalPart;
}

function playSound() {
    if (isSoundOn) {
        const sound = document.getElementById('keySound');
        
        // Check if the file exists by making a HEAD request
        const testRequest = new XMLHttpRequest();
        testRequest.open('HEAD', sound.src, false);
        try {
            testRequest.send();
            if (testRequest.status >= 200 && testRequest.status < 300) {
                // File exists, play the sound
                sound.currentTime = 0;
                sound.play().catch(error => {
                    console.log('Error playing sound:', error);
                });
            } else {
                console.log('Sound file not found:', sound.src);
                // Temporarily disable sound until files are available
                isSoundOn = false;
                updateSoundIcon('off');
            }
        } catch (error) {
            console.log('Error checking sound file:', error);
        }
    }
}

// Keyboard support function
function handleKeyboardInput(e) {
    playSound();
    
    // Numbers
    if (/^[0-9]$/.test(e.key)) {
        appendNumber(e.key);
    }
    // Operators
    else if (e.key === '+') {
        appendOperator('+');
    }
    else if (e.key === '-') {
        appendOperator('-');
    }
    else if (e.key === '*') {
        appendOperator('*');
    }
    else if (e.key === '/') {
        appendOperator('/');
    }
    else if (e.key === '%') {
        appendOperator('%');
    }
    // Decimal
    else if (e.key === '.' || e.key === ',') {
        appendDecimal();
    }
    // Equal or Enter
    else if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault();
        calculate();
    }
    // Backspace
    else if (e.key === 'Backspace') {
        deleteLastChar();
    }
    // Clear with Escape
    else if (e.key === 'Escape' || e.key === 'Delete') {
        clearDisplay();
    }
}
