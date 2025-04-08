const display = document.getElementById('display');
const buttonsContainer = document.querySelector('.buttons');

let currentInput = '';
let operator = null;
let firstOperand = null;
let shouldResetDisplay = false;

buttonsContainer.addEventListener('click', (event) => {
    const target = event.target;

    // Ignore clicks if not on a button or if placeholder
    if (!target.matches('button') || target.classList.contains('placeholder')) {
        return;
    }

    const value = target.value;

    // Handle number and decimal input
    if (!isNaN(value) || value === '.') {
        // Prevent multiple decimals
        if (value === '.' && display.value.includes('.')) return;
        // Reset display if starting new number after calculation or operator
        if (shouldResetDisplay) {
            display.value = '';
            shouldResetDisplay = false;
        }
        display.value += value;
    }
    // Handle Clear button
    else if (value === 'C') {
        display.value = '';
        currentInput = '';
        operator = null;
        firstOperand = null;
    }
    // Handle Equals button
    else if (value === '=') {
        if (operator && firstOperand !== null) {
            try {
                // WARNING: eval() is simple but can be insecure if used with untrusted input.
                // For a simple calculator like this, it's often deemed acceptable.
                // A safer approach involves parsing the expression manually.
                const result = eval(firstOperand + operator + display.value);
                display.value = result;
                firstOperand = null; // Reset for next calculation
                operator = null;
                shouldResetDisplay = true; // Ready for new input
            } catch (error) {
                display.value = 'Error';
                shouldResetDisplay = true;
            }
        }
    }
    // Handle Operators (+, -, *, /)
    else if (['+', '-', '*', '/'].includes(value)) {
         // If there's already an operator and first operand, calculate intermediate result
         if (operator && firstOperand !== null && !shouldResetDisplay) {
             try {
                const result = eval(firstOperand + operator + display.value);
                display.value = result;
                firstOperand = result; // Use result as the new first operand
             } catch (error) {
                display.value = 'Error';
                shouldResetDisplay = true;
                return; // Stop further processing on error
             }
         } else {
            firstOperand = display.value;
         }
         operator = value;
         shouldResetDisplay = true; // Next number input should clear the display
    }
});
