module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1582277662786, function(require, module, exports) {


// core modules
const stream = require('stream');
const util = require('util');

// external modules
const assert = require('assert-plus');
const intoStream = require('into-stream');
const JSONStream = require('JSONStream');
const through2 = require('through2');
const once = require('once').strict;
const JsonStreamStringify = require('json-stream-stringify');

// promisified implementations of callback APIs.
const _parsePromisified = util.promisify(_parse);
const _stringifyPromisified = util.promisify(_stringify);

/**
 * Create a JSON.parse that uses a stream interface. The underlying
 * implementation is handled by JSONStream. This is merely a thin wrapper for
 * convenience that handles the reconstruction/accumulation of each
 * individually parsed field.
 *
 * The advantage of this approach is that by also using a streams interface,
 * any JSON parsing or stringification of large objects won't block the CPU.
 * @public
 * @function createParseStream
 * @return {Stream}
 */
function createParseStream() {
    // when the parse stream gets chunks of data, it is an object with key/val
    // fields. accumulate the parsed fields.
    const accumulator = {};
    const parseStream = JSONStream.parse('$*');
    const wrapperStream = through2.obj(
        function write(chunk, enc, cb) {
            parseStream.write(chunk);
            return cb();
        },
        function flush(cb) {
            parseStream.on('end', function() {
                return cb(null, accumulator);
            });
            parseStream.end();
        }
    );

    // for each chunk parsed, add it to the accumulator
    parseStream.on('data', function(chunk) {
        accumulator[chunk.key] = chunk.value;
    });

    // make sure error is forwarded on to wrapper stream.
    parseStream.on('error', function(err) {
        wrapperStream.emit('error', err);
    });

    return wrapperStream;
}

/**
 * create a JSON.stringify readable stream.
 * @public
 * @param {Object} opts an options object
 * @param {Object} opts.body the JS object to JSON.stringify
 * @function createStringifyStream
 * @return {Stream}
 */
function createStringifyStream(opts) {
    assert.object(opts, 'opts');
    assert.ok(
        Array.isArray(opts.body) || typeof opts.body === 'object',
        'opts.body must be an array or object'
    );

    return new JsonStreamStringify(opts.body, null, null, false);
}

/**
 * stream based JSON.parse. async function signature to abstract over streams.
 * @public
 * @param {Object} opts options to pass to parse stream
 * @param {String} opts.body string to parse
 * @param {Function} callback a callback function
 * @return {Object} the parsed JSON object
 */
function _parse(opts, callback) {
    assert.object(opts, 'opts');
    assert.string(opts.body, 'opts.body');
    assert.func(callback, 'callback');

    const sourceStream = intoStream(opts.body);
    const parseStream = createParseStream();
    const cb = once(callback);

    parseStream.on('data', function(data) {
        return cb(null, data);
    });

    parseStream.on('error', function(err) {
        return cb(err);
    });

    sourceStream.pipe(parseStream);
}

/**
 * stream based JSON.parse. async function signature to abstract over streams.
 * variadic arguments to support both promise and callback based usage.
 * @public
 * @function parse
 * @param {Object} opts options to pass to parse stream
 * @param {String} opts.body string to parse
 * @param {Function} [callback] a callback function. if empty, returns a
 * promise.
 * @return {Object} the parsed JSON object
 */
function parse(opts, callback) {
    // if more than one argument was passed, assume it's a callback based usage.
    if (arguments.length > 1) {
        return _parse(opts, callback);
    }

    // otherwise, caller expects a promise.
    return _parsePromisified(opts);
}

/**
 * stream based JSON.stringify. async function signature to abstract over
 * streams.
 * @private
 * @param {Object} opts options to pass to stringify stream
 * @param {Function} callback a callback function
 * @return {Object} the parsed JSON object
 */
function _stringify(opts, callback) {
    assert.object(opts, 'opts');
    assert.func(callback, 'callback');

    let stringified = '';
    const stringifyStream = createStringifyStream(opts);
    const passthroughStream = new stream.PassThrough();
    const cb = once(callback);

    // setup the passthrough stream as a sink
    passthroughStream.on('data', function(chunk) {
        stringified += chunk;
    });

    passthroughStream.on('end', function() {
        return cb(null, stringified);
    });

    // don't know what errors stringify stream may emit, but pass them back
    // up.
    stringifyStream.on('error', function(err) {
        return cb(err);
    });

    stringifyStream.pipe(passthroughStream);
}

/**
 * stream based JSON.stringify. async function signature to abstract over
 * streams. variadic arguments to support both promise and callback based usage.
 * @public
 * @function stringify
 * @param {Object} opts options to pass to stringify stream
 * @param {Function} [callback] a callback function. if empty, returns a
 * promise.
 * @return {Object} the parsed JSON object
 */
function stringify(opts, callback) {
    // if more than one argument was passed, assume it's a callback based usage.
    if (arguments.length > 1) {
        return _stringify(opts, callback);
    }

    // otherwise, caller expects a promise.
    return _stringifyPromisified(opts);
}

module.exports = {
    createParseStream,
    createStringifyStream,
    parse,
    stringify
};

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1582277662786);
})()
//# sourceMappingURL=index.js.map