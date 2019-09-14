require('./styles.scss');
require('html-loader!./index.html');
import {
    DecimalRepresentationUI, SignedMagnitudeRepresentationUI,
    OffsetBinaryRepresentationUI, OnesComplementRepresentationUI,
    TwosComplementRepresentationUI, AlternationRepresentationUI,
    BasementMinusTwoRepresentationUI, SymmetricThreeRepresentationUI
} from './representation_ui';


if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const integerRepresentationTable = document.querySelector('.integer-table').querySelector('tbody');
    const widthInput = document.querySelector('.bit-width');
    widthInput.value = 8;

    let currentNumber = 0n;
    let width = 8;

    let representations = [];

    widthInput.addEventListener('input', () => {
        width = parseInt(widthInput.value);

        for (let i = 0; i < representations.length; ++i) {
            representations[i].representer.updateWidth(width);
            representations[i].updateRange();
            representations[i].updateNumber(currentNumber);
        }
    });

    function updateNumberCallback(sender, number) {
        currentNumber = number;

        for (let i = 0; i < representations.length; ++i) {
            if (sender !== representations[i])
                representations[i].updateNumber(currentNumber);
        }
    }

    let decimal = new DecimalRepresentationUI(integerRepresentationTable, updateNumberCallback, width);
    let smr = new SignedMagnitudeRepresentationUI(integerRepresentationTable, updateNumberCallback, width);
    let ofb = new OffsetBinaryRepresentationUI(integerRepresentationTable, updateNumberCallback, width);
    let twc = new TwosComplementRepresentationUI(integerRepresentationTable, updateNumberCallback, width);
    let onc = new OnesComplementRepresentationUI(integerRepresentationTable, updateNumberCallback, width);
    let alt = new AlternationRepresentationUI(integerRepresentationTable, updateNumberCallback, width);
    let bmt = new BasementMinusTwoRepresentationUI(integerRepresentationTable, updateNumberCallback, width);
    let sth = new SymmetricThreeRepresentationUI(integerRepresentationTable, updateNumberCallback, width);

    representations.push(decimal);
    representations.push(smr);
    representations.push(ofb);
    representations.push(twc);
    representations.push(onc);
    representations.push(alt);
    representations.push(bmt);
    representations.push(sth);

    updateNumberCallback(null, 0n);
});
