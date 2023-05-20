const cp = require('child_process'),
    {writeFileSync} = require('fs');
function swallow(fn, ...args) {
    let r;
    try {
        r = fn.apply(this, args);
    } catch (err) {
        console.error(err);
    }
    return r;
}
function pExec(cmd) {
    log(`$ ${cmd}`);
    let r = cp.execSync(cmd);
    return console.log(r.toString()), r;
}
function log(...a) {
    let x = (...a) => '\033[' + a.join(';') + 'm';
    console.log(`${x(93, 1)}[${new Date().toJSON()}]${x(0)}`, ...a);
}
let check = swallow(cp.execSync, 'npm -v && node -v');
if (!check) console.error('npm or node not found');
else {
    pExec('npm install');
    check = swallow(require, './node_modules/reaction-balancer/package.json');
    if (!check) log('reaction-balancer not found. try "npm install"');
    else if (check.type === 'module') {
        check.type = 'commonjs';
        writeFileSync('./node_modules/reaction-balancer/package.json', JSON.stringify(check));
        log('changed type of react-balancer to commonjs');
    }
    log('finished checking/setting up. starting...');
    let n = cp.fork('.');
    n.on('message', console.log.bind(console));
}
