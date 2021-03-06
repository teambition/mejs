'use strict'

// **Github:** https://github.com/teambition/mejs
//
// **License:** MIT

const assert = require('assert')
const tman = require('tman')
const Mejs = require('../lib/mejs')

tman.suite('mejs', function () {
  function tplFn (x) {
    return x
  }

  let mejs = new Mejs({
    config: {test: 'test'}
  })
  let data = {ids: [1, 2, 3]}

  tman.it('mejs.add, mejs.get, mejs.remove, mejs.render', function () {
    assert.throws(function () {
      mejs.render('index')
    })
    assert.doesNotThrow(function () {
      mejs.get('index')
    })
    assert.strictEqual(mejs.add('index', tplFn), mejs)
    assert.strictEqual(mejs.get('index'), tplFn)
    assert.deepEqual(mejs.render('index', data), {config: {test: 'test'}, ids: [1, 2, 3]})
    assert.throws(function () {
      mejs.add('index', tplFn)
    })
    assert.strictEqual(mejs.remove('index'), mejs)
    assert.strictEqual(mejs.add('index', tplFn), mejs)
    assert.strictEqual(mejs.add('post', tplFn), mejs)
    assert.deepEqual(mejs.render('post', data), {config: {test: 'test'}, ids: [1, 2, 3]})
  })

  tman.it('mejs.resolve', function () {
    assert.strictEqual(mejs.resolve('a', 'b'), 'b')
    assert.strictEqual(mejs.resolve('a/', 'b'), 'a/b')
    assert.strictEqual(mejs.resolve('a//', 'b'), 'a/b')
    assert.strictEqual(mejs.resolve('/a/', 'b'), 'a/b')
    assert.strictEqual(mejs.resolve('a/', '/b'), 'a/b')
    assert.strictEqual(mejs.resolve('a/', '/b/c'), 'a/b/c')
    assert.strictEqual(mejs.resolve('a/b/c', 'd'), 'd')
    assert.strictEqual(mejs.resolve('a/b/c', '/d'), 'd')
    assert.strictEqual(mejs.resolve('a/b/c', 'd/e/f'), 'd/e/f')
    assert.strictEqual(mejs.resolve('a/b/c', './d'), 'a/b/d')
    assert.strictEqual(mejs.resolve('a/b/c', './../d'), 'a/d')
    assert.strictEqual(mejs.resolve('a/b/c', '../d/e'), 'a/d/e')
    assert.strictEqual(mejs.resolve('a/b/c/', '../d/e'), 'a/b/d/e')
    assert.strictEqual(mejs.resolve('a/b/c/', '../d//e'), 'a/b/d/e')
    assert.strictEqual(mejs.resolve('a/b/c/', '../../d/e'), 'a/d/e')
  })

  tman.it('mejs.escape', function () {
    assert.strictEqual(mejs.escape('abc'), 'abc')
    assert.strictEqual(mejs.escape('<abc>'), '&lt;abc&gt;')
    assert.strictEqual(mejs.escape('&gt;'), '&amp;gt;')
    assert.strictEqual(mejs.escape('"abc"'), '&quot;abc&quot;')
    assert.strictEqual(mejs.escape("'abc'"), '&#39;abc&#39;')
    assert.strictEqual(mejs.escape('`abc`'), '&#96;abc&#96;')
    assert.strictEqual(mejs.escape('abc<>'), 'abc&lt;&gt;')
  })

  tman.it('mejs.import', function () {
    let mejsA = new Mejs()
    let mejsB = new Mejs()
    let mejsC = new Mejs()

    assert.doesNotThrow(function () {
      mejsA.get('index')
    })

    mejsB.add('index', tplFn)
    mejsA.import(mejsB)
    assert.strictEqual(mejsA.get('index'), tplFn)
    assert.throws(function () {
      mejsA.import(mejsB)
    })
    mejsA.import('lib', mejsB)
    assert.strictEqual(mejsA.get('lib/index'), tplFn)
    mejsC.add('post', tplFn)
    mejsC.add('task', tplFn)
    mejsA.import('components', mejsC)
    assert.strictEqual(mejsA.get('components/post'), tplFn)
    assert.strictEqual(mejsA.get('components/task'), tplFn)
  })
})
