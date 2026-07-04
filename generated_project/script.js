/**
 * Calculator class handling logic and UI updates for the web calculator.
 * It maintains the current input string, the previous numeric value, the selected operator,
 * and a reference to the display element where results are shown.
 */
class Calculator {
    /**
     * @param {HTMLElement} displayElement - The element used to show the calculator output.
     */
    constructor(displayElement) {
        this.displayElement = displayElement;
        this.currentInput = '';
        this.previousValue = 0;
        this.operator = null; // 'add' | 'subtract' | 'multiply' | 'divide' | null
        this.updateDisplay();
    }

    /** Append a digit or decimal point to the current input. */
    /** @param {string} digit */
    appendDigit(digit) {
        if (digit === '.') {
            // Prevent multiple decimals in the same number
            if (this.currentInput.includes('.')) return;
            // If the input is empty, start with "0."
            if (this.currentInput === '') {
                this.currentInput = '0.';
                this.updateDisplay();
                return;
            }
        }
        this.currentInput += digit;
        this.updateDisplay();
    }

    /** Set the operator for the next calculation. */
    /** @param {string} op - one of 'add', 'subtract', 'multiply', 'divide' */
    setOperator(op) {
        // If there is a current input, store it as previousValue
        if (this.currentInput !== '') {
            const parsed = parseFloat(this.currentInput);
            if (!isNaN(parsed)) {
                this.previousValue = parsed;
            }
        }
        this.operator = op;
        this.currentInput = '';
        this.updateDisplay();
    }

    /** Perform the calculation based on the stored operator and inputs. */
    calculate() {
        if (!this.operator) return; // nothing to do
        const current = this.currentInput === '' ? this.previousValue : parseFloat(this.currentInput);
        if (isNaN(current)) return;
        let result;
        switch (this.operator) {
            case 'add':
                result = this.previousValue + current;
                break;
            case 'subtract':
                result = this.previousValue - current;
                break;
            case 'multiply':
                result = this.previousValue * current;
                break;
            case 'divide':
                if (current === 0) {
                    result = 'Error';
                } else {
                    result = this.previousValue / current;
                }
                break;
            default:
                return;
        }
        // Store result for potential further operations
        this.previousValue = typeof result === 'number' ? result : 0;
        this.currentInput = typeof result === 'number' ? result.toString() : result;
        this.operator = null;
        this.updateDisplay();
    }

    /** Reset the calculator to its initial state. */
    clear() {
        this.currentInput = '';
        this.previousValue = 0;
        this.operator = null;
        this.updateDisplay();
    }

    /** Remove the last character from the current input. */
    backspace() {
        if (this.currentInput.length > 0) {
            this.currentInput = this.currentInput.slice(0, -1);
            this.updateDisplay();
        }
    }

    /** Update the display element with the current input or result. */
    updateDisplay() {
        // Prefer showing the current input; if empty, show the previous value or 0.
        const text = this.currentInput !== '' ? this.currentInput : this.previousValue.toString();
        this.displayElement.textContent = text;
    }
}

// Expose globally for potential external use
window.Calculator = Calculator;

/**
 * Event handling for button clicks and keyboard interaction.
 */
const calc = new Calculator(document.getElementById('display'));

/** Handle button click events based on data-action attributes. */
function handleButtonClick(event) {
    const btn = event.currentTarget;
    const action = btn.dataset.action;
    switch (action) {
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
            calc.setOperator(action);
            break;
        case 'equals':
            calc.calculate();
            break;
        case 'clear':
            calc.clear();
            break;
        case 'backspace':
            calc.backspace();
            break;
        case 'decimal':
            calc.appendDigit('.');
            break;
        default:
            // Assume numeric button (0‑9)
            if (/^[0-9]$/.test(action)) {
                calc.appendDigit(action);
            }
            break;
    }
}

/** Map keyboard keys to calculator actions. */
function handleKeyPress(event) {
    const key = event.key;
    // Allow the calculator to capture keys when focused anywhere on the page.
    if (key >= '0' && key <= '9') {
        calc.appendDigit(key);
    } else if (key === '.' || key === ',') {
        // Some keyboards use comma for decimal – treat as dot.
        calc.appendDigit('.');
    } else if (key === '+' ) {
        calc.setOperator('add');
    } else if (key === '-') {
        calc.setOperator('subtract');
    } else if (key === '*') {
        calc.setOperator('multiply');
    } else if (key === '/' ) {
        calc.setOperator('divide');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calc.calculate();
    } else if (key === 'Backspace') {
        calc.backspace();
    } else if (key === 'Escape') {
        calc.clear();
    }
}

// Attach listeners after DOM is ready (script is deferred, so DOM is already parsed).
document.querySelectorAll('.btn').forEach(btn => btn.addEventListener('click', handleButtonClick));
document.addEventListener('keydown', handleKeyPress);
