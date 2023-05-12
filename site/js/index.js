/**
 * I am sincerely sorry for this mess.
 */
const $ = (x) => document.querySelector(x),
    buttons = $('.bcontainer'),
    out = $('.outer'),
    balance = $('.fa-arrow-right'),
    res = $('#o'),
    input = $('#i'),
    err = $('.error'),
    hist = $('.fa-history'),
    history = $('.history'),
    ht = $('#ht'),
    copy = $('.fa-copy'),
    right = $('.fa-arrow-alt-circle-right'),
    left = $('.fa-arrow-alt-circle-left'),
    search = $('#s');

/**
 * Who doesn't love the Linux terminal?
 */
let scrollIndex = -1;

/**
 * Uhm... CSS stuff, better not touch.
 */
if (window.innerWidth < 990) buttons.style.minWidth = out.offsetWidth + 'px';
else buttons.style.minHeight = out.offsetHeight + 'px';

/**
 * Restore last session since I'm nice.
 */
let d = getD();
if (d) {
    input.value = d[d.length - 1][0];
    scrollIndex = d.length - 1;
}

/**
 * The event to get da result.
 */
async function balanceClick() {
    input.disabled = true;
    let d = getD();

    if (d) {
        if (
            d.find((x) => {
                if (x[0] === input.value) {
                    res.value = x[1];
                    return true;
                }
                return false;
            })
        ) {
            input.disabled = false;
            return showError();
        }
    }

    let r = await fetch(`/api/balance?q=${encodeURIComponent(input.value)}`).then((x) => x.json());
    input.disabled = false;
    if (typeof r === 'string') {
        res.value = r;
        if (!d) d = [];
        localStorage.setItem('history', JSON.stringify(d.concat([[input.value, r]])));
        showError();
        return;
    }
    showError(r.message);
}
balance.addEventListener('click', balanceClick);

/**
 * Send you to to the history section.
 */
hist.addEventListener('click', () => {
    let d = getD();
    if (!d) return showError('No queries found in local storage.');
    ht.innerHTML = '<tr><th>#</th><th>Query</th><th>Result</th></tr>';
    let i = 0;
    for (const x of d) {
        i++;
        ht.innerHTML += `<tr><td>${i}</td><td>${x[0]}</td><td>${x[1]}</td></tr>`;
    }
    if (history.style.display === 'none') {
        history.style.display = 'flex';
    }
    setTimeout(() => (document.location.href = '#h'), 100);
    showError();
});

/**
 * Searchin', with regex support!
 */
search.oninput = (e) => {
    const f = (x, v) => {
        let r;
        try {
            r = new RegExp(v, 'g');
        } catch {
            // Big mistake for not including this block in testing.
            r = v;
        }
        return x.replace(r, (y) => `<span id="hl">${y}</span>`);
    };
    let v = e.target.value,
        d = getD();
    ht.innerHTML = '<tr><th>#</th><th>Query</th><th>Result</th></tr>';
    let i = 0;
    for (const x of d) {
        i++;
        ht.innerHTML += `<tr><td>${i}</td><td>${f(x[0], v)}</td><td>${f(x[1], v)}</td></tr>`;
    }
    document.location.href = '#hl';
    search.focus();
    return;
};

/**
 * Copypasta.
 */
copy.addEventListener('click', () =>
    navigator.clipboard.writeText(res.value).then(
        () => alert('Copied to clipboard'),
        () => alert('Failed to copy to clipboard')
    )
);

/**
 * Every single linux user for some reasons.
 */
document.addEventListener('keydown', (e) => {
    if (document.activeElement !== input) return;
    let d = getD();
    if (['ArrowUp', 'ArrowDown'].includes(e.key) && d) {
        e.preventDefault();
        scrol(e.key, d);
    } else if (e.key === 'Enter') balanceClick();
});

right.addEventListener('click', () => scrol('ArrowDown'));
left.addEventListener('click', () => scrol('ArrowUp'));

/**
 * Scrolls through the recorded queries, just like a Linux terminal.
 * @param {Object?} d THE DATA.
 * @param {String} key The key, either ArrowUp or ArrowDown.
 */
function scrol(k, d = getD()) {
    if (!d) return;
    scrollIndex = Math.max(Math.min(scrollIndex + (k === 'ArrowUp' ? -1 : 1), d.length - 1), 0);
    input.value = d[scrollIndex][0];
}

/**
 * It displays... the error. What do you expect?
 * @param {String} error The error.
 * @returns {undefined}
 */
function showError(x) {
    if (!x) {
        if (!err.classList.contains('o')) err.classList.add('o');
        return;
    }
    err.innerText = x;
    if (err.classList.contains('o')) err.classList.remove('o');
}

/**
 * IT GETS THE HISTORY DATA, OKAY?? `D` OBVIOUSLY STANDS FOR `DATA`.
 *
 * On a more serious note, it gets the history data from `localStorage` then `JSON.parse`s it.
 * @returns {String[][] | undefined} The DATA.
 */
function getD() {
    let d = localStorage.getItem('history');
    if (d) return JSON.parse(d);
    return;
}

/**
 * sneaky sneaky...
 */
if (Math.random() <= 0.2) {
    err.classList.add('oalt');
    console.log("something's wrong...");
}
document.querySelector('.logo').addEventListener('click', () => {
    // 20% chance only because I'm nice.
    if (Math.random() <= 0.8) return;
    window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
});
