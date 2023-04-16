const UnicodeTrie = require('unicode-trie');
const fs = require('fs');
const base64 = require('base64-js');
const { BK, CR, LF, NL, SG, WJ, SP, ZWJ, BA, HY, NS, AI, AL, CJ, HL, RI, SA, XX } = require('./classes');
const { DI_BRK, IN_BRK, CI_BRK, CP_BRK, PR_BRK, pairTable } = require('./pairs');

const data = base64.toByteArray(fs.readFileSync(__dirname + '/classes.trie', 'base64'));
const classTrie = new UnicodeTrie(data);

const mapClass = function (c) {
  switch (c) {
    case AI:
      return AL;

    case SA:
    case SG:
    case XX:
      return AL;

    case CJ:
      return NS;

    default:
      return c;
  }
};

const mapFirst = function (c) {
  switch (c) {
    case LF:
    case NL:
      return BK;

    case SP:
      return WJ;

    default:
      return c;
  }
};

class Break {
  constructor(position, required = false) {
    this.position = position;
    this.required = required;
  }
}

class LineBreaker {
  constructor(string) {
    this.string = string;
    this.pos = 0;
    this.lastPos = 0;
    this.curClass = null;
    this.nextClass = null;
    this.LB8a = false;
    this.LB21a = false;
    this.LB30a = 0;
  }

  nextCodePoint() {
    const code = this.string.charCodeAt(this.pos++);
    const next = this.string.charCodeAt(this.pos);

    // If a surrogate pair
    if ((0xd800 <= code && code <= 0xdbff) && (0xdc00 <= next && next <= 0xdfff)) {
      this.pos++;
      return ((code - 0xd800) * 0x400) + (next - 0xdc00) + 0x10000;
    }

    return code;
  }

  nextCharClass() {
    return mapClass(classTrie.get(this.nextCodePoint()));
  }

  getSimpleBreak() {
    // handle classes not handled by the pair table
    switch (this.nextClass) {
      case SP:
        return false;

      case BK:
      case LF:
      case NL:
        this.curClass = BK;
        return false;

      case CR:
        this.curClass = CR;
        return false;
    }

    return null;
  }

  getPairTableBreak(lastClass) {
    // if not handled already, use the pair table
    let shouldBreak = false;
    switch (pairTable[this.curClass][this.nextClass]) {
      case DI_BRK: // Direct break
        shouldBreak = true;
        break;

      case IN_BRK: // possible indirect break
        shouldBreak = lastClass === SP;
        break;

      case CI_BRK:
        shouldBreak = lastClass === SP;
        if (!shouldBreak) {
          shouldBreak = false;
          return shouldBreak;
        }
        break;

      case CP_BRK: // prohibited for combining marks
        if (lastClass !== SP) {
          return shouldBreak;
        }
        break;

      case PR_BRK:
        break;
    }

    if (this.LB8a) {
      shouldBreak = false;
    }

    // Rule LB21a
    if (this.LB21a && (this.curClass === HY || this.curClass === BA)) {
      shouldBreak = false;
      this.LB21a = false;
    } else {
      this.LB21a = (this.curClass === HL);
    }

    // Rule LB30a
    if (this.curClass === RI) {
      this.LB30a++;
      if (this.LB30a == 2 && (this.nextClass === RI)) {
        shouldBreak = true;
        this.LB30a = 0;
      }
    } else {
      this.LB30a = 0;
    }

    this.curClass = this.nextClass;

    return shouldBreak;
  }

  nextBreak() {
    // get the first char if we're at the beginning of the string
    if (this.curClass == null) {
      let firstClass = this.nextCharClass();
      this.curClass = mapFirst(firstClass);
      this.nextClass = firstClass;
      this.LB8a = (firstClass === ZWJ);
      this.LB30a = 0;
    }

    while (this.pos < this.string.length) {
      this.lastPos = this.pos;
      const lastClass = this.nextClass;
      this.nextClass = this.nextCharClass();

      // explicit newline
      if ((this.curClass === BK) || ((this.curClass === CR) && (this.nextClass !== LF))) {
        this.curClass = mapFirst(mapClass(this.nextClass));
        return new Break(this.lastPos, true);
      }

      let shouldBreak = this.getSimpleBreak();

      if (shouldBreak === null) {
        shouldBreak = this.getPairTableBreak(lastClass);
      }

      // Rule LB8a
      this.LB8a = (this.nextClass === ZWJ);

      if (shouldBreak) {
        return new Break(this.lastPos);
      }
    }

    if (this.lastPos < this.string.length) {
      this.lastPos = this.string.length;
      return new Break(this.string.length);
    }

    return null;
  }
}

module.exports = LineBreaker;
