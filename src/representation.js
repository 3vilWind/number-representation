class NumberRepresentation {
    constructor(width) {
        this.width = width;
    }

    fromDecimal(number) {
       let range = this.getRange();
       if (range != null)
           if ( !range.check(number)) {
               return 'error';
           }
       return this.fromNumber(number);
    }

    fromNumber(number) {
    }

    toDecimal(string) {
    }
    getRange() {
    }

    updateWidth(width) {
        this.width = width;
    }
}

class Range {
    constructor(minimal, maximum) {
        this.minimum = minimal;
        this.maximum = maximum;
    }

    check(number) {
        return !(number < this.minimum || number > this.maximum);
    }
}

export class DecimalRepresentation extends NumberRepresentation {
    fromNumber(number) {
        return number;
    }

    toDecimal(string) {
        return BigInt(string);
    }

    getRange() {
        return null;
    }
}

export class UnsignedRepresentation extends NumberRepresentation {
    fromNumber(number) {
        let result = Array();
        for (let i = 0; i < this.width; ++i) {
            result.push('0');
        }

        let div = BigInt(number);
        let ind = 0;
        while (div > 0n) {
            if (ind >= this.width)
                throw new Error('Number doesnt fit into this width!');
            if (div % 2n === 1n)
                result[this.width - ind - 1] = '1';
            div /= 2n;
            div >>= 0n;
            ++ind;
        }
        return result;
    }

    toDecimal(string) {
        let result = 0n;
        for(let i = 0; i < string.length; ++i) {
            result += BigInt(string[i]) * 2n ** BigInt(string.length - i - 1);
        }

        return result;
    }
}

export class SignedMagnitudeRepresentation extends NumberRepresentation {
    constructor(width) {
        super(width);
        this.unsignedRepresentation = new UnsignedRepresentation(width);
    }

    fromNumber(number) {
        let result;
        if (number < 0n) {
            result = this.unsignedRepresentation.fromDecimal(-number);
            result[0] = '1';
        } else {
            result = this.unsignedRepresentation.fromDecimal(number);
        }

        return result.join('');
    }
    toDecimal(string) {
        let number = this.unsignedRepresentation.toDecimal(string.slice(1));
        if (string[0] === '1')
            number = -number;

        return number;
    }

    getRange() {
        return new Range(-(2n**BigInt(this.width - 1)) + 1n, 2n**BigInt(this.width - 1) - 1n);
    }

    updateWidth(width) {
        super.updateWidth(width);
        this.unsignedRepresentation.updateWidth(width);
    }
}


export class OffsetBinaryRepresentation extends NumberRepresentation {
    constructor(width) {
        super(width);
        this.unsignedRepresentation = new UnsignedRepresentation(width);
    }

    fromNumber(number) {
        let offset_number = number + 2n**BigInt(this.width - 1);
        let result = this.unsignedRepresentation.fromDecimal(offset_number);

        return result.join('');
    }
    toDecimal(string) {
        let number = this.unsignedRepresentation.toDecimal(string);

        number -= 2n**BigInt(this.width - 1);

        return number;
    }

    getRange() {
        return new Range(-(2n**BigInt(this.width - 1)), 2n**BigInt(this.width - 1) - 1n);
    }

    updateWidth(width) {
        super.updateWidth(width);
        this.unsignedRepresentation.updateWidth(width);
    }
}


export class OnesComplementRepresentation extends NumberRepresentation {
    constructor(width) {
        super(width);
        this.unsignedRepresentation = new UnsignedRepresentation(width);
    }

    fromNumber(number) {
        let result;
        if (number < 0) {
            result = this.unsignedRepresentation.fromDecimal(-number);
            for (let i = 0; i < result.length; ++i) {
                if (result[i] === '0')
                    result[i] = '1';
                else
                    result[i] = '0';
            }
        } else {
            result = this.unsignedRepresentation.fromDecimal(number);
        }

        return result.join('');
    }
    toDecimal(string) {
        let data = Array.from(string);
        let number = 0;
        if (data[0] === '1') {
            for (let i = 0; i < data.length; ++i) {
                if (data[i] === '0')
                    data[i] = '1';
                else
                    data[i] = '0';
            }
            number = -this.unsignedRepresentation.toDecimal(data);
        } else {
            number = this.unsignedRepresentation.toDecimal(data);
        }

        return number;
    }

    getRange() {
        return new Range(-(2n**BigInt(this.width - 1)) + 1n, 2n**BigInt(this.width - 1) - 1n);
    }

    updateWidth(width) {
        super.updateWidth(width);
        this.unsignedRepresentation.updateWidth(width);
    }
}

export class TwosComplementRepresentation extends NumberRepresentation {
    constructor(width) {
        super(width);
        this.unsignedRepresentation = new UnsignedRepresentation(width);
    }

    fromNumber(number) {
        let result;
        if (number < 0) {
            result = this.unsignedRepresentation.fromDecimal(-number);
            for (let i = 0; i < result.length; ++i) {
                if (result[i] === '0')
                    result[i] = '1';
                else
                    result[i] = '0';
            }
            result = this.unsignedRepresentation.toDecimal(result) + 1n;
            result = this.unsignedRepresentation.fromNumber(result)
        } else {
            result = this.unsignedRepresentation.fromDecimal(number);
        }

        return result.join('');
    }

    toDecimal(string) {
        let data = Array.from(string);
        let number = 0;
        if (data[0] === '1') {
            for (let i = 0; i < data.length; ++i) {
                if (data[i] === '0')
                    data[i] = '1';
                else
                    data[i] = '0';
            }
            number = -(this.unsignedRepresentation.toDecimal(data) + 1n);
        } else {
            number = this.unsignedRepresentation.toDecimal(data);
        }

        return number;
    }

    getRange() {
        return new Range(-(2n**BigInt(this.width - 1)), 2n**BigInt(this.width - 1) - 1n);
    }

    updateWidth(width) {
        super.updateWidth(width);
        this.unsignedRepresentation.updateWidth(width);
    }
}


export class AlternationRepresentation extends NumberRepresentation {
    constructor(width) {
        super(width);
        this.unsignedRepresentation = new UnsignedRepresentation(width);
    }

    fromNumber(number) {
        let result;
        if (number < 0) {
            result = this.unsignedRepresentation.fromDecimal(-number - 1n);
            result.shift();
            result.push('1');
        } else {
            result = this.unsignedRepresentation.fromDecimal(number);
            result.shift();
            result.push('0');
        }

        return result.join('');
    }

    toDecimal(string) {
        let data = Array.from(string);
        let number = 0;
        if (data[data.length - 1] === '1') {
            number = -(this.unsignedRepresentation.toDecimal(data.slice(0, -1)) + 1n);
        } else {
            number = this.unsignedRepresentation.toDecimal(data.slice(0, -1));
        }

        return number;
    }

    getRange() {
        return new Range(-(2n**BigInt(this.width - 1)), 2n**BigInt(this.width - 1) - 1n);
    }

    updateWidth(width) {
        super.updateWidth(width);
        this.unsignedRepresentation.updateWidth(width);
    }
}

export class BasementMinusTwoRepresentation extends NumberRepresentation {
    constructor(width) {
        super(width);
        this.unsignedRepresentation = new UnsignedRepresentation(width);
    }

    fromNumber(number) {
        let result = Array();
        for (let i = 0; i < this.width; ++i) {
            result.push('0');
        }

        let div = BigInt(number);
        let ind = 0;
        while (div !== 0n) {
            let last = div;
            if (ind >= this.width)
                throw new Error('Number doesnt fit into this width!');

            let rem = div % -2n;
            if (rem < 0n)
                rem = -rem;
            if (rem !== 0n)
                result[this.width - ind - 1] = '1';
            div /= -2n;
            div >>= 0n;
            if (div * -2n + rem !== last)
                ++div;
            console.assert(div * -2n + rem === last, 'aaaaaaa');

            ++ind;
        }
        return result.join('');
    }

    toDecimal(string) {
        let result = 0n;
        for(let i = 0; i < string.length; ++i) {
            result += BigInt(string[i]) * (-2n) ** BigInt(string.length - i - 1);
        }

        return result;
    }

    getRange() {
        let min = 0n;
        let max = 0n;
        for (let i = 0n; i < this.width; ++i) {
            let t = (-2n) ** i;
            if (t < 0n)
                min += t;
            else
                max += t;
        }
        return new Range(min, max);
    }

    updateWidth(width) {
        super.updateWidth(width);
        this.unsignedRepresentation.updateWidth(width);
    }
}


export class SymmetricThreeRepresentation extends NumberRepresentation {
    constructor(width) {
        super(width);
    }

    fromNumber(number) {
        let result = Array();
        for (let i = 0; i < this.width; ++i) {
            result.push('0');
        }

        let div = BigInt(number);
        let isNegative = div < 0;

        if (isNegative)
            div = -div;


        let ind = 0;
        while (div !== 0n) {
            if (ind >= this.width)
                throw new Error('Number doesnt fit into this width!');

            let rem = div % 3n;

            div /= 3n;
            div >>= 0n;

            if (rem === 0n)
                result[this.width - ind - 1] = '0';
            else if (rem === 1n)
                result[this.width - ind - 1] = '1';
            else {
                result[this.width - ind - 1] = 'z';
                div += 1n;
            }

            ++ind;
        }
        if (isNegative) {
            for(let i = 0; i < result.length; ++i) {
                if (result[i] === '1')
                    result[i] = 'z';
                else if (result[i] === 'z')
                    result[i] = '1';
            }
        }


        return result.join('');
    }

    toDecimal(string) {
        let result = 0n;
        for(let i = 0; i < string.length; ++i) {
            result += BigInt(string[i] !== 'z'? string[i]: '-1') * (3n) ** BigInt(string.length - i - 1);
        }

        return result;
    }

    getRange() {
        let result = 0n;
        for (let i = 0n; i < this.width; ++i) {
            result += (3n) ** i;
        }
        return new Range(-result, result);
    }
}