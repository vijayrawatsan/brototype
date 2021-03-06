/*global describe:false, it:false, expect:false, beforeEach:false */

var Bro = require('./brototype').Bro;
var assert = require('assert');

describe('Bro.doYouEven', function() {
    it('should be defined', function() {
        var a = {},
            bro = Bro(a);
        assert.notEqual(bro.doYouEven, undefined);
    });

    it('should return true for defined properties', function() {
        var a = {foo: 'bar'},
            bro = Bro(a);
        assert.equal(bro.doYouEven('foo'), true);
    });

    it('should return true for nested properties', function() {
        var a = {foo: {bar: 'baz'}},
            bro = Bro(a);
        assert.equal(bro.doYouEven('foo.bar'), true);
    });

    it('should return false for undefined properties', function() {
        var a = {foo: 'bar'},
            bro = Bro(a);
        assert.equal(bro.doYouEven('bar'), false);
    });
});

describe('Bro.iCanHaz', function() {
    it('should return the value of the deep property', function() {
        var a = {b: {c: {d: 32}}},
            bro = Bro(a);
        assert.equal(bro.iCanHaz('b.c.d'), 32);
    });

    it('should return undefined for missing property', function() {
        var a = {b: 32},
            bro = Bro(a);
        assert.equal(bro.iCanHaz('b.c.d'), undefined);
    });
});

describe('Bro.allTheThings', function() {
    it('should return an object\'s keys', function() {
        var a = {
                "foo": 1,
                "bar": 2
            },
            keys = Bro(a).allTheThings();
        assert.equal(keys.length, 2);
        assert.notEqual(keys.indexOf('foo'), -1);
        assert.notEqual(keys.indexOf('bar'), -1);
    });

    it('should return the keys in order', function () {
        var a = { 'z': 1, 'y': 2, 'x': 3 },
            keys = Bro(a).allTheThings();
        assert.equal(keys[0], 'x');
        assert.equal(keys[keys.length - 1], 'z');
    });
});

describe('Bro.iDontAlways', function() {
    var fired,
        success,
        param,
        context,
        obj = {
            "foo": function() {
                fired = true;
                context = this;
                return 91;
            },
            "bar": 3
        },
        fn = function(p) {
            success = true;
            param = p;
        };

    beforeEach(function() {
        fired = false;
        success = false;
        param = null;
        context = null;
    });

    it('should check that the requested method is a function', function() {
        var bro = Bro(obj);
        bro.iDontAlways('bar').butWhenIdo(fn);
        assert.equal(success, false);
        bro.iDontAlways('foo').butWhenIdo(fn);
        assert.equal(success, true);
    });

    it('should run the requested method if a function', function() {
        var bro = Bro(obj);
        bro.iDontAlways('foo').butWhenIdo(fn);
        assert.equal(fired, true);
    });

    it('should pass the method\'s return value as param to callback', function() {
        var bro = Bro(obj);
        bro.iDontAlways('foo').butWhenIdo(fn);
        assert.equal(param, 91);
    });

    it('should apply the object as its own context', function() {
        var bro = Bro(obj);
        bro.iDontAlways('foo').butWhenIdo(fn);
        assert.equal(context, obj);
    });
});

describe('Bro.braceYourself', function() {
    var success,
        error,
        obj = {
            "foo": function() {
                throw 'an error';
            }
        },
        fn = function(e) {
            success = true;
            error = e;
        };

    beforeEach(function() {
        success = null;
        error = null;
    });

    it('should fire the callback when an exception is thrown', function() {
        var bro = Bro(obj);
        bro.braceYourself('foo').hereComeTheErrors(fn);
        assert.equal(success, true);
    });

    it('should pass the error to the callback', function() {
        var bro = Bro(obj);
        bro.braceYourself('foo').hereComeTheErrors(fn);
        assert.equal(error, 'an error');
    });
});
