// Letter Notation Number Game
// Uses Break Eternity.js (OmegaNum compatible) for large numbers

class LetterNotationGame {
    constructor() {
        // Use Decimal from Break Eternity for large number support
        this.value = new Decimal(1);
        this.incrementRate = new Decimal(1); // per second
        this.lastUpdateTime = Date.now();
        
        this.setupEventListeners();
        this.gameLoop();
        this.updateDisplay();
    }

    setupEventListeners() {
        document.getElementById('setRateBtn').addEventListener('click', () => this.setRate());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('rateInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.setRate();
        });
    }

    setRate() {
        const input = document.getElementById('rateInput').value;
        const rate = parseFloat(input);
        
        if (isNaN(rate) || rate < 0.1) {
            alert('Please enter a valid rate (minimum 0.1)');
            return;
        }
        
        this.incrementRate = new Decimal(rate);
        this.updateDisplay();
    }

    reset() {
        if (confirm('Are you sure you want to reset to "a" (1)?')) {
            this.value = new Decimal(1);
            this.lastUpdateTime = Date.now();
            this.updateDisplay();
        }
    }

    gameLoop() {
        const now = Date.now();
        const deltaTime = (now - this.lastUpdateTime) / 1000; // Convert to seconds
        this.lastUpdateTime = now;

        // Add increment based on rate and time elapsed
        const increment = this.incrementRate.times(deltaTime);
        this.value = this.value.plus(increment);

        this.updateDisplay();
        requestAnimationFrame(() => this.gameLoop());
    }

    /**
     * Convert a number to letter notation
     * 1-26 = a-z
     * 27-52 = A-Z
     * 53-677 = aa-zz
     * 678-1355 = AA-ZZ
     * etc.
     */
    numberToLetters(num) {
        // Convert Decimal to regular number if needed, but keep as string for precision
        let n = num.toNumber();
        
        if (n < 1) return 'a';

        let result = '';
        let remaining = Math.floor(n);

        // Determine the "level" (1-letter, 2-letter, etc.)
        const levels = this.getLevelInfo(remaining);
        const { letterCount, startNum, caseStart } = levels;

        // Position within the current level
        const posInLevel = remaining - startNum;

        // Generate letters for this level
        result = this.positionToLetters(posInLevel, letterCount, caseStart);

        return result;
    }

    /**
     * Get info about which level a number falls into
     * Level 1: a-z (1-26), A-Z (27-52)
     * Level 2: aa-zz (53-677), AA-ZZ (678-1355)
     * Level 3: aaa-zzz (1356-18278), AAA-ZZZ (18279-35556)
     */
    getLevelInfo(num) {
        let letterCount = 1;
        let totalBefore = 0;
        let indexInLevel = num - 1;

        // Find which letter count this number falls into
        while (true) {
            const caseCombos = Math.pow(26, letterCount);
            const totalForLevel = caseCombos * 2; // lowercase and uppercase

            if (indexInLevel < totalForLevel) {
                // Found the level
                const caseIndex = Math.floor(indexInLevel / caseCombos);
                const posInCase = indexInLevel % caseCombos;
                const caseStart = caseIndex === 0 ? 0 : 26; // 0 for lowercase, 26 for uppercase

                return {
                    letterCount,
                    startNum: totalBefore + 1,
                    posInLevel: indexInLevel,
                    caseStart
                };
            }

            totalBefore += totalForLevel;
            indexInLevel -= totalForLevel;
            letterCount++;
        }
    }

    /**
     * Convert a position to actual letters
     * pos=0, count=1, caseStart=0 -> "a"
     * pos=25, count=1, caseStart=0 -> "z"
     * pos=0, count=1, caseStart=26 -> "A"
     * pos=25, count=1, caseStart=26 -> "Z"
     * pos=0, count=2, caseStart=0 -> "aa"
     */
    positionToLetters(pos, letterCount, caseStart) {
        const isUppercase = caseStart === 26;
        const base = isUppercase ? 'A'.charCodeAt(0) : 'a'.charCodeAt(0);

        let result = '';
        let current = pos;

        // Convert to base-26 representation
        const digits = [];
        for (let i = 0; i < letterCount; i++) {
            digits.unshift(current % 26);
            current = Math.floor(current / 26);
        }

        for (const digit of digits) {
            result += String.fromCharCode(base + digit);
        }

        return result;
    }

    /**
     * Get the next milestone (round number)
     */
    getNextMilestone() {
        const current = this.value.toNumber();
        
        // Round number milestones
        const milestones = [
            26,    // z
            52,    // Z
            100,
            1000,
            677,   // zz
            1355,  // ZZ
            10000,
            100000,
            1000000,
            10000000
        ].sort((a, b) => a - b);

        for (const milestone of milestones) {
            if (current < milestone) {
                return {
                    value: milestone,
                    notation: this.numberToLetters(milestone)
                };
            }
        }

        // If beyond all milestones, next milestone is 10x current
        const nextMilestone = Math.pow(10, Math.ceil(Math.log10(current)));
        return {
            value: nextMilestone,
            notation: this.numberToLetters(nextMilestone)
        };
    }

    updateDisplay() {
        // Letter notation
        const letterNotation = this.numberToLetters(this.value);
        document.getElementById('currentValue').textContent = letterNotation;

        // Numeric value (with formatting)
        const numValue = this.value.toNumber();
        let displayNum;
        if (numValue >= 1000000) {
            displayNum = this.value.toExponential(2);
        } else if (numValue >= 1000) {
            displayNum = numValue.toLocaleString('en-US', { maximumFractionDigits: 2 });
        } else {
            displayNum = numValue.toFixed(2).replace(/\.?0+$/, '');
        }
        document.getElementById('numericValue').textContent = displayNum;

        // Rate display
        const rate = this.incrementRate.toNumber();
        document.getElementById('rateDisplay').textContent = rate + '/s';

        // Milestone
        const nextMilestone = this.getNextMilestone();
        const progress = (numValue / nextMilestone.value) * 100;
        document.getElementById('nextMilestone').textContent = 
            `${nextMilestone.notation} (${nextMilestone.value.toLocaleString()}) - ${progress.toFixed(1)}%`;
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LetterNotationGame();
});
