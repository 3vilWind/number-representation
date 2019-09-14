import {
    SignedMagnitudeRepresentation, DecimalRepresentation,
    OffsetBinaryRepresentation, OnesComplementRepresentation,
    TwosComplementRepresentation, AlternationRepresentation,
    BasementMinusTwoRepresentation, SymmetricThreeRepresentation
} from "./representation";

class NumberRepresentationUI {
    constructor(parent, representer, updateCallback) {
        this.representer = representer;
        this.render(parent);
        this.registerEventListeners(updateCallback);
    }

    render(parent) {
        parent.insertAdjacentHTML('beforeend', `
        <tr>
            <td><div>${this.constructor.name}</div></td>
            <td class="number-range">${this.renderRange(this.representer.getRange())}</td>
        </tr>
        <tr>
            <td colspan="2">
                <input class="input" type="text">
            </td>
        </tr>
        `);
        let inputs = parent.querySelectorAll('.input');
        this.stateInput = inputs[inputs.length - 1];
        let ranges = parent.querySelectorAll('.number-range');
        this.rangeText = ranges[ranges.length - 1];
    }

    registerEventListeners(updateCallback) {
        this.stateInput.addEventListener('input', () => {

            let value = 0n;
            try {
                value = this.representer.toDecimal(this.stateInput.value);
            } catch (e) {
                value = 0n;
            }

            updateCallback(this, value);
        });
    }

    renderRange(range) {
        if (range == null)
            return '';

        return `${range.minimum} | ${range.maximum}`;
    }

    updateNumber(number) {
        this.stateInput.value = this.representer.fromDecimal(number);
    }

    updateRange() {
        this.rangeText.textContent = this.renderRange(this.representer.getRange());
    }
}


export class DecimalRepresentationUI extends NumberRepresentationUI {
    static name = 'Decimal';

    constructor(parent, updateCallback, width) {
        super(parent, new DecimalRepresentation(width), updateCallback);
    }
}


export class SignedMagnitudeRepresentationUI extends NumberRepresentationUI {
    static name = 'Signed Magnitude';

    constructor(parent, updateCallback, width) {
        super(parent, new SignedMagnitudeRepresentation(width), updateCallback);
    }
}

export class OffsetBinaryRepresentationUI extends NumberRepresentationUI {
    static name = 'Offset Binary';

    constructor(parent, updateCallback, width) {
        super(parent, new OffsetBinaryRepresentation(width), updateCallback);
    }
}

export class OnesComplementRepresentationUI extends NumberRepresentationUI {
    static name = 'Ones Complement';

    constructor(parent, updateCallback, width) {
        super(parent, new OnesComplementRepresentation(width), updateCallback);
    }
}

export class TwosComplementRepresentationUI extends NumberRepresentationUI {
    static name = 'Twos Complement';

    constructor(parent, updateCallback, width) {
        super(parent, new TwosComplementRepresentation(width), updateCallback);
    }
}

export class AlternationRepresentationUI extends NumberRepresentationUI {
    static name = 'Alternation';

    constructor(parent, updateCallback, width) {
        super(parent, new AlternationRepresentation(width), updateCallback);
    }
}


export class BasementMinusTwoRepresentationUI extends NumberRepresentationUI {
    static name = 'Basement -2';

    constructor(parent, updateCallback, width) {
        super(parent, new BasementMinusTwoRepresentation(width), updateCallback);
    }
}

export class SymmetricThreeRepresentationUI extends NumberRepresentationUI {
    static name = 'Symmetric 3';

    constructor(parent, updateCallback, width) {
        super(parent, new SymmetricThreeRepresentation(width), updateCallback);
    }
}
