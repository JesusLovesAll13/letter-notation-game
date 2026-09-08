# Letter Notation Number Game

A fun incremental game where numbers are converted to a custom letter notation system. The number increments automatically over time, and you can customize the increment rate.

## Features

- **Custom Letter Notation System**:
  - `a-z` = 1-26
  - `A-Z` = 27-52
  - `aa-zz` = 53-677
  - `AA-ZZ` = 678-1,355
  - `aaa-zzz` = 1,356-18,278
  - And continues infinitely with more letters!

- **Auto-Increment**: The value automatically increases over time (default: 1 per second)
- **Customizable Rate**: Adjust the increment rate to any value you want
- **Large Number Support**: Uses Break Eternity.js for handling extremely large numbers
- **Real-time Display**: Shows current letter notation, numeric value, and progress to next milestone

## How It Works

The letter notation system works by grouping letters into "levels":

1. **Level 1**: Single letters
   - Lowercase: `a` to `z` (1-26)
   - Uppercase: `A` to `Z` (27-52)

2. **Level 2**: Double letters
   - Lowercase: `aa` to `zz` (53-677)
   - Uppercase: `AA` to `ZZ` (678-1,355)

3. **Level 3+**: Triple, quadruple, etc.
   - `aaa` to `zzz` (1,356-18,278)
   - And so on...

This creates a compact and readable way to represent very large numbers!

## Controls

- **Set Increment Rate**: Change how fast the number grows (default: 1/s)
- **Reset**: Start over from `a` (1)

## Technical Details

- Built with vanilla JavaScript
- Uses [Break Eternity.js](https://github.com/Patashu/break_eternity.js) for large number arithmetic
- Responsive design that works on mobile and desktop
- Real-time game loop using `requestAnimationFrame`

## Getting Started

Simply open `index.html` in your web browser to start playing!

No build process or installation required - the game uses a CDN for the Break Eternity.js library.

## License

MIT
