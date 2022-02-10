const fs = require('fs')

const resolve = function (path) {
    var orig = path;
    var reg = path + '.js';
    var index = path + '/index.js';
    return modules[reg] && reg
        || modules[index] && index
        || orig;
};

const relative = function (parent) {
    return function (p) {
        if ('.' != p.charAt(0)) return $require(p);
        var path = parent.split('/');
        var segs = p.split('/');
        path.pop();

        for (var i = 0; i < segs.length; i++) {
            var seg = segs[i];
            if ('..' == seg) path.pop();
            else if ('.' != seg) path.push(seg);
        }

        return $require(path.join('/'));
    };
};

const modules = {}

const register = function (path, fn) {
    modules[path] = fn;
};

function $require(p) {
    var path = resolve(p);
    var mod = modules[path];
    return mod.exports;
}

function execScript(str) {
    const fn = new Function('module', 'require', str)
    fn.exports = {};
    fn.call(fn.exports, fn.exports, relative(path));
    return fn
}

const path = './demo.js'

const jstr = fs.readFileSync(path).toString()

const jstr2 = `const a = require('./demo.js');
console.log(a)`

register(path, execScript(jstr, path))
execScript(jstr2)



