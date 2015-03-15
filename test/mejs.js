'use strict';

// **Github:** https://github.com/teambition/mejs
//
// **License:** MIT
/*global describe, it, before, after, beforeEach, afterEach*/

var assert = require('assert');
var Mejs = require('../lib/mejs');

describe('mejs', function() {

  function tplFn(x) {
    return x;
  }

  var mejs = new Mejs({
    config: {test: 'test'}
  });
  var data = {ids: [1, 2, 3]};

  it('mejs.add, mejs.get, mejs.remove, mejs.render', function(done) {

    assert.throws(function() {
      mejs.render('index');
    });
    assert.throws(function() {
      mejs.get('index');
    });
    assert.strictEqual(mejs.add('index', tplFn), mejs);
    assert.strictEqual(mejs.get('index'), tplFn);
    assert.deepEqual(mejs.render('index', data), {config: {test: 'test'}, ids: [1, 2, 3]});
    assert.throws(function() {
      mejs.add('index', tplFn);
    });
    assert.strictEqual(mejs.remove('index'), mejs);
    assert.strictEqual(mejs.add('index', tplFn), mejs);
    assert.strictEqual(mejs.add('post', tplFn), mejs);
    assert.deepEqual(mejs.render('post', data), {config: {test: 'test'}, ids: [1, 2, 3]});
    done();
  });

  it('mejs.resolve', function(done) {
    assert.strictEqual(mejs.resolve('a', 'b'), 'b');
    assert.strictEqual(mejs.resolve('a/', 'b'), 'a/b');
    assert.strictEqual(mejs.resolve('a//', 'b'), 'a/b');
    assert.strictEqual(mejs.resolve('/a/', 'b'), 'a/b');
    assert.strictEqual(mejs.resolve('a/', '/b'), 'b');
    assert.strictEqual(mejs.resolve('a/', '/b/c'), 'b/c');
    assert.strictEqual(mejs.resolve('a/b/c', 'd'), 'a/b/d');
    assert.strictEqual(mejs.resolve('a/b/c', './d'), 'a/b/d');
    assert.strictEqual(mejs.resolve('a/b/c', '/d'), 'd');
    assert.strictEqual(mejs.resolve('a/b/c', './../d'), 'a/d');
    assert.strictEqual(mejs.resolve('a/b/c', '../e/d'), 'a/e/d');
    assert.strictEqual(mejs.resolve('a/b/c/', '../e/d'), 'a/b/e/d');
    assert.strictEqual(mejs.resolve('a/b/c/', '../e//d'), 'a/b/e/d');
    assert.strictEqual(mejs.resolve('a/b/c/', '../../e/d'), 'a/e/d');
    done();
  });

  it('mejs.escape', function(done) {
    assert.strictEqual(mejs.escape('abc'), 'abc');
    assert.strictEqual(mejs.escape('<abc>'), '&lt;abc&gt;');
    assert.strictEqual(mejs.escape('&gt;'), '&amp;gt;');
    assert.strictEqual(mejs.escape('"abc"'), '&quot;abc&quot;');
    assert.strictEqual(mejs.escape("'abc'"), '&#39;abc&#39;');
    assert.strictEqual(mejs.escape('`abc`'), '&#96;abc&#96;');
    assert.strictEqual(mejs.escape('abc<>'), 'abc&lt;&gt;');
    done();
  });

  it('mejs.import', function(done) {
    var mejsA = new Mejs();
    var mejsB = new Mejs();
    var mejsC = new Mejs();

    assert.throws(function() {
      mejsA.get('index');
    });

    mejsB.add('index', tplFn);
    mejsA.import(mejsB);
    assert.strictEqual(mejsA.get('index'), tplFn);
    assert.throws(function() {
      mejsA.import(mejsB);
    });
    mejsA.import('lib', mejsB);
    assert.strictEqual(mejsA.get('lib/index'), tplFn);
    mejsC.add('post', tplFn);
    mejsC.add('task', tplFn);
    mejsA.import('components', mejsC);
    assert.strictEqual(mejsA.get('components/post'), tplFn);
    assert.strictEqual(mejsA.get('components/task'), tplFn);
    done();
  });
});