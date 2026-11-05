(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/qrcode/lib/can-promise.js
  var require_can_promise = __commonJS({
    "node_modules/qrcode/lib/can-promise.js"(exports, module) {
      module.exports = function() {
        return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
      };
    }
  });

  // node_modules/qrcode/lib/core/utils.js
  var require_utils = __commonJS({
    "node_modules/qrcode/lib/core/utils.js"(exports) {
      var toSJISFunction;
      var CODEWORDS_COUNT = [
        0,
        // Not used
        26,
        44,
        70,
        100,
        134,
        172,
        196,
        242,
        292,
        346,
        404,
        466,
        532,
        581,
        655,
        733,
        815,
        901,
        991,
        1085,
        1156,
        1258,
        1364,
        1474,
        1588,
        1706,
        1828,
        1921,
        2051,
        2185,
        2323,
        2465,
        2611,
        2761,
        2876,
        3034,
        3196,
        3362,
        3532,
        3706
      ];
      exports.getSymbolSize = function getSymbolSize(version) {
        if (!version) throw new Error('"version" cannot be null or undefined');
        if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
        return version * 4 + 17;
      };
      exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
        return CODEWORDS_COUNT[version];
      };
      exports.getBCHDigit = function(data2) {
        let digit = 0;
        while (data2 !== 0) {
          digit++;
          data2 >>>= 1;
        }
        return digit;
      };
      exports.setToSJISFunction = function setToSJISFunction(f) {
        if (typeof f !== "function") {
          throw new Error('"toSJISFunc" is not a valid function.');
        }
        toSJISFunction = f;
      };
      exports.isKanjiModeEnabled = function() {
        return typeof toSJISFunction !== "undefined";
      };
      exports.toSJIS = function toSJIS(kanji) {
        return toSJISFunction(kanji);
      };
    }
  });

  // node_modules/qrcode/lib/core/error-correction-level.js
  var require_error_correction_level = __commonJS({
    "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
      exports.L = { bit: 1 };
      exports.M = { bit: 0 };
      exports.Q = { bit: 3 };
      exports.H = { bit: 2 };
      function fromString(string) {
        if (typeof string !== "string") {
          throw new Error("Param is not a string");
        }
        const lcStr = string.toLowerCase();
        switch (lcStr) {
          case "l":
          case "low":
            return exports.L;
          case "m":
          case "medium":
            return exports.M;
          case "q":
          case "quartile":
            return exports.Q;
          case "h":
          case "high":
            return exports.H;
          default:
            throw new Error("Unknown EC Level: " + string);
        }
      }
      exports.isValid = function isValid(level) {
        return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
      };
      exports.from = function from(value, defaultValue) {
        if (exports.isValid(value)) {
          return value;
        }
        try {
          return fromString(value);
        } catch (e) {
          return defaultValue;
        }
      };
    }
  });

  // node_modules/qrcode/lib/core/bit-buffer.js
  var require_bit_buffer = __commonJS({
    "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
      function BitBuffer() {
        this.buffer = [];
        this.length = 0;
      }
      BitBuffer.prototype = {
        get: function(index) {
          const bufIndex = Math.floor(index / 8);
          return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
        },
        put: function(num, length) {
          for (let i = 0; i < length; i++) {
            this.putBit((num >>> length - i - 1 & 1) === 1);
          }
        },
        getLengthInBits: function() {
          return this.length;
        },
        putBit: function(bit) {
          const bufIndex = Math.floor(this.length / 8);
          if (this.buffer.length <= bufIndex) {
            this.buffer.push(0);
          }
          if (bit) {
            this.buffer[bufIndex] |= 128 >>> this.length % 8;
          }
          this.length++;
        }
      };
      module.exports = BitBuffer;
    }
  });

  // node_modules/qrcode/lib/core/bit-matrix.js
  var require_bit_matrix = __commonJS({
    "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
      function BitMatrix(size) {
        if (!size || size < 1) {
          throw new Error("BitMatrix size must be defined and greater than 0");
        }
        this.size = size;
        this.data = new Uint8Array(size * size);
        this.reservedBit = new Uint8Array(size * size);
      }
      BitMatrix.prototype.set = function(row, col, value, reserved) {
        const index = row * this.size + col;
        this.data[index] = value;
        if (reserved) this.reservedBit[index] = true;
      };
      BitMatrix.prototype.get = function(row, col) {
        return this.data[row * this.size + col];
      };
      BitMatrix.prototype.xor = function(row, col, value) {
        this.data[row * this.size + col] ^= value;
      };
      BitMatrix.prototype.isReserved = function(row, col) {
        return this.reservedBit[row * this.size + col];
      };
      module.exports = BitMatrix;
    }
  });

  // node_modules/qrcode/lib/core/alignment-pattern.js
  var require_alignment_pattern = __commonJS({
    "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
      var getSymbolSize = require_utils().getSymbolSize;
      exports.getRowColCoords = function getRowColCoords(version) {
        if (version === 1) return [];
        const posCount = Math.floor(version / 7) + 2;
        const size = getSymbolSize(version);
        const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
        const positions = [size - 7];
        for (let i = 1; i < posCount - 1; i++) {
          positions[i] = positions[i - 1] - intervals;
        }
        positions.push(6);
        return positions.reverse();
      };
      exports.getPositions = function getPositions(version) {
        const coords = [];
        const pos = exports.getRowColCoords(version);
        const posLength = pos.length;
        for (let i = 0; i < posLength; i++) {
          for (let j = 0; j < posLength; j++) {
            if (i === 0 && j === 0 || // top-left
            i === 0 && j === posLength - 1 || // bottom-left
            i === posLength - 1 && j === 0) {
              continue;
            }
            coords.push([pos[i], pos[j]]);
          }
        }
        return coords;
      };
    }
  });

  // node_modules/qrcode/lib/core/finder-pattern.js
  var require_finder_pattern = __commonJS({
    "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
      var getSymbolSize = require_utils().getSymbolSize;
      var FINDER_PATTERN_SIZE = 7;
      exports.getPositions = function getPositions(version) {
        const size = getSymbolSize(version);
        return [
          // top-left
          [0, 0],
          // top-right
          [size - FINDER_PATTERN_SIZE, 0],
          // bottom-left
          [0, size - FINDER_PATTERN_SIZE]
        ];
      };
    }
  });

  // node_modules/qrcode/lib/core/mask-pattern.js
  var require_mask_pattern = __commonJS({
    "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
      exports.Patterns = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
      };
      var PenaltyScores = {
        N1: 3,
        N2: 3,
        N3: 40,
        N4: 10
      };
      exports.isValid = function isValid(mask) {
        return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
      };
      exports.from = function from(value) {
        return exports.isValid(value) ? parseInt(value, 10) : void 0;
      };
      exports.getPenaltyN1 = function getPenaltyN1(data2) {
        const size = data2.size;
        let points = 0;
        let sameCountCol = 0;
        let sameCountRow = 0;
        let lastCol = null;
        let lastRow = null;
        for (let row = 0; row < size; row++) {
          sameCountCol = sameCountRow = 0;
          lastCol = lastRow = null;
          for (let col = 0; col < size; col++) {
            let module2 = data2.get(row, col);
            if (module2 === lastCol) {
              sameCountCol++;
            } else {
              if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
              lastCol = module2;
              sameCountCol = 1;
            }
            module2 = data2.get(col, row);
            if (module2 === lastRow) {
              sameCountRow++;
            } else {
              if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
              lastRow = module2;
              sameCountRow = 1;
            }
          }
          if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
          if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
        }
        return points;
      };
      exports.getPenaltyN2 = function getPenaltyN2(data2) {
        const size = data2.size;
        let points = 0;
        for (let row = 0; row < size - 1; row++) {
          for (let col = 0; col < size - 1; col++) {
            const last = data2.get(row, col) + data2.get(row, col + 1) + data2.get(row + 1, col) + data2.get(row + 1, col + 1);
            if (last === 4 || last === 0) points++;
          }
        }
        return points * PenaltyScores.N2;
      };
      exports.getPenaltyN3 = function getPenaltyN3(data2) {
        const size = data2.size;
        let points = 0;
        let bitsCol = 0;
        let bitsRow = 0;
        for (let row = 0; row < size; row++) {
          bitsCol = bitsRow = 0;
          for (let col = 0; col < size; col++) {
            bitsCol = bitsCol << 1 & 2047 | data2.get(row, col);
            if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
            bitsRow = bitsRow << 1 & 2047 | data2.get(col, row);
            if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
          }
        }
        return points * PenaltyScores.N3;
      };
      exports.getPenaltyN4 = function getPenaltyN4(data2) {
        let darkCount = 0;
        const modulesCount = data2.data.length;
        for (let i = 0; i < modulesCount; i++) darkCount += data2.data[i];
        const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
        return k * PenaltyScores.N4;
      };
      function getMaskAt(maskPattern, i, j) {
        switch (maskPattern) {
          case exports.Patterns.PATTERN000:
            return (i + j) % 2 === 0;
          case exports.Patterns.PATTERN001:
            return i % 2 === 0;
          case exports.Patterns.PATTERN010:
            return j % 3 === 0;
          case exports.Patterns.PATTERN011:
            return (i + j) % 3 === 0;
          case exports.Patterns.PATTERN100:
            return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
          case exports.Patterns.PATTERN101:
            return i * j % 2 + i * j % 3 === 0;
          case exports.Patterns.PATTERN110:
            return (i * j % 2 + i * j % 3) % 2 === 0;
          case exports.Patterns.PATTERN111:
            return (i * j % 3 + (i + j) % 2) % 2 === 0;
          default:
            throw new Error("bad maskPattern:" + maskPattern);
        }
      }
      exports.applyMask = function applyMask(pattern, data2) {
        const size = data2.size;
        for (let col = 0; col < size; col++) {
          for (let row = 0; row < size; row++) {
            if (data2.isReserved(row, col)) continue;
            data2.xor(row, col, getMaskAt(pattern, row, col));
          }
        }
      };
      exports.getBestMask = function getBestMask(data2, setupFormatFunc) {
        const numPatterns = Object.keys(exports.Patterns).length;
        let bestPattern = 0;
        let lowerPenalty = Infinity;
        for (let p = 0; p < numPatterns; p++) {
          setupFormatFunc(p);
          exports.applyMask(p, data2);
          const penalty = exports.getPenaltyN1(data2) + exports.getPenaltyN2(data2) + exports.getPenaltyN3(data2) + exports.getPenaltyN4(data2);
          exports.applyMask(p, data2);
          if (penalty < lowerPenalty) {
            lowerPenalty = penalty;
            bestPattern = p;
          }
        }
        return bestPattern;
      };
    }
  });

  // node_modules/qrcode/lib/core/error-correction-code.js
  var require_error_correction_code = __commonJS({
    "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
      var ECLevel = require_error_correction_level();
      var EC_BLOCKS_TABLE = [
        // L  M  Q  H
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        2,
        2,
        1,
        2,
        2,
        4,
        1,
        2,
        4,
        4,
        2,
        4,
        4,
        4,
        2,
        4,
        6,
        5,
        2,
        4,
        6,
        6,
        2,
        5,
        8,
        8,
        4,
        5,
        8,
        8,
        4,
        5,
        8,
        11,
        4,
        8,
        10,
        11,
        4,
        9,
        12,
        16,
        4,
        9,
        16,
        16,
        6,
        10,
        12,
        18,
        6,
        10,
        17,
        16,
        6,
        11,
        16,
        19,
        6,
        13,
        18,
        21,
        7,
        14,
        21,
        25,
        8,
        16,
        20,
        25,
        8,
        17,
        23,
        25,
        9,
        17,
        23,
        34,
        9,
        18,
        25,
        30,
        10,
        20,
        27,
        32,
        12,
        21,
        29,
        35,
        12,
        23,
        34,
        37,
        12,
        25,
        34,
        40,
        13,
        26,
        35,
        42,
        14,
        28,
        38,
        45,
        15,
        29,
        40,
        48,
        16,
        31,
        43,
        51,
        17,
        33,
        45,
        54,
        18,
        35,
        48,
        57,
        19,
        37,
        51,
        60,
        19,
        38,
        53,
        63,
        20,
        40,
        56,
        66,
        21,
        43,
        59,
        70,
        22,
        45,
        62,
        74,
        24,
        47,
        65,
        77,
        25,
        49,
        68,
        81
      ];
      var EC_CODEWORDS_TABLE = [
        // L  M  Q  H
        7,
        10,
        13,
        17,
        10,
        16,
        22,
        28,
        15,
        26,
        36,
        44,
        20,
        36,
        52,
        64,
        26,
        48,
        72,
        88,
        36,
        64,
        96,
        112,
        40,
        72,
        108,
        130,
        48,
        88,
        132,
        156,
        60,
        110,
        160,
        192,
        72,
        130,
        192,
        224,
        80,
        150,
        224,
        264,
        96,
        176,
        260,
        308,
        104,
        198,
        288,
        352,
        120,
        216,
        320,
        384,
        132,
        240,
        360,
        432,
        144,
        280,
        408,
        480,
        168,
        308,
        448,
        532,
        180,
        338,
        504,
        588,
        196,
        364,
        546,
        650,
        224,
        416,
        600,
        700,
        224,
        442,
        644,
        750,
        252,
        476,
        690,
        816,
        270,
        504,
        750,
        900,
        300,
        560,
        810,
        960,
        312,
        588,
        870,
        1050,
        336,
        644,
        952,
        1110,
        360,
        700,
        1020,
        1200,
        390,
        728,
        1050,
        1260,
        420,
        784,
        1140,
        1350,
        450,
        812,
        1200,
        1440,
        480,
        868,
        1290,
        1530,
        510,
        924,
        1350,
        1620,
        540,
        980,
        1440,
        1710,
        570,
        1036,
        1530,
        1800,
        570,
        1064,
        1590,
        1890,
        600,
        1120,
        1680,
        1980,
        630,
        1204,
        1770,
        2100,
        660,
        1260,
        1860,
        2220,
        720,
        1316,
        1950,
        2310,
        750,
        1372,
        2040,
        2430
      ];
      exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
        switch (errorCorrectionLevel) {
          case ECLevel.L:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
          case ECLevel.M:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
          case ECLevel.Q:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
          case ECLevel.H:
            return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
          default:
            return void 0;
        }
      };
      exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
        switch (errorCorrectionLevel) {
          case ECLevel.L:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
          case ECLevel.M:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
          case ECLevel.Q:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
          case ECLevel.H:
            return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
          default:
            return void 0;
        }
      };
    }
  });

  // node_modules/qrcode/lib/core/galois-field.js
  var require_galois_field = __commonJS({
    "node_modules/qrcode/lib/core/galois-field.js"(exports) {
      var EXP_TABLE = new Uint8Array(512);
      var LOG_TABLE = new Uint8Array(256);
      (function initTables() {
        let x = 1;
        for (let i = 0; i < 255; i++) {
          EXP_TABLE[i] = x;
          LOG_TABLE[x] = i;
          x <<= 1;
          if (x & 256) {
            x ^= 285;
          }
        }
        for (let i = 255; i < 512; i++) {
          EXP_TABLE[i] = EXP_TABLE[i - 255];
        }
      })();
      exports.log = function log(n) {
        if (n < 1) throw new Error("log(" + n + ")");
        return LOG_TABLE[n];
      };
      exports.exp = function exp(n) {
        return EXP_TABLE[n];
      };
      exports.mul = function mul(x, y) {
        if (x === 0 || y === 0) return 0;
        return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
      };
    }
  });

  // node_modules/qrcode/lib/core/polynomial.js
  var require_polynomial = __commonJS({
    "node_modules/qrcode/lib/core/polynomial.js"(exports) {
      var GF = require_galois_field();
      exports.mul = function mul(p1, p2) {
        const coeff = new Uint8Array(p1.length + p2.length - 1);
        for (let i = 0; i < p1.length; i++) {
          for (let j = 0; j < p2.length; j++) {
            coeff[i + j] ^= GF.mul(p1[i], p2[j]);
          }
        }
        return coeff;
      };
      exports.mod = function mod(divident, divisor) {
        let result = new Uint8Array(divident);
        while (result.length - divisor.length >= 0) {
          const coeff = result[0];
          for (let i = 0; i < divisor.length; i++) {
            result[i] ^= GF.mul(divisor[i], coeff);
          }
          let offset = 0;
          while (offset < result.length && result[offset] === 0) offset++;
          result = result.slice(offset);
        }
        return result;
      };
      exports.generateECPolynomial = function generateECPolynomial(degree) {
        let poly = new Uint8Array([1]);
        for (let i = 0; i < degree; i++) {
          poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
        }
        return poly;
      };
    }
  });

  // node_modules/qrcode/lib/core/reed-solomon-encoder.js
  var require_reed_solomon_encoder = __commonJS({
    "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
      var Polynomial = require_polynomial();
      function ReedSolomonEncoder(degree) {
        this.genPoly = void 0;
        this.degree = degree;
        if (this.degree) this.initialize(this.degree);
      }
      ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
        this.degree = degree;
        this.genPoly = Polynomial.generateECPolynomial(this.degree);
      };
      ReedSolomonEncoder.prototype.encode = function encode(data2) {
        if (!this.genPoly) {
          throw new Error("Encoder not initialized");
        }
        const paddedData = new Uint8Array(data2.length + this.degree);
        paddedData.set(data2);
        const remainder = Polynomial.mod(paddedData, this.genPoly);
        const start = this.degree - remainder.length;
        if (start > 0) {
          const buff = new Uint8Array(this.degree);
          buff.set(remainder, start);
          return buff;
        }
        return remainder;
      };
      module.exports = ReedSolomonEncoder;
    }
  });

  // node_modules/qrcode/lib/core/version-check.js
  var require_version_check = __commonJS({
    "node_modules/qrcode/lib/core/version-check.js"(exports) {
      exports.isValid = function isValid(version) {
        return !isNaN(version) && version >= 1 && version <= 40;
      };
    }
  });

  // node_modules/qrcode/lib/core/regex.js
  var require_regex = __commonJS({
    "node_modules/qrcode/lib/core/regex.js"(exports) {
      var numeric = "[0-9]+";
      var alphanumeric = "[A-Z $%*+\\-./:]+";
      var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
      kanji = kanji.replace(/u/g, "\\u");
      var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
      exports.KANJI = new RegExp(kanji, "g");
      exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
      exports.BYTE = new RegExp(byte, "g");
      exports.NUMERIC = new RegExp(numeric, "g");
      exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
      var TEST_KANJI = new RegExp("^" + kanji + "$");
      var TEST_NUMERIC = new RegExp("^" + numeric + "$");
      var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
      exports.testKanji = function testKanji(str) {
        return TEST_KANJI.test(str);
      };
      exports.testNumeric = function testNumeric(str) {
        return TEST_NUMERIC.test(str);
      };
      exports.testAlphanumeric = function testAlphanumeric(str) {
        return TEST_ALPHANUMERIC.test(str);
      };
    }
  });

  // node_modules/qrcode/lib/core/mode.js
  var require_mode = __commonJS({
    "node_modules/qrcode/lib/core/mode.js"(exports) {
      var VersionCheck = require_version_check();
      var Regex = require_regex();
      exports.NUMERIC = {
        id: "Numeric",
        bit: 1 << 0,
        ccBits: [10, 12, 14]
      };
      exports.ALPHANUMERIC = {
        id: "Alphanumeric",
        bit: 1 << 1,
        ccBits: [9, 11, 13]
      };
      exports.BYTE = {
        id: "Byte",
        bit: 1 << 2,
        ccBits: [8, 16, 16]
      };
      exports.KANJI = {
        id: "Kanji",
        bit: 1 << 3,
        ccBits: [8, 10, 12]
      };
      exports.MIXED = {
        bit: -1
      };
      exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
        if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
        if (!VersionCheck.isValid(version)) {
          throw new Error("Invalid version: " + version);
        }
        if (version >= 1 && version < 10) return mode.ccBits[0];
        else if (version < 27) return mode.ccBits[1];
        return mode.ccBits[2];
      };
      exports.getBestModeForData = function getBestModeForData(dataStr) {
        if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
        else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
        else if (Regex.testKanji(dataStr)) return exports.KANJI;
        else return exports.BYTE;
      };
      exports.toString = function toString(mode) {
        if (mode && mode.id) return mode.id;
        throw new Error("Invalid mode");
      };
      exports.isValid = function isValid(mode) {
        return mode && mode.bit && mode.ccBits;
      };
      function fromString(string) {
        if (typeof string !== "string") {
          throw new Error("Param is not a string");
        }
        const lcStr = string.toLowerCase();
        switch (lcStr) {
          case "numeric":
            return exports.NUMERIC;
          case "alphanumeric":
            return exports.ALPHANUMERIC;
          case "kanji":
            return exports.KANJI;
          case "byte":
            return exports.BYTE;
          default:
            throw new Error("Unknown mode: " + string);
        }
      }
      exports.from = function from(value, defaultValue) {
        if (exports.isValid(value)) {
          return value;
        }
        try {
          return fromString(value);
        } catch (e) {
          return defaultValue;
        }
      };
    }
  });

  // node_modules/qrcode/lib/core/version.js
  var require_version = __commonJS({
    "node_modules/qrcode/lib/core/version.js"(exports) {
      var Utils = require_utils();
      var ECCode = require_error_correction_code();
      var ECLevel = require_error_correction_level();
      var Mode = require_mode();
      var VersionCheck = require_version_check();
      var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
      var G18_BCH = Utils.getBCHDigit(G18);
      function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
        for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
          if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
            return currentVersion;
          }
        }
        return void 0;
      }
      function getReservedBitsCount(mode, version) {
        return Mode.getCharCountIndicator(mode, version) + 4;
      }
      function getTotalBitsFromDataArray(segments, version) {
        let totalBits = 0;
        segments.forEach(function(data2) {
          const reservedBits = getReservedBitsCount(data2.mode, version);
          totalBits += reservedBits + data2.getBitsLength();
        });
        return totalBits;
      }
      function getBestVersionForMixedData(segments, errorCorrectionLevel) {
        for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
          const length = getTotalBitsFromDataArray(segments, currentVersion);
          if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
            return currentVersion;
          }
        }
        return void 0;
      }
      exports.from = function from(value, defaultValue) {
        if (VersionCheck.isValid(value)) {
          return parseInt(value, 10);
        }
        return defaultValue;
      };
      exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
        if (!VersionCheck.isValid(version)) {
          throw new Error("Invalid QR Code version");
        }
        if (typeof mode === "undefined") mode = Mode.BYTE;
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
        if (mode === Mode.MIXED) return dataTotalCodewordsBits;
        const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
        switch (mode) {
          case Mode.NUMERIC:
            return Math.floor(usableBits / 10 * 3);
          case Mode.ALPHANUMERIC:
            return Math.floor(usableBits / 11 * 2);
          case Mode.KANJI:
            return Math.floor(usableBits / 13);
          case Mode.BYTE:
          default:
            return Math.floor(usableBits / 8);
        }
      };
      exports.getBestVersionForData = function getBestVersionForData(data2, errorCorrectionLevel) {
        let seg;
        const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
        if (Array.isArray(data2)) {
          if (data2.length > 1) {
            return getBestVersionForMixedData(data2, ecl);
          }
          if (data2.length === 0) {
            return 1;
          }
          seg = data2[0];
        } else {
          seg = data2;
        }
        return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
      };
      exports.getEncodedBits = function getEncodedBits(version) {
        if (!VersionCheck.isValid(version) || version < 7) {
          throw new Error("Invalid QR Code version");
        }
        let d = version << 12;
        while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
          d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
        }
        return version << 12 | d;
      };
    }
  });

  // node_modules/qrcode/lib/core/format-info.js
  var require_format_info = __commonJS({
    "node_modules/qrcode/lib/core/format-info.js"(exports) {
      var Utils = require_utils();
      var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
      var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
      var G15_BCH = Utils.getBCHDigit(G15);
      exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
        const data2 = errorCorrectionLevel.bit << 3 | mask;
        let d = data2 << 10;
        while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
          d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
        }
        return (data2 << 10 | d) ^ G15_MASK;
      };
    }
  });

  // node_modules/qrcode/lib/core/numeric-data.js
  var require_numeric_data = __commonJS({
    "node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
      var Mode = require_mode();
      function NumericData(data2) {
        this.mode = Mode.NUMERIC;
        this.data = data2.toString();
      }
      NumericData.getBitsLength = function getBitsLength(length) {
        return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
      };
      NumericData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      NumericData.prototype.getBitsLength = function getBitsLength() {
        return NumericData.getBitsLength(this.data.length);
      };
      NumericData.prototype.write = function write(bitBuffer) {
        let i, group, value;
        for (i = 0; i + 3 <= this.data.length; i += 3) {
          group = this.data.substr(i, 3);
          value = parseInt(group, 10);
          bitBuffer.put(value, 10);
        }
        const remainingNum = this.data.length - i;
        if (remainingNum > 0) {
          group = this.data.substr(i);
          value = parseInt(group, 10);
          bitBuffer.put(value, remainingNum * 3 + 1);
        }
      };
      module.exports = NumericData;
    }
  });

  // node_modules/qrcode/lib/core/alphanumeric-data.js
  var require_alphanumeric_data = __commonJS({
    "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
      var Mode = require_mode();
      var ALPHA_NUM_CHARS = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
        " ",
        "$",
        "%",
        "*",
        "+",
        "-",
        ".",
        "/",
        ":"
      ];
      function AlphanumericData(data2) {
        this.mode = Mode.ALPHANUMERIC;
        this.data = data2;
      }
      AlphanumericData.getBitsLength = function getBitsLength(length) {
        return 11 * Math.floor(length / 2) + 6 * (length % 2);
      };
      AlphanumericData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      AlphanumericData.prototype.getBitsLength = function getBitsLength() {
        return AlphanumericData.getBitsLength(this.data.length);
      };
      AlphanumericData.prototype.write = function write(bitBuffer) {
        let i;
        for (i = 0; i + 2 <= this.data.length; i += 2) {
          let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
          value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
          bitBuffer.put(value, 11);
        }
        if (this.data.length % 2) {
          bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
        }
      };
      module.exports = AlphanumericData;
    }
  });

  // node_modules/qrcode/lib/core/byte-data.js
  var require_byte_data = __commonJS({
    "node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
      var Mode = require_mode();
      function ByteData(data2) {
        this.mode = Mode.BYTE;
        if (typeof data2 === "string") {
          this.data = new TextEncoder().encode(data2);
        } else {
          this.data = new Uint8Array(data2);
        }
      }
      ByteData.getBitsLength = function getBitsLength(length) {
        return length * 8;
      };
      ByteData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      ByteData.prototype.getBitsLength = function getBitsLength() {
        return ByteData.getBitsLength(this.data.length);
      };
      ByteData.prototype.write = function(bitBuffer) {
        for (let i = 0, l = this.data.length; i < l; i++) {
          bitBuffer.put(this.data[i], 8);
        }
      };
      module.exports = ByteData;
    }
  });

  // node_modules/qrcode/lib/core/kanji-data.js
  var require_kanji_data = __commonJS({
    "node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
      var Mode = require_mode();
      var Utils = require_utils();
      function KanjiData(data2) {
        this.mode = Mode.KANJI;
        this.data = data2;
      }
      KanjiData.getBitsLength = function getBitsLength(length) {
        return length * 13;
      };
      KanjiData.prototype.getLength = function getLength() {
        return this.data.length;
      };
      KanjiData.prototype.getBitsLength = function getBitsLength() {
        return KanjiData.getBitsLength(this.data.length);
      };
      KanjiData.prototype.write = function(bitBuffer) {
        let i;
        for (i = 0; i < this.data.length; i++) {
          let value = Utils.toSJIS(this.data[i]);
          if (value >= 33088 && value <= 40956) {
            value -= 33088;
          } else if (value >= 57408 && value <= 60351) {
            value -= 49472;
          } else {
            throw new Error(
              "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
            );
          }
          value = (value >>> 8 & 255) * 192 + (value & 255);
          bitBuffer.put(value, 13);
        }
      };
      module.exports = KanjiData;
    }
  });

  // node_modules/dijkstrajs/dijkstra.js
  var require_dijkstra = __commonJS({
    "node_modules/dijkstrajs/dijkstra.js"(exports, module) {
      "use strict";
      var dijkstra = {
        single_source_shortest_paths: function(graph, s, d) {
          var predecessors = {};
          var costs = {};
          costs[s] = 0;
          var open = dijkstra.PriorityQueue.make();
          open.push(s, 0);
          var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
          while (!open.empty()) {
            closest = open.pop();
            u = closest.value;
            cost_of_s_to_u = closest.cost;
            adjacent_nodes = graph[u] || {};
            for (v in adjacent_nodes) {
              if (adjacent_nodes.hasOwnProperty(v)) {
                cost_of_e = adjacent_nodes[v];
                cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
                cost_of_s_to_v = costs[v];
                first_visit = typeof costs[v] === "undefined";
                if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                  costs[v] = cost_of_s_to_u_plus_cost_of_e;
                  open.push(v, cost_of_s_to_u_plus_cost_of_e);
                  predecessors[v] = u;
                }
              }
            }
          }
          if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
            var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
            throw new Error(msg);
          }
          return predecessors;
        },
        extract_shortest_path_from_predecessor_list: function(predecessors, d) {
          var nodes = [];
          var u = d;
          var predecessor;
          while (u) {
            nodes.push(u);
            predecessor = predecessors[u];
            u = predecessors[u];
          }
          nodes.reverse();
          return nodes;
        },
        find_path: function(graph, s, d) {
          var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
          return dijkstra.extract_shortest_path_from_predecessor_list(
            predecessors,
            d
          );
        },
        /**
         * A very naive priority queue implementation.
         */
        PriorityQueue: {
          make: function(opts) {
            var T = dijkstra.PriorityQueue, t = {}, key;
            opts = opts || {};
            for (key in T) {
              if (T.hasOwnProperty(key)) {
                t[key] = T[key];
              }
            }
            t.queue = [];
            t.sorter = opts.sorter || T.default_sorter;
            return t;
          },
          default_sorter: function(a, b) {
            return a.cost - b.cost;
          },
          /**
           * Add a new item to the queue and ensure the highest priority element
           * is at the front of the queue.
           */
          push: function(value, cost) {
            var item = { value, cost };
            this.queue.push(item);
            this.queue.sort(this.sorter);
          },
          /**
           * Return the highest priority element in the queue.
           */
          pop: function() {
            return this.queue.shift();
          },
          empty: function() {
            return this.queue.length === 0;
          }
        }
      };
      if (typeof module !== "undefined") {
        module.exports = dijkstra;
      }
    }
  });

  // node_modules/qrcode/lib/core/segments.js
  var require_segments = __commonJS({
    "node_modules/qrcode/lib/core/segments.js"(exports) {
      var Mode = require_mode();
      var NumericData = require_numeric_data();
      var AlphanumericData = require_alphanumeric_data();
      var ByteData = require_byte_data();
      var KanjiData = require_kanji_data();
      var Regex = require_regex();
      var Utils = require_utils();
      var dijkstra = require_dijkstra();
      function getStringByteLength(str) {
        return unescape(encodeURIComponent(str)).length;
      }
      function getSegments(regex, mode, str) {
        const segments = [];
        let result;
        while ((result = regex.exec(str)) !== null) {
          segments.push({
            data: result[0],
            index: result.index,
            mode,
            length: result[0].length
          });
        }
        return segments;
      }
      function getSegmentsFromString(dataStr) {
        const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
        const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
        let byteSegs;
        let kanjiSegs;
        if (Utils.isKanjiModeEnabled()) {
          byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
          kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
        } else {
          byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
          kanjiSegs = [];
        }
        const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
        return segs.sort(function(s1, s2) {
          return s1.index - s2.index;
        }).map(function(obj) {
          return {
            data: obj.data,
            mode: obj.mode,
            length: obj.length
          };
        });
      }
      function getSegmentBitsLength(length, mode) {
        switch (mode) {
          case Mode.NUMERIC:
            return NumericData.getBitsLength(length);
          case Mode.ALPHANUMERIC:
            return AlphanumericData.getBitsLength(length);
          case Mode.KANJI:
            return KanjiData.getBitsLength(length);
          case Mode.BYTE:
            return ByteData.getBitsLength(length);
        }
      }
      function mergeSegments(segs) {
        return segs.reduce(function(acc, curr) {
          const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
          if (prevSeg && prevSeg.mode === curr.mode) {
            acc[acc.length - 1].data += curr.data;
            return acc;
          }
          acc.push(curr);
          return acc;
        }, []);
      }
      function buildNodes(segs) {
        const nodes = [];
        for (let i = 0; i < segs.length; i++) {
          const seg = segs[i];
          switch (seg.mode) {
            case Mode.NUMERIC:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
                { data: seg.data, mode: Mode.BYTE, length: seg.length }
              ]);
              break;
            case Mode.ALPHANUMERIC:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.BYTE, length: seg.length }
              ]);
              break;
            case Mode.KANJI:
              nodes.push([
                seg,
                { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
              ]);
              break;
            case Mode.BYTE:
              nodes.push([
                { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
              ]);
          }
        }
        return nodes;
      }
      function buildGraph(nodes, version) {
        const table = {};
        const graph = { start: {} };
        let prevNodeIds = ["start"];
        for (let i = 0; i < nodes.length; i++) {
          const nodeGroup = nodes[i];
          const currentNodeIds = [];
          for (let j = 0; j < nodeGroup.length; j++) {
            const node = nodeGroup[j];
            const key = "" + i + j;
            currentNodeIds.push(key);
            table[key] = { node, lastCount: 0 };
            graph[key] = {};
            for (let n = 0; n < prevNodeIds.length; n++) {
              const prevNodeId = prevNodeIds[n];
              if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
                graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
                table[prevNodeId].lastCount += node.length;
              } else {
                if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
                graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
              }
            }
          }
          prevNodeIds = currentNodeIds;
        }
        for (let n = 0; n < prevNodeIds.length; n++) {
          graph[prevNodeIds[n]].end = 0;
        }
        return { map: graph, table };
      }
      function buildSingleSegment(data2, modesHint) {
        let mode;
        const bestMode = Mode.getBestModeForData(data2);
        mode = Mode.from(modesHint, bestMode);
        if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
          throw new Error('"' + data2 + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
        }
        if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
          mode = Mode.BYTE;
        }
        switch (mode) {
          case Mode.NUMERIC:
            return new NumericData(data2);
          case Mode.ALPHANUMERIC:
            return new AlphanumericData(data2);
          case Mode.KANJI:
            return new KanjiData(data2);
          case Mode.BYTE:
            return new ByteData(data2);
        }
      }
      exports.fromArray = function fromArray(array) {
        return array.reduce(function(acc, seg) {
          if (typeof seg === "string") {
            acc.push(buildSingleSegment(seg, null));
          } else if (seg.data) {
            acc.push(buildSingleSegment(seg.data, seg.mode));
          }
          return acc;
        }, []);
      };
      exports.fromString = function fromString(data2, version) {
        const segs = getSegmentsFromString(data2, Utils.isKanjiModeEnabled());
        const nodes = buildNodes(segs);
        const graph = buildGraph(nodes, version);
        const path = dijkstra.find_path(graph.map, "start", "end");
        const optimizedSegs = [];
        for (let i = 1; i < path.length - 1; i++) {
          optimizedSegs.push(graph.table[path[i]].node);
        }
        return exports.fromArray(mergeSegments(optimizedSegs));
      };
      exports.rawSplit = function rawSplit(data2) {
        return exports.fromArray(
          getSegmentsFromString(data2, Utils.isKanjiModeEnabled())
        );
      };
    }
  });

  // node_modules/qrcode/lib/core/qrcode.js
  var require_qrcode = __commonJS({
    "node_modules/qrcode/lib/core/qrcode.js"(exports) {
      var Utils = require_utils();
      var ECLevel = require_error_correction_level();
      var BitBuffer = require_bit_buffer();
      var BitMatrix = require_bit_matrix();
      var AlignmentPattern = require_alignment_pattern();
      var FinderPattern = require_finder_pattern();
      var MaskPattern = require_mask_pattern();
      var ECCode = require_error_correction_code();
      var ReedSolomonEncoder = require_reed_solomon_encoder();
      var Version = require_version();
      var FormatInfo = require_format_info();
      var Mode = require_mode();
      var Segments = require_segments();
      function setupFinderPattern(matrix, version) {
        const size = matrix.size;
        const pos = FinderPattern.getPositions(version);
        for (let i = 0; i < pos.length; i++) {
          const row = pos[i][0];
          const col = pos[i][1];
          for (let r = -1; r <= 7; r++) {
            if (row + r <= -1 || size <= row + r) continue;
            for (let c = -1; c <= 7; c++) {
              if (col + c <= -1 || size <= col + c) continue;
              if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
                matrix.set(row + r, col + c, true, true);
              } else {
                matrix.set(row + r, col + c, false, true);
              }
            }
          }
        }
      }
      function setupTimingPattern(matrix) {
        const size = matrix.size;
        for (let r = 8; r < size - 8; r++) {
          const value = r % 2 === 0;
          matrix.set(r, 6, value, true);
          matrix.set(6, r, value, true);
        }
      }
      function setupAlignmentPattern(matrix, version) {
        const pos = AlignmentPattern.getPositions(version);
        for (let i = 0; i < pos.length; i++) {
          const row = pos[i][0];
          const col = pos[i][1];
          for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
              if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
                matrix.set(row + r, col + c, true, true);
              } else {
                matrix.set(row + r, col + c, false, true);
              }
            }
          }
        }
      }
      function setupVersionInfo(matrix, version) {
        const size = matrix.size;
        const bits = Version.getEncodedBits(version);
        let row, col, mod;
        for (let i = 0; i < 18; i++) {
          row = Math.floor(i / 3);
          col = i % 3 + size - 8 - 3;
          mod = (bits >> i & 1) === 1;
          matrix.set(row, col, mod, true);
          matrix.set(col, row, mod, true);
        }
      }
      function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
        const size = matrix.size;
        const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
        let i, mod;
        for (i = 0; i < 15; i++) {
          mod = (bits >> i & 1) === 1;
          if (i < 6) {
            matrix.set(i, 8, mod, true);
          } else if (i < 8) {
            matrix.set(i + 1, 8, mod, true);
          } else {
            matrix.set(size - 15 + i, 8, mod, true);
          }
          if (i < 8) {
            matrix.set(8, size - i - 1, mod, true);
          } else if (i < 9) {
            matrix.set(8, 15 - i - 1 + 1, mod, true);
          } else {
            matrix.set(8, 15 - i - 1, mod, true);
          }
        }
        matrix.set(size - 8, 8, 1, true);
      }
      function setupData(matrix, data2) {
        const size = matrix.size;
        let inc = -1;
        let row = size - 1;
        let bitIndex = 7;
        let byteIndex = 0;
        for (let col = size - 1; col > 0; col -= 2) {
          if (col === 6) col--;
          while (true) {
            for (let c = 0; c < 2; c++) {
              if (!matrix.isReserved(row, col - c)) {
                let dark = false;
                if (byteIndex < data2.length) {
                  dark = (data2[byteIndex] >>> bitIndex & 1) === 1;
                }
                matrix.set(row, col - c, dark);
                bitIndex--;
                if (bitIndex === -1) {
                  byteIndex++;
                  bitIndex = 7;
                }
              }
            }
            row += inc;
            if (row < 0 || size <= row) {
              row -= inc;
              inc = -inc;
              break;
            }
          }
        }
      }
      function createData(version, errorCorrectionLevel, segments) {
        const buffer = new BitBuffer();
        segments.forEach(function(data2) {
          buffer.put(data2.mode.bit, 4);
          buffer.put(data2.getLength(), Mode.getCharCountIndicator(data2.mode, version));
          data2.write(buffer);
        });
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
        if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
          buffer.put(0, 4);
        }
        while (buffer.getLengthInBits() % 8 !== 0) {
          buffer.putBit(0);
        }
        const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
        for (let i = 0; i < remainingByte; i++) {
          buffer.put(i % 2 ? 17 : 236, 8);
        }
        return createCodewords(buffer, version, errorCorrectionLevel);
      }
      function createCodewords(bitBuffer, version, errorCorrectionLevel) {
        const totalCodewords = Utils.getSymbolTotalCodewords(version);
        const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
        const dataTotalCodewords = totalCodewords - ecTotalCodewords;
        const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
        const blocksInGroup2 = totalCodewords % ecTotalBlocks;
        const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
        const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
        const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
        const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
        const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
        const rs = new ReedSolomonEncoder(ecCount);
        let offset = 0;
        const dcData = new Array(ecTotalBlocks);
        const ecData = new Array(ecTotalBlocks);
        let maxDataSize = 0;
        const buffer = new Uint8Array(bitBuffer.buffer);
        for (let b = 0; b < ecTotalBlocks; b++) {
          const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
          dcData[b] = buffer.slice(offset, offset + dataSize);
          ecData[b] = rs.encode(dcData[b]);
          offset += dataSize;
          maxDataSize = Math.max(maxDataSize, dataSize);
        }
        const data2 = new Uint8Array(totalCodewords);
        let index = 0;
        let i, r;
        for (i = 0; i < maxDataSize; i++) {
          for (r = 0; r < ecTotalBlocks; r++) {
            if (i < dcData[r].length) {
              data2[index++] = dcData[r][i];
            }
          }
        }
        for (i = 0; i < ecCount; i++) {
          for (r = 0; r < ecTotalBlocks; r++) {
            data2[index++] = ecData[r][i];
          }
        }
        return data2;
      }
      function createSymbol(data2, version, errorCorrectionLevel, maskPattern) {
        let segments;
        if (Array.isArray(data2)) {
          segments = Segments.fromArray(data2);
        } else if (typeof data2 === "string") {
          let estimatedVersion = version;
          if (!estimatedVersion) {
            const rawSegments = Segments.rawSplit(data2);
            estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
          }
          segments = Segments.fromString(data2, estimatedVersion || 40);
        } else {
          throw new Error("Invalid data");
        }
        const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
        if (!bestVersion) {
          throw new Error("The amount of data is too big to be stored in a QR Code");
        }
        if (!version) {
          version = bestVersion;
        } else if (version < bestVersion) {
          throw new Error(
            "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
          );
        }
        const dataBits = createData(version, errorCorrectionLevel, segments);
        const moduleCount = Utils.getSymbolSize(version);
        const modules = new BitMatrix(moduleCount);
        setupFinderPattern(modules, version);
        setupTimingPattern(modules);
        setupAlignmentPattern(modules, version);
        setupFormatInfo(modules, errorCorrectionLevel, 0);
        if (version >= 7) {
          setupVersionInfo(modules, version);
        }
        setupData(modules, dataBits);
        if (isNaN(maskPattern)) {
          maskPattern = MaskPattern.getBestMask(
            modules,
            setupFormatInfo.bind(null, modules, errorCorrectionLevel)
          );
        }
        MaskPattern.applyMask(maskPattern, modules);
        setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
        return {
          modules,
          version,
          errorCorrectionLevel,
          maskPattern,
          segments
        };
      }
      exports.create = function create(data2, options) {
        if (typeof data2 === "undefined" || data2 === "") {
          throw new Error("No input text");
        }
        let errorCorrectionLevel = ECLevel.M;
        let version;
        let mask;
        if (typeof options !== "undefined") {
          errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
          version = Version.from(options.version);
          mask = MaskPattern.from(options.maskPattern);
          if (options.toSJISFunc) {
            Utils.setToSJISFunction(options.toSJISFunc);
          }
        }
        return createSymbol(data2, version, errorCorrectionLevel, mask);
      };
    }
  });

  // node_modules/qrcode/lib/renderer/utils.js
  var require_utils2 = __commonJS({
    "node_modules/qrcode/lib/renderer/utils.js"(exports) {
      function hex2rgba(hex) {
        if (typeof hex === "number") {
          hex = hex.toString();
        }
        if (typeof hex !== "string") {
          throw new Error("Color should be defined as hex string");
        }
        let hexCode = hex.slice().replace("#", "").split("");
        if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
          throw new Error("Invalid hex color: " + hex);
        }
        if (hexCode.length === 3 || hexCode.length === 4) {
          hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
            return [c, c];
          }));
        }
        if (hexCode.length === 6) hexCode.push("F", "F");
        const hexValue = parseInt(hexCode.join(""), 16);
        return {
          r: hexValue >> 24 & 255,
          g: hexValue >> 16 & 255,
          b: hexValue >> 8 & 255,
          a: hexValue & 255,
          hex: "#" + hexCode.slice(0, 6).join("")
        };
      }
      exports.getOptions = function getOptions(options) {
        if (!options) options = {};
        if (!options.color) options.color = {};
        const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
        const width = options.width && options.width >= 21 ? options.width : void 0;
        const scale = options.scale || 4;
        return {
          width,
          scale: width ? 4 : scale,
          margin,
          color: {
            dark: hex2rgba(options.color.dark || "#000000ff"),
            light: hex2rgba(options.color.light || "#ffffffff")
          },
          type: options.type,
          rendererOpts: options.rendererOpts || {}
        };
      };
      exports.getScale = function getScale(qrSize, opts) {
        return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
      };
      exports.getImageWidth = function getImageWidth(qrSize, opts) {
        const scale = exports.getScale(qrSize, opts);
        return Math.floor((qrSize + opts.margin * 2) * scale);
      };
      exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
        const size = qr.modules.size;
        const data2 = qr.modules.data;
        const scale = exports.getScale(size, opts);
        const symbolSize = Math.floor((size + opts.margin * 2) * scale);
        const scaledMargin = opts.margin * scale;
        const palette = [opts.color.light, opts.color.dark];
        for (let i = 0; i < symbolSize; i++) {
          for (let j = 0; j < symbolSize; j++) {
            let posDst = (i * symbolSize + j) * 4;
            let pxColor = opts.color.light;
            if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
              const iSrc = Math.floor((i - scaledMargin) / scale);
              const jSrc = Math.floor((j - scaledMargin) / scale);
              pxColor = palette[data2[iSrc * size + jSrc] ? 1 : 0];
            }
            imgData[posDst++] = pxColor.r;
            imgData[posDst++] = pxColor.g;
            imgData[posDst++] = pxColor.b;
            imgData[posDst] = pxColor.a;
          }
        }
      };
    }
  });

  // node_modules/qrcode/lib/renderer/canvas.js
  var require_canvas = __commonJS({
    "node_modules/qrcode/lib/renderer/canvas.js"(exports) {
      var Utils = require_utils2();
      function clearCanvas(ctx, canvas, size) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!canvas.style) canvas.style = {};
        canvas.height = size;
        canvas.width = size;
        canvas.style.height = size + "px";
        canvas.style.width = size + "px";
      }
      function getCanvasElement() {
        try {
          return document.createElement("canvas");
        } catch (e) {
          throw new Error("You need to specify a canvas element");
        }
      }
      exports.render = function render2(qrData, canvas, options) {
        let opts = options;
        let canvasEl = canvas;
        if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
          opts = canvas;
          canvas = void 0;
        }
        if (!canvas) {
          canvasEl = getCanvasElement();
        }
        opts = Utils.getOptions(opts);
        const size = Utils.getImageWidth(qrData.modules.size, opts);
        const ctx = canvasEl.getContext("2d");
        const image = ctx.createImageData(size, size);
        Utils.qrToImageData(image.data, qrData, opts);
        clearCanvas(ctx, canvasEl, size);
        ctx.putImageData(image, 0, 0);
        return canvasEl;
      };
      exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
        let opts = options;
        if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
          opts = canvas;
          canvas = void 0;
        }
        if (!opts) opts = {};
        const canvasEl = exports.render(qrData, canvas, opts);
        const type = opts.type || "image/png";
        const rendererOpts = opts.rendererOpts || {};
        return canvasEl.toDataURL(type, rendererOpts.quality);
      };
    }
  });

  // node_modules/qrcode/lib/renderer/svg-tag.js
  var require_svg_tag = __commonJS({
    "node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
      var Utils = require_utils2();
      function getColorAttrib(color, attrib) {
        const alpha = color.a / 255;
        const str = attrib + '="' + color.hex + '"';
        return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
      }
      function svgCmd(cmd, x, y) {
        let str = cmd + x;
        if (typeof y !== "undefined") str += " " + y;
        return str;
      }
      function qrToPath(data2, size, margin) {
        let path = "";
        let moveBy = 0;
        let newRow = false;
        let lineLength = 0;
        for (let i = 0; i < data2.length; i++) {
          const col = Math.floor(i % size);
          const row = Math.floor(i / size);
          if (!col && !newRow) newRow = true;
          if (data2[i]) {
            lineLength++;
            if (!(i > 0 && col > 0 && data2[i - 1])) {
              path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
              moveBy = 0;
              newRow = false;
            }
            if (!(col + 1 < size && data2[i + 1])) {
              path += svgCmd("h", lineLength);
              lineLength = 0;
            }
          } else {
            moveBy++;
          }
        }
        return path;
      }
      exports.render = function render2(qrData, options, cb) {
        const opts = Utils.getOptions(options);
        const size = qrData.modules.size;
        const data2 = qrData.modules.data;
        const qrcodesize = size + opts.margin * 2;
        const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
        const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data2, size, opts.margin) + '"/>';
        const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
        const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
        const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
        if (typeof cb === "function") {
          cb(null, svgTag);
        }
        return svgTag;
      };
    }
  });

  // node_modules/qrcode/lib/browser.js
  var require_browser = __commonJS({
    "node_modules/qrcode/lib/browser.js"(exports) {
      var canPromise = require_can_promise();
      var QRCode2 = require_qrcode();
      var CanvasRenderer = require_canvas();
      var SvgRenderer = require_svg_tag();
      function renderCanvas(renderFunc, canvas, text, opts, cb) {
        const args = [].slice.call(arguments, 1);
        const argsNum = args.length;
        const isLastArgCb = typeof args[argsNum - 1] === "function";
        if (!isLastArgCb && !canPromise()) {
          throw new Error("Callback required as last argument");
        }
        if (isLastArgCb) {
          if (argsNum < 2) {
            throw new Error("Too few arguments provided");
          }
          if (argsNum === 2) {
            cb = text;
            text = canvas;
            canvas = opts = void 0;
          } else if (argsNum === 3) {
            if (canvas.getContext && typeof cb === "undefined") {
              cb = opts;
              opts = void 0;
            } else {
              cb = opts;
              opts = text;
              text = canvas;
              canvas = void 0;
            }
          }
        } else {
          if (argsNum < 1) {
            throw new Error("Too few arguments provided");
          }
          if (argsNum === 1) {
            text = canvas;
            canvas = opts = void 0;
          } else if (argsNum === 2 && !canvas.getContext) {
            opts = text;
            text = canvas;
            canvas = void 0;
          }
          return new Promise(function(resolve, reject) {
            try {
              const data2 = QRCode2.create(text, opts);
              resolve(renderFunc(data2, canvas, opts));
            } catch (e) {
              reject(e);
            }
          });
        }
        try {
          const data2 = QRCode2.create(text, opts);
          cb(null, renderFunc(data2, canvas, opts));
        } catch (e) {
          cb(e);
        }
      }
      exports.create = QRCode2.create;
      exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
      exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
      exports.toString = renderCanvas.bind(null, function(data2, _, opts) {
        return SvgRenderer.render(data2, opts);
      });
    }
  });

  // restaurant-app.js
  var import_qrcode = __toESM(require_browser(), 1);
  var STORAGE_KEY = "compivox-kitchen-demo-v1";
  var STAFF_ID = "staff";
  var STAFF_PASSWORD = "compivox-demo";
  var ICON_SRC = "/compivox-icon.png";
  var STATUS = {
    received: { label: "\uC8FC\uBB38 \uC811\uC218", short: "\uC811\uC218", tone: "neutral" },
    queued: { label: "\uC870\uB9AC \uB300\uAE30", short: "\uB300\uAE30", tone: "warn" },
    preparing: { label: "\uC870\uB9AC \uC911", short: "\uC870\uB9AC \uC911", tone: "warn" },
    ready: { label: "\uC900\uBE44 \uC644\uB8CC", short: "\uC900\uBE44 \uC644\uB8CC", tone: "good" },
    delivered: { label: "\uC804\uB2EC \uC644\uB8CC", short: "\uC804\uB2EC \uC644\uB8CC", tone: "neutral" },
    canceled: { label: "\uC8FC\uBB38 \uCDE8\uC18C", short: "\uCDE8\uC18C", tone: "bad" }
  };
  var FLOW = ["received", "queued", "preparing", "ready", "delivered"];
  var NAV_ITEMS = [
    ["dashboard", "\uB300\uC2DC\uBCF4\uB4DC"],
    ["orders", "\uC8FC\uBB38 \uAD00\uB9AC"],
    ["tables", "\uD14C\uC774\uBE14 \uAD00\uB9AC"],
    ["tags", "NFC \uD0DC\uADF8"],
    ["settings", "\uC2DD\uB2F9 \uC124\uC815"]
  ];
  var app = document.getElementById("app");
  var toastEl = document.getElementById("toast");
  var data = loadData();
  var routeFilter = "all";
  var customerError = "";
  var modalAction = null;
  var toastTimer;
  function uid(prefix) {
    const value = globalThis.crypto?.randomUUID?.().replaceAll("-", "").slice(0, 14) ?? Math.random().toString(36).slice(2, 16);
    return `${prefix}-${value}`;
  }
  function seedData() {
    const now = Date.now();
    return {
      restaurant: { name: "\uC624\uD6C4\uC2DD\uB2F9", notice: "\uC74C\uC2DD\uC774 \uC900\uBE44\uB418\uBA74 \uC774 \uD398\uC774\uC9C0\uC5D0\uC11C \uC54C\uB824\uB4DC\uB9B4\uAC8C\uC694." },
      authenticated: false,
      tables: [
        { id: "table-01", number: "01", closed: false },
        { id: "table-02", number: "02", closed: false },
        { id: "table-03", number: "03", closed: false },
        { id: "table-04", number: "04", closed: false }
      ],
      tags: [
        { id: "tag-01", token: "cvx-table-01-demo", tableId: "table-01", active: true, createdAt: new Date(now - 864e5 * 4).toISOString() },
        { id: "tag-02", token: "cvx-table-02-demo", tableId: "table-02", active: true, createdAt: new Date(now - 864e5 * 3).toISOString() },
        { id: "tag-03", token: "cvx-table-03-demo", tableId: "table-03", active: true, createdAt: new Date(now - 864e5 * 2).toISOString() }
      ],
      orders: [
        { id: "order-204", orderNo: "CV-204", tableId: "table-01", items: [{ name: "\uD2B8\uB7EC\uD50C \uD06C\uB9BC \uD30C\uC2A4\uD0C0", quantity: 1 }, { name: "\uB808\uBAAC \uC5D0\uC774\uB4DC", quantity: 1 }], status: "preparing", expectedMinutes: 8, expectedAt: new Date(now + 8 * 6e4).toISOString(), createdAt: new Date(now - 9 * 6e4).toISOString(), updatedAt: new Date(now - 1 * 6e4).toISOString() },
        { id: "order-205", orderNo: "CV-205", tableId: "table-01", items: [{ name: "\uBC84\uC12F \uB9AC\uC870\uB610", quantity: 2 }], status: "queued", expectedMinutes: 14, expectedAt: new Date(now + 14 * 6e4).toISOString(), createdAt: new Date(now - 3 * 6e4).toISOString(), updatedAt: new Date(now - 2 * 6e4).toISOString() },
        { id: "order-206", orderNo: "CV-206", tableId: "table-02", items: [{ name: "\uBC14\uC9C8 \uD1A0\uB9C8\uD1A0 \uD30C\uC2A4\uD0C0", quantity: 1 }], status: "ready", expectedMinutes: 0, expectedAt: null, createdAt: new Date(now - 17 * 6e4).toISOString(), updatedAt: new Date(now - 2 * 6e4).toISOString() },
        { id: "order-207", orderNo: "CV-207", tableId: "table-03", items: [{ name: "\uC624\uB298\uC758 \uC218\uD504", quantity: 1 }, { name: "\uC0AC\uC6CC\uB3C4\uC6B0", quantity: 1 }], status: "received", expectedMinutes: 12, expectedAt: new Date(now + 12 * 6e4).toISOString(), createdAt: new Date(now - 1 * 6e4).toISOString(), updatedAt: new Date(now - 1 * 6e4).toISOString() },
        { id: "order-198", orderNo: "CV-198", tableId: "table-04", items: [{ name: "\uADF8\uB9B4\uB4DC \uCE58\uD0A8 \uD50C\uB808\uC774\uD2B8", quantity: 1 }], status: "delivered", expectedMinutes: 0, expectedAt: null, createdAt: new Date(now - 36e5).toISOString(), updatedAt: new Date(now - 28e5).toISOString() }
      ]
    };
  }
  function loadData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.orders) && Array.isArray(parsed.tables) && Array.isArray(parsed.tags)) return parsed;
      }
    } catch (error) {
      console.warn("Could not load local demo data.", error);
    }
    const initial = seedData();
    persist(initial);
    return initial;
  }
  function persist(next = data) {
    data = next;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Could not save local demo data.", error);
      showToast("\uC774 \uBE0C\uB77C\uC6B0\uC800\uC5D0 \uB370\uBAA8 \uB370\uC774\uD130\uB97C \uC800\uC7A5\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.");
    }
  }
  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }
  function formatTime(value) {
    if (!value) return "\u2014";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "\u2014";
    return new Intl.DateTimeFormat("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: true }).format(date);
  }
  function relativeTime(value) {
    const minutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 6e4));
    return minutes < 1 ? "\uBC29\uAE08 \uC5C5\uB370\uC774\uD2B8\uD588\uC5B4\uC694" : `${minutes}\uBD84 \uC804\uC5D0 \uC5C5\uB370\uC774\uD2B8\uD588\uC5B4\uC694`;
  }
  function tableById(id) {
    return data.tables.find((table) => table.id === id);
  }
  function tableNumber(id) {
    return tableById(id)?.number ?? "\u2014";
  }
  function isActiveOrder(order) {
    return !["delivered", "canceled"].includes(order.status);
  }
  function currentOrders(tableId) {
    return data.orders.filter((order) => order.tableId === tableId && isActiveOrder(order));
  }
  function tableStatus(table) {
    if (table.closed) return { label: "\uC774\uC6A9 \uC885\uB8CC", tone: "neutral" };
    const orders = currentOrders(table.id);
    if (!orders.length) return { label: "\uC774\uC6A9 \uAC00\uB2A5", tone: "neutral" };
    if (orders.some((order) => order.status === "ready")) return { label: "\uC900\uBE44 \uC644\uB8CC", tone: "good" };
    return { label: "\uC8FC\uBB38 \uC9C4\uD589 \uC911", tone: "warn" };
  }
  function statusTag(status) {
    const item = STATUS[status] ?? STATUS.received;
    return `<span class="tag ${item.tone}">${item.label}</span>`;
  }
  function brand(extraClass = "") {
    return `<a class="brand ${extraClass}" href="/" aria-label="COMPIVOX \uD648"><span class="brand-mark"><img src="${ICON_SRC}" alt=""></span><span>COMPIVOX</span></a>`;
  }
  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2600);
  }
  function renderLanding() {
    const orders = data.orders.filter(isActiveOrder).slice(0, 3);
    app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        ${brand()}
        <div class="topbar-right">
          <span class="demo-stamp">INTERACTIVE DEMO</span>
          <a class="topbar-link" href="#/staff/login">\uC9C1\uC6D0 \uB85C\uADF8\uC778</a>
        </div>
      </header>
      <main class="landing">
        <section class="landing-copy">
          <span class="landing-kicker">RESTAURANT ORDER EXPERIENCE</span>
          <h1 class="landing-title">Kitchen,<br><span>in sync.</span></h1>
          <p class="landing-lead">NFC \uD0DC\uADF8\uB97C \uD55C \uBC88 \uD130\uCE58\uD558\uBA74 \uC8FC\uBB38 \uC0C1\uD0DC\uC640 \uC608\uC0C1 \uC900\uBE44 \uC2DC\uAC04\uC744 \uBC14\uB85C \uD655\uC778\uD560 \uC218 \uC788\uC5B4\uC694. \uC571 \uC124\uCE58\uB098 \uD68C\uC6D0\uAC00\uC785 \uC5C6\uC774 \uD3B8\uD558\uAC8C \uC774\uC6A9\uD574 \uBCF4\uC138\uC694.</p>
          <div class="landing-actions">
            <a class="btn btn-primary" href="?tag=cvx-table-01-demo">\uACE0\uAC1D \uD654\uBA74 \uBBF8\uB9AC\uBCF4\uAE30 <span aria-hidden="true">\u2197</span></a>
            <a class="btn btn-secondary" href="#/staff/login">\uC9C1\uC6D0 \uAD00\uB9AC \uD654\uBA74 <span aria-hidden="true">\u2192</span></a>
          </div>
          <div class="landing-meta"><span><strong>01</strong> NFC \uC811\uC18D</span><span><strong>02</strong> \uC8FC\uBB38\uBC88\uD638 \uD655\uC778</span><span><strong>03</strong> \uC2E4\uC2DC\uAC04 \uC0C1\uD0DC</span></div>
        </section>
        <aside class="demo-preview" aria-label="\uC8FC\uBB38 \uD604\uD669 \uBBF8\uB9AC\uBCF4\uAE30">
          <div class="preview-head"><div><div class="eyebrow">LIVE KITCHEN</div><div class="panel-title" style="margin-top:7px">${escapeHtml(data.restaurant.name)}</div></div><span class="demo-stamp">DEMO DATA</span></div>
          <div class="preview-orders">${orders.map((order, index) => `
            <a class="preview-order" href="?tag=${encodeURIComponent(data.tags.find((tag) => tag.tableId === order.tableId)?.token ?? "")}&order=${encodeURIComponent(order.orderNo)}">
              <span class="preview-index">${String(index + 1).padStart(2, "0")}</span>
              <span class="preview-order-main"><span class="preview-order-name">${escapeHtml(order.items.map((item) => item.name).join(" \xB7 "))}</span><span class="preview-order-sub">T${escapeHtml(tableNumber(order.tableId))} \xB7 ${escapeHtml(STATUS[order.status].label)}</span></span>
              <span class="preview-eta">${order.status === "ready" ? "\uC644\uB8CC" : `${Math.max(1, Math.ceil((new Date(order.expectedAt ?? Date.now()).getTime() - Date.now()) / 6e4))}\uBD84`}</span>
            </a>`).join("")}</div>
          <div class="preview-bottom"><span>\uBAA8\uB4E0 \uC0C1\uD0DC\uB294 \uB370\uBAA8 \uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C \uB3D9\uAE30\uD654\uB429\uB2C8\uB2E4</span><span class="preview-bars"><i class="active"></i><i class="active"></i><i></i><i></i></span></div>
        </aside>
      </main>
      <footer class="customer-footer">COMPIVOX \xB7 A calmer way to wait. &nbsp;\xB7&nbsp; \uD654\uBA74\uACFC \uC8FC\uBB38\uC740 \uD14C\uC2A4\uD2B8 \uB370\uC774\uD130\uB85C \uBCF4\uC5EC\uB4DC\uB9AC\uACE0 \uC788\uC5B4\uC694.</footer>
    </div>`;
  }
  function renderCustomer() {
    const params = new URLSearchParams(location.search);
    const token = params.get("tag") ?? "";
    const tag = data.tags.find((item) => item.token === token && item.active);
    const table = tag ? tableById(tag.tableId) : null;
    const orderNo = params.get("order")?.trim().toUpperCase() ?? "";
    const order = orderNo ? data.orders.find((item) => item.orderNo.toUpperCase() === orderNo && item.tableId === table?.id) : null;
    if (!token || !table) {
      app.innerHTML = customerShell(`<section class="panel customer-empty"><span class="demo-stamp">DEMO EXPERIENCE</span><h2 style="margin-top:17px">\uD14C\uC774\uBE14 NFC \uD0DC\uADF8\uB97C \uC2A4\uCE94\uD574 \uC8FC\uC138\uC694</h2><p>\uD14C\uC774\uBE14\uC5D0 \uBD80\uCC29\uB41C COMPIVOX \uD0DC\uADF8\uB97C \uD734\uB300\uD3F0\uC73C\uB85C \uD130\uCE58\uD558\uBA74 \uC8FC\uBB38 \uD655\uC778 \uD398\uC774\uC9C0\uAC00 \uC5F4\uB824\uC694.</p><div class="landing-actions" style="justify-content:center"><a class="btn btn-secondary customer-switch" href="/">\uC11C\uBE44\uC2A4 \uC18C\uAC1C</a></div></section>`);
      return;
    }
    const tagUrl = new URL("/", location.origin);
    tagUrl.searchParams.set("tag", tag.token);
    const matchingOrder = order && order.tableId === table.id ? order : null;
    let content = "";
    if (!matchingOrder) {
      const submitted = orderNo !== "";
      content = `
      <section class="panel order-lookup">
        <p class="eyebrow">ORDER LOOKUP</p>
        <h2 class="panel-title" style="margin-top:8px;font-size:18px">\uC8FC\uBB38\uBC88\uD638\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694</h2>
        <p class="panel-subtitle" style="margin-top:7px">\uAC19\uC740 \uD14C\uC774\uBE14\uC758 \uC8FC\uBB38\uC744 \uAD6C\uBD84\uD560 \uC218 \uC788\uB3C4\uB85D \uC601\uC218\uC99D\uC5D0\uC11C \uC8FC\uBB38\uBC88\uD638\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.</p>
        <form class="lookup-form" data-form="lookup">
          <label class="sr-only" for="order-code">\uC8FC\uBB38\uBC88\uD638</label>
          <input class="field mono" id="order-code" name="orderNo" placeholder="\uC608: CV-204" autocomplete="off" value="${escapeHtml(orderNo)}" required>
          <button class="btn btn-primary" type="submit">\uC8FC\uBB38 \uD655\uC778</button>
        </form>
        <p class="lookup-error">${submitted ? "\uC8FC\uBB38\uBC88\uD638\uB97C \uCC3E\uC9C0 \uBABB\uD588\uC5B4\uC694. \uC601\uC218\uC99D\uC758 \uBC88\uD638\uB97C \uB2E4\uC2DC \uD655\uC778\uD574 \uC8FC\uC138\uC694." : escapeHtml(customerError)}</p>
      </section>
      <p class="notice">${escapeHtml(data.restaurant.notice)}</p>`;
    } else {
      content = renderCustomerOrder(matchingOrder, table);
    }
    app.innerHTML = customerShell(`
    <div class="eyebrow">ORDER STATUS</div>
    <h1 class="restaurant-name">${escapeHtml(data.restaurant.name)}</h1>
    <div class="table-line"><span>\uD14C\uC774\uBE14 ${escapeHtml(table.number)}</span><span aria-hidden="true">\xB7</span><span>${escapeHtml(formatTime((/* @__PURE__ */ new Date()).toISOString()))}\uC5D0 \uBC29\uBB38\uD558\uC168\uC5B4\uC694</span></div>
    ${content}
    <p class="notice">\uC608\uC0C1 \uC2DC\uAC04\uC740 \uC8FC\uBB38\uB7C9\uACFC \uC870\uB9AC \uC0C1\uD669\uC5D0 \uB530\uB77C \uB2EC\uB77C\uC9C8 \uC218 \uC788\uC5B4\uC694.</p>
    <a class="topbar-link customer-switch" href="${escapeHtml(tagUrl.pathname + tagUrl.search)}">\uB2E4\uB978 \uC8FC\uBB38\uBC88\uD638 \uD655\uC778</a>
  `);
  }
  function customerShell(content) {
    return `<div class="customer-shell">
    <header class="customer-top">${brand()}<span class="demo-stamp">DEMO</span></header>
    <main class="customer-main">${content}</main>
    <footer class="customer-footer">\uC8FC\uBB38 \uC0C1\uD0DC\uAC00 \uBC14\uB00C\uBA74 \uC774 \uD398\uC774\uC9C0\uC5D0 \uBC14\uB85C \uD45C\uC2DC\uB3FC\uC694.<br>COMPIVOX\uC5D0\uC11C \uD3B8\uD558\uAC8C \uD655\uC778\uD574 \uBCF4\uC138\uC694.</footer>
  </div>`;
  }
  function renderCustomerOrder(order, table) {
    const statusIndex = FLOW.indexOf(order.status);
    const remaining = order.expectedAt ? Math.max(0, Math.ceil((new Date(order.expectedAt).getTime() - Date.now()) / 6e4)) : 0;
    const expectedAt = order.expectedAt ? new Date(order.expectedAt).getTime() : 0;
    const duration = Math.max(1, Number(order.expectedMinutes) || 1) * 6e4;
    const startsAt = expectedAt ? expectedAt - duration : 0;
    const progress = expectedAt ? Math.max(0, Math.min(1, (Date.now() - startsAt) / duration)) : 0;
    const canceled = order.status === "canceled";
    const eta = order.status === "ready" || order.status === "delivered" ? order.status === "ready" ? "\uC900\uBE44 \uC644\uB8CC" : "\uC804\uB2EC \uC644\uB8CC" : `\uC57D ${remaining}\uBD84 \uB0A8\uC558\uC5B4\uC694`;
    const track = FLOW.map((status, index) => {
      const complete = !canceled && index < statusIndex;
      const current = !canceled && index === statusIndex;
      return `<li class="status-step ${complete ? "done" : ""} ${current ? "current" : ""}">
      <span class="status-dot">${complete ? `<img src="${ICON_SRC}" alt="">` : current ? "\u2022" : ""}</span>
      <span>${STATUS[status].label}</span>
      <small>${current ? "\uD604\uC7AC \uC0C1\uD0DC" : complete ? "\uC644\uB8CC" : ""}</small>
    </li>`;
    }).join("");
    return `<section class="panel order-card">
    <p class="order-code">\uC8FC\uBB38\uBC88\uD638 &nbsp;<strong class="mono">${escapeHtml(order.orderNo)}</strong></p>
    <ul class="order-items">${order.items.map((item) => `<li class="order-item"><span>${escapeHtml(item.name)}</span><span>\xD7 ${item.quantity}</span></li>`).join("")}</ul>
    <div class="eta-box"><div><div class="eta-caption">${order.status === "ready" ? "PICKUP" : order.status === "delivered" ? "COMPLETED" : "ESTIMATED TIME"}</div><div class="eta-value">${canceled ? "\uC8FC\uBB38\uC774 \uCDE8\uC18C\uB418\uC5C8\uC5B4\uC694" : eta}</div></div>${!canceled && isActiveOrder(order) && expectedAt ? `<div class="eta-progress" data-eta-progress data-start-at="${startsAt}" data-ends-at="${expectedAt}" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(progress * 100)}" aria-label="\uC608\uC0C1 \uC900\uBE44\uAE4C\uC9C0 ${remaining}\uBD84 \uB0A8\uC558\uC5B4\uC694"><span class="eta-progress-time" data-eta-time style="left:${Math.max(5, Math.min(95, progress * 100))}%">${remaining}\uBD84 \uB0A8\uC558\uC5B4\uC694</span><span class="eta-progress-track" aria-hidden="true"><span class="eta-progress-fill" data-eta-fill style="width:${progress * 100}%"></span></span><span class="eta-progress-caption">\uC774 \uC2DC\uAC04\uCBE4 \uC900\uBE44\uB3FC\uC694<br><strong>${escapeHtml(formatTime(order.expectedAt))}</strong></span></div>` : `<div class="eta-clock">${canceled ? "\uC9C1\uC6D0\uC5D0\uAC8C \uBB38\uC758\uD574 \uC8FC\uC138\uC694" : `\uC608\uC0C1 \uC644\uB8CC \uC2DC\uAC04\uC774\uC5D0\uC694<br><strong>${escapeHtml(formatTime(order.expectedAt))}</strong>`}</div>`}</div>
    ${order.status === "ready" ? `<div class="ready-banner" role="status"><img class="complete-mark" src="${ICON_SRC}" alt=""><strong>\uC8FC\uBB38\uD558\uC2E0 \uC74C\uC2DD\uC774 \uC900\uBE44\uB418\uC5C8\uC5B4\uC694</strong></div>` : ""}
    ${order.status === "delivered" ? `<div class="ready-banner" role="status"><img class="complete-mark" src="${ICON_SRC}" alt=""><strong>\uC74C\uC2DD\uC744 \uC804\uB2EC\uD574 \uB4DC\uB838\uC5B4\uC694</strong><span>\uB9DB\uC788\uAC8C \uB4DC\uC138\uC694.</span></div>` : ""}
    ${canceled ? `<div class="ready-banner" role="status" style="border-color:#E7C7C2;background:var(--danger-bg);color:var(--danger)"><strong>\uC8FC\uBB38\uC774 \uCDE8\uC18C\uB418\uC5C8\uC5B4\uC694</strong><span>\uACB0\uC81C\uB098 \uC8FC\uBB38 \uAD00\uB828 \uBB38\uC758\uB294 \uC9C1\uC6D0\uC5D0\uAC8C \uB9D0\uC500\uD574 \uC8FC\uC138\uC694.</span></div>` : ""}
    <ol class="status-track" aria-label="\uC8FC\uBB38 \uC9C4\uD589 \uC0C1\uD0DC">${track}</ol>
    <div class="updated-at"><span>\uD14C\uC774\uBE14 ${escapeHtml(table.number)} \xB7 ${statusTag(order.status)}</span><span>${escapeHtml(relativeTime(order.updatedAt))}</span></div>
  </section>`;
  }
  function updateCustomerEtaProgress() {
    document.querySelectorAll("[data-eta-progress]").forEach((progress) => {
      const startsAt = Number(progress.dataset.startAt);
      const endsAt = Number(progress.dataset.endsAt);
      const duration = Math.max(1, endsAt - startsAt);
      const remaining = Math.max(0, endsAt - Date.now());
      const ratio = Math.max(0, Math.min(1, (Date.now() - startsAt) / duration));
      progress.style.setProperty("--progress", String(ratio));
      progress.querySelector("[data-eta-fill]").style.width = `${ratio * 100}%`;
      const remainingMinutes = Math.ceil(remaining / 6e4);
      progress.querySelector("[data-eta-time]").style.left = `${Math.max(5, Math.min(95, ratio * 100))}%`;
      progress.querySelector("[data-eta-time]").textContent = `${remainingMinutes}\uBD84 \uB0A8\uC558\uC5B4\uC694`;
      progress.setAttribute("aria-valuenow", String(Math.round(ratio * 100)));
      progress.setAttribute("aria-label", `\uC608\uC0C1 \uC900\uBE44\uAE4C\uC9C0 ${remainingMinutes}\uBD84`);
    });
  }
  function routeName() {
    const match = location.hash.match(/^#\/staff(?:\/([a-z]+))?/);
    return match ? match[1] || "dashboard" : null;
  }
  function navigate(route) {
    location.hash = route ? `#/staff/${route}` : "";
    if (!route && location.hash) location.hash = "";
    render();
  }
  function requireStaffPage(page) {
    if (page === "login") {
      renderLogin();
      return;
    }
    if (!data.authenticated) {
      location.hash = "#/staff/login";
      renderLogin();
      return;
    }
    renderStaff(page);
  }
  function renderLogin(errorMessage = "") {
    app.innerHTML = `<div class="staff-shell">
    <header class="staff-topbar"><div class="staff-brand-side">${brand()}<span class="restaurant-chip">\uC9C1\uC6D0 \uC6CC\uD06C\uC2A4\uD398\uC774\uC2A4</span></div><a class="topbar-link" href="/">\uACE0\uAC1D \uD398\uC774\uC9C0 \uBCF4\uAE30</a></header>
    <main class="login-wrap"><section class="panel login-card">
      ${brand()}
      <div class="eyebrow">STAFF ACCESS</div>
      <h1>\uB2E4\uC2DC \uB9CC\uB098\uC11C \uBC18\uAC00\uC6CC\uC694</h1>
      <p>\uC2DD\uB2F9 \uC8FC\uBB38\uACFC \uD14C\uC774\uBE14\uC744 \uAD00\uB9AC\uD558\uB824\uBA74 \uC9C1\uC6D0 \uACC4\uC815\uC73C\uB85C \uB85C\uADF8\uC778\uD558\uC138\uC694.</p>
      <form class="login-form" data-form="login">
        <div><label class="label" for="staff-id">\uC544\uC774\uB514</label><input class="field" id="staff-id" name="username" autocomplete="username" value="${escapeHtml(new URLSearchParams(location.search).get("id") ?? "")}" required></div>
        <div><label class="label" for="staff-password">\uBE44\uBC00\uBC88\uD638</label><input class="field" id="staff-password" type="password" name="password" autocomplete="current-password" required></div>
        <div class="login-err" role="alert">${escapeHtml(errorMessage)}</div>
        <button class="btn btn-primary btn-wide" type="submit">\uB85C\uADF8\uC778 <span aria-hidden="true">\u2192</span></button>
      </form>
      <div class="login-demo"><strong>\uBBF8\uB9AC\uBCF4\uAE30 \uB370\uBAA8 \uACC4\uC815</strong><br>\uC544\uC774\uB514 <code>staff</code> \xB7 \uBE44\uBC00\uBC88\uD638 <code>compivox-demo</code><br>\uB370\uBAA8\uC6A9 \uB85C\uCEEC \uB85C\uADF8\uC778\uC774\uBA70 \uC2E4\uC81C \uACC4\uC815 \uC778\uC99D\uACFC \uC5F0\uACB0\uB418\uC5B4 \uC788\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.</div>
    </section></main>
  </div>`;
  }
  function renderStaff(page) {
    const titles = {
      dashboard: ["OVERVIEW", "\uC88B\uC740 \uC11C\uBE44\uC2A4\uB294 \uC8FC\uBC29\uC5D0\uC11C \uC2DC\uC791\uB429\uB2C8\uB2E4", "\uC624\uB298\uC758 \uC8FC\uBB38\uACFC \uC870\uB9AC \uD750\uB984\uC744 \uD55C\uB208\uC5D0 \uD655\uC778\uD558\uC138\uC694."],
      orders: ["ORDER MANAGEMENT", "\uC8FC\uBB38 \uAD00\uB9AC", "\uC0C8 \uC8FC\uBB38\uC744 \uB4F1\uB85D\uD558\uACE0 \uAC1C\uBCC4 \uC900\uBE44 \uC0C1\uD0DC\uB97C \uC5C5\uB370\uC774\uD2B8\uD569\uB2C8\uB2E4."],
      tables: ["FLOOR PLAN", "\uD14C\uC774\uBE14 \uAD00\uB9AC", "\uD14C\uC774\uBE14 \uC0C1\uD0DC\uC640 \uD604\uC7AC \uC9C4\uD589 \uC911\uC778 \uC8FC\uBB38\uC744 \uD655\uC778\uD569\uB2C8\uB2E4."],
      tags: ["NFC MANAGEMENT", "NFC \uD0DC\uADF8", "\uD14C\uC774\uBE14\uBCC4 \uC5F0\uACB0 \uC8FC\uC18C\uB97C \uBCF5\uC0AC\uD558\uAC70\uB098 QR \uCF54\uB4DC\uB85C \uD655\uC778\uD569\uB2C8\uB2E4."],
      settings: ["RESTAURANT", "\uC2DD\uB2F9 \uC124\uC815", "\uACE0\uAC1D \uD398\uC774\uC9C0\uC5D0 \uD45C\uC2DC\uD560 \uC2DD\uB2F9 \uC815\uBCF4\uC640 \uC548\uB0B4\uB97C \uAD00\uB9AC\uD569\uB2C8\uB2E4."]
    };
    const [eyebrow, title, lead] = titles[page] ?? titles.dashboard;
    const totalActive = data.orders.filter(isActiveOrder).length;
    const readyCount = data.orders.filter((order) => order.status === "ready").length;
    const todayCount = data.orders.filter((order) => new Date(order.createdAt).toDateString() === (/* @__PURE__ */ new Date()).toDateString()).length;
    app.innerHTML = `<div class="staff-shell">
    <header class="staff-topbar">
      <div class="staff-brand-side">${brand()}<span class="restaurant-chip">${escapeHtml(data.restaurant.name)}</span></div>
      <div class="staff-top-actions"><span class="demo-stamp">LOCAL DEMO</span><button class="btn btn-quiet btn-sm" data-action="logout">\uB85C\uADF8\uC544\uC6C3</button></div>
    </header>
    <div class="staff-layout">
      <nav class="sidebar" aria-label="\uAD00\uB9AC \uBA54\uB274">
        <div class="sidebar-label">WORKSPACE</div>
        ${NAV_ITEMS.map(([key, label]) => `<a class="side-link ${page === key ? "active" : ""}" href="#/staff/${key}" ${page === key ? 'aria-current="page"' : ""}><span class="side-icon" aria-hidden="true"><img src="${ICON_SRC}" alt=""></span>${label}</a>`).join("")}
        <div class="sidebar-bottom"><a class="side-link" href="?tag=${encodeURIComponent(data.tags[0]?.token ?? "")}"><span class="side-icon" aria-hidden="true"><img src="${ICON_SRC}" alt=""></span>\uACE0\uAC1D \uD654\uBA74 \uBBF8\uB9AC\uBCF4\uAE30</a></div>
      </nav>
      <main class="staff-main"><div class="staff-content">
        <div class="page-heading"><div><div class="eyebrow">${eyebrow}</div><h1 class="page-title">${title}</h1><p class="page-lead">${lead}</p></div>
        ${page === "orders" ? `<button class="btn btn-primary" data-action="focus-new-order">\uFF0B \uC0C8 \uC8FC\uBB38 \uB4F1\uB85D</button>` : ""}
      </div>
      ${page === "dashboard" ? renderDashboard(totalActive, readyCount, todayCount) : ""}
      ${page === "orders" ? renderOrders() : ""}
      ${page === "tables" ? renderTables() : ""}
      ${page === "tags" ? renderTags() : ""}
      ${page === "settings" ? renderSettings() : ""}
      </div></main>
    </div>
    ${modalAction ? renderModal() : ""}
  </div>`;
    if (page === "tags") drawQrCodes();
  }
  function renderDashboard(totalActive, readyCount, todayCount) {
    const queued = data.orders.filter((order) => order.status === "received" || order.status === "queued").length;
    const cooking = data.orders.filter((order) => order.status === "preparing").length;
    const metrics = [
      ["\uC9C4\uD589 \uC911 \uC8FC\uBB38", totalActive, "\uD604\uC7AC \uC811\uC218\uB41C \uC8FC\uBB38"],
      ["\uC870\uB9AC \uB300\uAE30", queued, "\uB2E4\uC74C \uC791\uC5C5 \uB300\uAE30"],
      ["\uC870\uB9AC \uC911", cooking, "\uC8FC\uBC29\uC5D0\uC11C \uC900\uBE44 \uC911"],
      ["\uC900\uBE44 \uC644\uB8CC", readyCount, "\uD53D\uC5C5 \uB300\uAE30"],
      ["\uC624\uB298 \uC8FC\uBB38", todayCount, "\uC624\uB298 \uC811\uC218\uB41C \uC804\uCCB4 \uC8FC\uBB38"]
    ];
    const latest = [...data.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    return `<section class="metric-grid">${metrics.map(([label, value, note]) => `<article class="metric-card"><div class="metric-label">${label}</div><div class="metric-value">${value}</div><div class="metric-note">${note}</div></article>`).join("")}</section>
    <div class="dashboard-grid">
      <section class="panel"><div class="panel-head"><div><h2 class="panel-title">\uCD5C\uADFC \uC8FC\uBB38</h2><p class="panel-subtitle">\uCD5C\uADFC \uC811\uC218\uB41C \uC8FC\uBB38\uC758 \uD604\uC7AC \uC0C1\uD0DC</p></div><a class="btn btn-quiet btn-sm" href="#/staff/orders">\uC804\uCCB4 \uBCF4\uAE30 \u2192</a></div>
        <div class="panel-body order-list">${latest.length ? latest.map(renderOrderRow).join("") : `<div class="empty-state">\uC544\uC9C1 \uB4F1\uB85D\uB41C \uC8FC\uBB38\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</div>`}</div>
      </section>
      <section class="panel"><div class="panel-head"><div><h2 class="panel-title">\uC8FC\uBC29 \uD604\uD669</h2><p class="panel-subtitle">\uD14C\uC774\uBE14\uBCC4 \uC9C4\uD589 \uC0C1\uD669</p></div></div>
        <div class="panel-body">${data.tables.map((table) => {
      const count = currentOrders(table.id).length;
      const status = tableStatus(table);
      return `<div class="order-row" style="grid-template-columns:1fr auto"><div class="order-row-main"><div class="order-row-code">\uD14C\uC774\uBE14 ${escapeHtml(table.number)}</div><div class="order-row-items">${count ? `${count}\uAC74\uC758 \uC8FC\uBB38 \uC9C4\uD589 \uC911` : "\uC9C4\uD589 \uC911\uC778 \uC8FC\uBB38 \uC5C6\uC74C"}</div></div><span class="tag ${status.tone}">${escapeHtml(status.label)}</span></div>`;
    }).join("")}</div>
      </section>
    </div>`;
  }
  function renderOrderRow(order) {
    return `<div class="order-row">
    <div class="order-row-main"><div class="order-row-code mono">${escapeHtml(order.orderNo)}</div><div class="order-row-items">${escapeHtml(formatTime(order.createdAt))}</div></div>
    <div class="order-row-main"><div class="order-row-items">${escapeHtml(order.items.map((item) => `${item.name} \xD7${item.quantity}`).join(" \xB7 "))}</div></div>
    <div class="order-row-table">\uD14C\uC774\uBE14 ${escapeHtml(tableNumber(order.tableId))} \xB7 ${statusTag(order.status)}</div>
    <div class="order-row-actions"><button class="btn btn-secondary btn-sm" data-action="advance" data-id="${escapeHtml(order.id)}">\uB2E4\uC74C \uB2E8\uACC4</button></div>
  </div>`;
  }
  function renderOrders() {
    const filter = routeFilter;
    const filtered = [...data.orders].filter((order) => filter === "all" || order.status === filter).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const tabs = [["all", "\uC804\uCCB4"], ...Object.entries(STATUS).map(([key, item]) => [key, item.short])];
    return `<section class="panel order-form" id="new-order">
      <div class="panel-head" style="padding:0 0 17px;border:0"><div><h2 class="panel-title">\uC0C8 \uC8FC\uBB38 \uB4F1\uB85D</h2><p class="panel-subtitle">\uC8FC\uBB38\uBC88\uD638\uB294 \uC0DD\uC131 \uD6C4 \uACE0\uAC1D \uC870\uD68C\uC5D0 \uC0AC\uC6A9\uB429\uB2C8\uB2E4.</p></div><span class="demo-stamp">LOCAL DEMO</span></div>
      <form class="order-form-grid" data-form="new-order">
        <div class="form-field"><label class="label" for="order-table">\uD14C\uC774\uBE14 \uBC88\uD638</label><select class="field" id="order-table" name="tableId" required>${data.tables.filter((table) => !table.closed).map((table) => `<option value="${escapeHtml(table.id)}">\uD14C\uC774\uBE14 ${escapeHtml(table.number)}</option>`).join("")}</select></div>
        <div class="form-field"><label class="label" for="order-items">\uC8FC\uBB38 \uBA54\uB274</label><textarea class="field" id="order-items" name="items" placeholder="\uBA54\uB274\uBA85, \uC218\uB7C9 (\uD55C \uC904\uC5D0 \uD558\uB098\uC529)&#10;\uD2B8\uB7EC\uD50C \uD06C\uB9BC \uD30C\uC2A4\uD0C0, 1&#10;\uB808\uBAAC \uC5D0\uC774\uB4DC, 2" required></textarea></div>
        <div class="form-field"><label class="label" for="order-eta">\uC608\uC0C1 \uC900\uBE44 \uC2DC\uAC04 (\uBD84)</label><input class="field" id="order-eta" name="minutes" type="number" min="1" max="180" value="12" required></div>
        <div class="form-field"><button class="btn btn-primary" type="submit">\uC8FC\uBB38 \uC811\uC218\uD558\uAE30 <span aria-hidden="true">\u2192</span></button></div>
      </form>
    </section>
    <div class="orders-toolbar"><div class="status-tabs" role="tablist" aria-label="\uC8FC\uBB38 \uC0C1\uD0DC \uD544\uD130">${tabs.map(([key, label]) => `<button class="status-tab ${filter === key ? "active" : ""}" role="tab" aria-selected="${filter === key}" data-action="filter-orders" data-filter="${key}">${label}${key === "all" ? ` \xB7 ${data.orders.length}` : ` \xB7 ${data.orders.filter((order) => order.status === key).length}`}</button>`).join("")}</div><span class="muted small">${filtered.length}\uAC74</span></div>
    <section class="panel orders-table">
      <div class="table-header"><span>\uC8FC\uBB38\uBC88\uD638</span><span>\uBA54\uB274</span><span>\uD14C\uC774\uBE14</span><span>\uC0C1\uD0DC / \uC608\uC0C1</span><span>\uC791\uC5C5</span></div>
      ${filtered.length ? filtered.map(renderOrderCard).join("") : `<div class="empty-state">\uC120\uD0DD\uD55C \uC0C1\uD0DC\uC758 \uC8FC\uBB38\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.</div>`}
    </section>`;
  }
  function renderOrderCard(order) {
    const remaining = order.expectedAt ? Math.max(0, Math.ceil((new Date(order.expectedAt).getTime() - Date.now()) / 6e4)) : null;
    const next = FLOW[FLOW.indexOf(order.status) + 1];
    const tag = data.tags.find((item) => item.tableId === order.tableId && item.active);
    const publicLink = new URL("/", location.origin);
    if (tag) {
      publicLink.searchParams.set("tag", tag.token);
      publicLink.searchParams.set("order", order.orderNo);
    }
    return `<article class="table-order" data-order-card="${escapeHtml(order.id)}">
    <div class="table-cell"><strong class="mono">${escapeHtml(order.orderNo)}</strong><small>${escapeHtml(formatTime(order.createdAt))}</small></div>
    <div class="table-cell">${order.items.map((item) => `<strong>${escapeHtml(item.name)} <span class="muted">\xD7 ${item.quantity}</span></strong>`).join("")}</div>
    <div class="table-cell">\uD14C\uC774\uBE14 ${escapeHtml(tableNumber(order.tableId))}</div>
    <div class="table-cell">${statusTag(order.status)}${remaining !== null && isActiveOrder(order) ? `<small>\uC608\uC0C1 ${remaining ? `\uC57D ${remaining}\uBD84` : "\uACE7 \uC644\uB8CC"}</small>` : ""}</div>
    <div class="table-order-actions">
      ${next ? `<button class="btn btn-secondary btn-sm" data-action="advance" data-id="${escapeHtml(order.id)}">${next === "ready" ? "\uC900\uBE44 \uC644\uB8CC" : next === "delivered" ? "\uC804\uB2EC \uC644\uB8CC" : "\uB2E4\uC74C \uB2E8\uACC4"}</button>` : ""}
      ${isActiveOrder(order) ? `<button class="btn btn-quiet btn-sm" data-action="edit-eta" data-id="${escapeHtml(order.id)}">\uC2DC\uAC04</button><button class="btn btn-quiet btn-sm" data-action="copy-order-link" data-url="${escapeHtml(publicLink.href)}" ${tag ? "" : "disabled"}>\uACE0\uAC1D \uB9C1\uD06C</button><button class="btn btn-danger btn-sm" data-action="cancel-order" data-id="${escapeHtml(order.id)}">\uCDE8\uC18C</button>` : ""}
    </div>
  </article>`;
  }
  function renderTables() {
    return `<div class="orders-toolbar"><p class="panel-subtitle">\uC9C4\uD589 \uC911\uC778 \uC8FC\uBB38 \uC0C1\uD0DC\uB85C \uD14C\uC774\uBE14 \uC774\uC6A9 \uD604\uD669\uC774 \uC790\uB3D9 \uD45C\uC2DC\uB429\uB2C8\uB2E4.</p><button class="btn btn-primary" data-action="add-table">\uFF0B \uD14C\uC774\uBE14 \uCD94\uAC00</button></div>
    <div class="table-grid">${data.tables.length ? data.tables.map((table) => {
      const status = tableStatus(table);
      const orders = currentOrders(table.id);
      const tag = data.tags.find((item) => item.tableId === table.id && item.active);
      return `<article class="panel table-card">
        <div class="table-card-top"><div><div class="eyebrow">TABLE</div><div class="table-number">\uD14C\uC774\uBE14 ${escapeHtml(table.number)}</div><div class="table-card-meta">${orders.length ? `${orders.length}\uAC74 \uC8FC\uBB38 \xB7 ${orders.map((order) => escapeHtml(order.orderNo)).join(", ")}` : "\uD604\uC7AC \uC8FC\uBB38 \uC5C6\uC74C"}</div></div><span class="tag ${status.tone}">${status.label}</span></div>
        <form class="table-card-actions" data-form="rename-table" data-id="${escapeHtml(table.id)}"><input class="field" aria-label="\uD14C\uC774\uBE14 \uBC88\uD638" name="number" value="${escapeHtml(table.number)}" maxlength="8" style="width:92px;min-height:34px;padding:6px 9px"><button class="btn btn-secondary btn-sm" type="submit">\uBC88\uD638 \uC800\uC7A5</button>
          <button class="btn btn-quiet btn-sm" type="button" data-action="toggle-table" data-id="${escapeHtml(table.id)}">${table.closed ? "\uC774\uC6A9 \uC7AC\uAC1C" : "\uC774\uC6A9 \uC885\uB8CC"}</button>
          <button class="btn btn-danger btn-sm" type="button" data-action="delete-table" data-id="${escapeHtml(table.id)}" ${orders.length ? 'disabled title="\uC9C4\uD589 \uC911\uC778 \uC8FC\uBB38\uC774 \uC788\uC2B5\uB2C8\uB2E4"' : ""}>\uC0AD\uC81C</button>
          ${tag ? `<a class="btn btn-quiet btn-sm" href="#/staff/tags">NFC \uBCF4\uAE30</a>` : `<button class="btn btn-quiet btn-sm" type="button" data-action="make-tag" data-id="${escapeHtml(table.id)}">NFC \uB9CC\uB4E4\uAE30</button>`}
        </form>
      </article>`;
    }).join("") : `<div class="panel empty-state">\uB4F1\uB85D\uB41C \uD14C\uC774\uBE14\uC774 \uC5C6\uC2B5\uB2C8\uB2E4. \uD14C\uC774\uBE14\uC744 \uCD94\uAC00\uD574 \uC8FC\uC138\uC694.</div>`}</div>`;
  }
  function renderTags() {
    const options = data.tables.map((table) => `<option value="${escapeHtml(table.id)}">\uD14C\uC774\uBE14 ${escapeHtml(table.number)}</option>`).join("");
    return `<section class="panel panel-pad" style="margin-bottom:17px">
      <div class="panel-head" style="padding:0 0 15px;border:0"><div><h2 class="panel-title">\uD14C\uC774\uBE14 NFC \uD0DC\uADF8 \uC0DD\uC131</h2><p class="panel-subtitle">\uD0DC\uADF8\uC5D0\uB294 \uC8FC\uBB38\uBCC4 \uC815\uBCF4 \uB300\uC2E0 \uD14C\uC774\uBE14 \uC5F0\uACB0 URL\uC744 \uAE30\uB85D\uD569\uB2C8\uB2E4.</p></div></div>
      <form class="lookup-form" data-form="new-tag"><label class="sr-only" for="tag-table">\uD14C\uC774\uBE14</label><select class="field" id="tag-table" name="tableId" required>${options}</select><button class="btn btn-primary" type="submit">\uD0DC\uADF8 \uC0DD\uC131</button></form>
    <p class="notice">\uD0DC\uADF8 URL\uC744 \uBCF5\uC0AC\uD574 NFC \uC2A4\uD2F0\uCEE4\uC5D0 URI \uB808\uCF54\uB4DC\uB85C \uAE30\uB85D\uD558\uC138\uC694. QR \uCF54\uB4DC\uB294 \uD654\uBA74\uC5D0\uC11C \uB85C\uCEEC\uB85C \uC0DD\uC131\uB429\uB2C8\uB2E4.</p>
  </section>
    <div>${data.tags.length ? data.tags.map((tag) => {
      const table = tableById(tag.tableId);
      const url = new URL("/", location.origin);
      url.searchParams.set("tag", tag.token);
      return `<article class="panel tag-card">
        <div><div class="table-card-top"><div><div class="eyebrow">NFC TAG \xB7 ${escapeHtml(tag.id)}</div><h2 class="panel-title" style="margin-top:8px;font-size:17px">\uD14C\uC774\uBE14 ${escapeHtml(table?.number ?? "\uC0AD\uC81C\uB428")}</h2></div>${tag.active ? `<span class="tag good">\uC0AC\uC6A9 \uC911</span>` : `<span class="tag neutral">\uBE44\uD65C\uC131</span>`}</div>
          <code class="tag-url">${escapeHtml(url.href)}</code>
          <div class="tag-actions"><button class="btn btn-secondary btn-sm" data-action="copy-tag-url" data-url="${escapeHtml(url.href)}">\uC8FC\uC18C \uBCF5\uC0AC</button><a class="btn btn-quiet btn-sm" href="${escapeHtml(url.href)}" target="_blank" rel="noopener">\uACE0\uAC1D \uD398\uC774\uC9C0 \uC5F4\uAE30</a><button class="btn btn-quiet btn-sm" data-action="toggle-tag" data-id="${escapeHtml(tag.id)}">${tag.active ? "\uBE44\uD65C\uC131\uD654" : "\uD65C\uC131\uD654"}</button><button class="btn btn-danger btn-sm" data-action="delete-tag" data-id="${escapeHtml(tag.id)}">\uC0AD\uC81C</button></div>
        </div><canvas class="qr-canvas" width="264" height="264" data-qr="${escapeHtml(url.href)}" aria-label="\uD14C\uC774\uBE14 ${escapeHtml(table?.number ?? "")} NFC \uC8FC\uC18C QR \uCF54\uB4DC"></canvas>
      </article>`;
    }).join("") : `<div class="panel empty-state">\uB4F1\uB85D\uB41C NFC \uD0DC\uADF8\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4. \uD14C\uC774\uBE14\uC744 \uC120\uD0DD\uD574 \uCCAB \uD0DC\uADF8\uB97C \uB9CC\uB4DC\uC138\uC694.</div>`}</div>`;
  }
  function drawQrCodes() {
    document.querySelectorAll("canvas[data-qr]").forEach((canvas) => {
      import_qrcode.default.toCanvas(canvas, canvas.dataset.qr, {
        width: 264,
        margin: 2,
        color: { dark: "#17191c", light: "#ffffff" },
        errorCorrectionLevel: "M"
      }).catch((error) => {
        console.error("Could not render the table QR code.", error);
        canvas.insertAdjacentHTML("afterend", `<p class="small muted">QR\uC744 \uC0DD\uC131\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4. \uC5F0\uACB0 \uC8FC\uC18C\uB97C \uBCF5\uC0AC\uD574 \uC8FC\uC138\uC694.</p>`);
      });
    });
  }
  function renderSettings() {
    return `<div class="settings-grid">
    <section class="panel panel-pad"><h2 class="panel-title">\uACE0\uAC1D \uD398\uC774\uC9C0 \uC815\uBCF4</h2><p class="panel-subtitle" style="margin-bottom:20px">\uD14C\uC774\uBE14 NFC\uB97C \uC2A4\uCE94\uD588\uC744 \uB54C \uACE0\uAC1D \uD654\uBA74\uC5D0 \uD45C\uC2DC\uB429\uB2C8\uB2E4.</p>
      <form class="form-grid" data-form="settings">
        <div class="form-field full"><label class="label" for="restaurant-name">\uC2DD\uB2F9 \uC774\uB984</label><input class="field" id="restaurant-name" name="name" maxlength="50" value="${escapeHtml(data.restaurant.name)}" required></div>
        <div class="form-field full"><label class="label" for="restaurant-notice">\uACE0\uAC1D \uC548\uB0B4 \uBB38\uAD6C</label><textarea class="field" id="restaurant-notice" name="notice" maxlength="180">${escapeHtml(data.restaurant.notice)}</textarea></div>
        <div class="form-field full"><button class="btn btn-primary" type="submit">\uBCC0\uACBD\uC0AC\uD56D \uC800\uC7A5</button></div>
      </form>
    </section>
    <section class="panel panel-pad"><h2 class="panel-title">\uB370\uBAA8 \uB370\uC774\uD130</h2><p class="panel-subtitle">\uD604\uC7AC \uD654\uBA74\uC740 \uC774 \uBE0C\uB77C\uC6B0\uC800\uC5D0 \uC800\uC7A5\uB418\uB294 \uD14C\uC2A4\uD2B8 \uB370\uC774\uD130\uB85C \uB3D9\uC791\uD569\uB2C8\uB2E4.</p>
      <div class="setting-note">\uB2E4\uB978 \uAE30\uAE30\xB7\uBE0C\uB77C\uC6B0\uC800\uC640 \uC8FC\uBB38 \uC0C1\uD0DC\uB97C \uACF5\uC720\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4. \uC2E4\uC81C \uC2DD\uB2F9 \uC6B4\uC601\uC744 \uC704\uD574\uC11C\uB294 \uC9C1\uC6D0 \uC778\uC99D, \uC11C\uBC84 API, \uB370\uC774\uD130\uBCA0\uC774\uC2A4, \uC2E4\uC2DC\uAC04 \uB3D9\uAE30\uD654 \uBC0F \uACE0\uAC1D \uC8FC\uBB38 \uD1A0\uD070\uC774 \uBCC4\uB3C4\uB85C \uD544\uC694\uD569\uB2C8\uB2E4.</div>
      <button class="btn btn-danger" style="margin-top:16px" data-action="reset-demo">\uB370\uBAA8 \uB370\uC774\uD130 \uCD08\uAE30\uD654</button>
    </section>
  </div>
  <section class="panel panel-pad" style="margin-top:16px"><h2 class="panel-title">\uC5F0\uB3D9 \uC0C1\uD0DC</h2><p class="panel-subtitle" style="margin-top:6px">\uBC31\uC5D4\uB4DC \xB7 \uC5F0\uACB0 \uC548 \uB428 &nbsp; / &nbsp; \uB370\uC774\uD130 \uC800\uC7A5 \xB7 \uD604\uC7AC \uBE0C\uB77C\uC6B0\uC800 \uB85C\uCEEC \uC800\uC7A5\uC18C &nbsp; / &nbsp; NFC \xB7 URL \uAE30\uB85D \uBC29\uC2DD</p></section>`;
  }
  function renderModal() {
    const content = modalAction.type === "eta" ? `<form class="modal-form" data-form="edit-eta" data-id="${escapeHtml(modalAction.orderId)}"><label class="label" for="edit-eta-minutes">\uC608\uC0C1 \uC900\uBE44 \uC2DC\uAC04 (\uBD84)</label><input class="field" id="edit-eta-minutes" name="minutes" type="number" min="1" max="180" value="${escapeHtml(modalAction.minutes)}" required><div class="modal-actions"><button class="btn btn-quiet" type="button" data-action="close-modal">\uCDE8\uC18C</button><button class="btn btn-primary" type="submit">\uC2DC\uAC04 \uC800\uC7A5</button></div></form>` : `<div class="modal-actions"><button class="btn btn-quiet" data-action="close-modal">\uCDE8\uC18C</button><button class="btn btn-danger" data-action="confirm-modal">\uD655\uC778</button></div>`;
    return `<div class="modal-backdrop" role="presentation"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><h2 id="modal-title">${escapeHtml(modalAction.title)}</h2><p>${escapeHtml(modalAction.message)}</p>${content}</section></div>`;
  }
  function render() {
    const route = routeName();
    if (route) {
      requireStaffPage(route);
      return;
    }
    if (new URLSearchParams(location.search).has("tag")) {
      renderCustomer();
      return;
    }
    renderLanding();
  }
  function updateOrder(order, status) {
    if (!order) return;
    order.status = status;
    order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    if (status === "preparing") {
      order.expectedAt = new Date(Date.now() + Math.max(1, order.expectedMinutes) * 6e4).toISOString();
    }
    if (status === "ready" || status === "delivered" || status === "canceled") order.expectedAt = null;
    persist();
    render();
  }
  function parseItems(text) {
    return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
      let name = line;
      let quantity = 1;
      const suffix = line.match(/^(.*?)\s*[x×]\s*(\d+)\s*$/i);
      const comma = line.match(/^(.*?)[,\t|]\s*(\d+)\s*$/);
      if (suffix) {
        name = suffix[1].trim();
        quantity = Number(suffix[2]);
      } else if (comma) {
        name = comma[1].trim();
        quantity = Number(comma[2]);
      }
      return { name: name.slice(0, 80), quantity: Math.min(99, Math.max(1, quantity)) };
    }).filter((item) => item.name);
  }
  function makeOrder(form) {
    const values = new FormData(form);
    const items = parseItems(String(values.get("items") ?? ""));
    const table = tableById(String(values.get("tableId") ?? ""));
    const minutes = Math.max(1, Math.min(180, Number(values.get("minutes")) || 12));
    if (!table || table.closed || !items.length) {
      showToast("\uC774\uC6A9 \uAC00\uB2A5\uD55C \uD14C\uC774\uBE14\uACFC \uBA54\uB274\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
      return;
    }
    let orderNo;
    do {
      orderNo = `CV-${String(Math.floor(100 + Math.random() * 900))}`;
    } while (data.orders.some((order) => order.orderNo === orderNo));
    const now = /* @__PURE__ */ new Date();
    data.orders.unshift({
      id: uid("order"),
      orderNo,
      tableId: table.id,
      items,
      status: "received",
      expectedMinutes: minutes,
      expectedAt: new Date(now.getTime() + minutes * 6e4).toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString()
    });
    persist();
    routeFilter = "all";
    render();
    showToast(`${orderNo} \uC8FC\uBB38\uC744 \uB4F1\uB85D\uD588\uC2B5\uB2C8\uB2E4.`);
  }
  async function copyText(value) {
    try {
      await navigator.clipboard.writeText(value);
      showToast("\uC5F0\uACB0 \uC8FC\uC18C\uB97C \uBCF5\uC0AC\uD588\uC2B5\uB2C8\uB2E4.");
    } catch (error) {
      console.warn("Clipboard API unavailable; using selection fallback.", error);
      const input = document.createElement("textarea");
      input.value = value;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.append(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();
      showToast(copied ? "\uC5F0\uACB0 \uC8FC\uC18C\uB97C \uBCF5\uC0AC\uD588\uC2B5\uB2C8\uB2E4." : "\uC8FC\uC18C\uB97C \uC9C1\uC811 \uC120\uD0DD\uD574 \uBCF5\uC0AC\uD574 \uC8FC\uC138\uC694.");
    }
  }
  function handleSubmit(event) {
    const form = event.target.closest("form[data-form]");
    if (!form) return;
    event.preventDefault();
    const kind = form.dataset.form;
    if (kind === "lookup") {
      const orderNo = String(new FormData(form).get("orderNo") ?? "").trim().toUpperCase();
      customerError = "";
      const url = new URL(location.href);
      url.searchParams.set("order", orderNo);
      location.href = url.pathname + url.search;
      return;
    }
    if (kind === "login") {
      const values = new FormData(form);
      const username = String(values.get("username") ?? "").trim().toLowerCase();
      const password = String(values.get("password") ?? "");
      if (username !== STAFF_ID || password !== STAFF_PASSWORD) {
        renderLogin("\uC544\uC774\uB514 \uB610\uB294 \uBE44\uBC00\uBC88\uD638\uB97C \uD655\uC778\uD574 \uC8FC\uC138\uC694.");
        return;
      }
      data.authenticated = true;
      persist();
      navigate("dashboard");
      showToast("\uB370\uBAA8 \uC6CC\uD06C\uC2A4\uD398\uC774\uC2A4\uC5D0 \uB85C\uADF8\uC778\uD588\uC2B5\uB2C8\uB2E4.");
      return;
    }
    if (kind === "new-order") {
      makeOrder(form);
      return;
    }
    if (kind === "edit-eta") {
      const order = data.orders.find((item) => item.id === form.dataset.id);
      const minutes = Number(new FormData(form).get("minutes"));
      if (!order) {
        modalAction = null;
        render();
        return;
      }
      if (!Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
        showToast("1~180\uBD84 \uC0AC\uC774\uC758 \uC22B\uC790\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
        return;
      }
      order.expectedMinutes = minutes;
      order.expectedAt = new Date(Date.now() + minutes * 6e4).toISOString();
      order.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
      modalAction = null;
      persist();
      render();
      showToast(`\uC608\uC0C1 \uC2DC\uAC04\uC744 \uC57D ${minutes}\uBD84\uC73C\uB85C \uBCC0\uACBD\uD588\uC2B5\uB2C8\uB2E4.`);
      return;
    }
    if (kind === "settings") {
      const values = new FormData(form);
      data.restaurant.name = String(values.get("name") ?? "").trim().slice(0, 50) || "COMPIVOX Restaurant";
      data.restaurant.notice = String(values.get("notice") ?? "").trim().slice(0, 180);
      persist();
      render();
      showToast("\uC2DD\uB2F9 \uC815\uBCF4\uB97C \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4.");
      return;
    }
    if (kind === "rename-table") {
      const table = tableById(form.dataset.id);
      const number = String(new FormData(form).get("number") ?? "").trim().slice(0, 8);
      if (!number || data.tables.some((item) => item.id !== table?.id && item.number.toLowerCase() === number.toLowerCase())) {
        showToast("\uBE44\uC5B4 \uC788\uAC70\uB098 \uC911\uBCF5\uB418\uC9C0 \uC54A\uB294 \uD14C\uC774\uBE14 \uBC88\uD638\uB97C \uC785\uB825\uD574 \uC8FC\uC138\uC694.");
        return;
      }
      if (table) table.number = number;
      persist();
      render();
      showToast("\uD14C\uC774\uBE14 \uBC88\uD638\uB97C \uBCC0\uACBD\uD588\uC2B5\uB2C8\uB2E4.");
      return;
    }
    if (kind === "new-tag") {
      const tableId = String(new FormData(form).get("tableId") ?? "");
      if (!tableById(tableId)) {
        showToast("\uD14C\uC774\uBE14\uC744 \uBA3C\uC800 \uCD94\uAC00\uD574 \uC8FC\uC138\uC694.");
        return;
      }
      data.tags.push({ id: uid("tag"), token: uid("cvx"), tableId, active: true, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
      persist();
      render();
      showToast("NFC \uC5F0\uACB0 \uD0DC\uADF8\uB97C \uB9CC\uB4E4\uC5C8\uC2B5\uB2C8\uB2E4.");
    }
  }
  function handleClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const { action, id } = button.dataset;
    if (action === "logout") {
      data.authenticated = false;
      persist();
      navigate("login");
      return;
    }
    if (action === "focus-new-order") {
      document.getElementById("new-order")?.scrollIntoView({ behavior: "smooth", block: "start" });
      document.getElementById("order-items")?.focus({ preventScroll: true });
      return;
    }
    if (action === "filter-orders") {
      routeFilter = button.dataset.filter;
      renderStaff("orders");
      return;
    }
    if (action === "advance") {
      const order = data.orders.find((item) => item.id === id);
      const next = order && FLOW[FLOW.indexOf(order.status) + 1];
      if (next) updateOrder(order, next);
      return;
    }
    if (action === "cancel-order") {
      modalAction = { title: "\uC8FC\uBB38\uC744 \uCDE8\uC18C\uD560\uAE4C\uC694?", message: "\uCDE8\uC18C\uD55C \uC8FC\uBB38\uC740 \uD65C\uC131 \uC8FC\uBB38 \uBAA9\uB85D\uACFC \uACE0\uAC1D \uD398\uC774\uC9C0\uC5D0\uC11C \uCDE8\uC18C \uC0C1\uD0DC\uB85C \uD45C\uC2DC\uB429\uB2C8\uB2E4.", run: () => {
        const order = data.orders.find((item) => item.id === id);
        updateOrder(order, "canceled");
        showToast("\uC8FC\uBB38\uC744 \uCDE8\uC18C\uD588\uC2B5\uB2C8\uB2E4.");
      } };
      render();
      return;
    }
    if (action === "edit-eta") {
      const order = data.orders.find((item) => item.id === id);
      if (!order) return;
      modalAction = { type: "eta", title: "\uC608\uC0C1 \uC900\uBE44 \uC2DC\uAC04 \uBCC0\uACBD", message: "\uACE0\uAC1D \uD654\uBA74\uC5D0 \uD45C\uC2DC\uD560 \uC608\uC0C1 \uC2DC\uAC04\uC744 \uC785\uB825\uD558\uC138\uC694. 1~180\uBD84 \uC0AC\uC774\uB85C \uC124\uC815\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.", orderId: id, minutes: order.expectedMinutes || 10 };
      render();
      return;
    }
    if (action === "copy-order-link" || action === "copy-tag-url") {
      if (button.dataset.url) void copyText(button.dataset.url);
      return;
    }
    if (action === "add-table") {
      const used = new Set(data.tables.map((table) => table.number));
      let next = 1;
      while (used.has(String(next).padStart(2, "0"))) next += 1;
      data.tables.push({ id: uid("table"), number: String(next).padStart(2, "0"), closed: false });
      persist();
      render();
      showToast(`\uD14C\uC774\uBE14 ${String(next).padStart(2, "0")}\uC744 \uCD94\uAC00\uD588\uC2B5\uB2C8\uB2E4.`);
      return;
    }
    if (action === "toggle-table") {
      const table = tableById(id);
      if (!table) return;
      if (!table.closed && currentOrders(id).length) {
        showToast("\uC9C4\uD589 \uC911\uC778 \uC8FC\uBB38\uC774 \uC788\uC5B4 \uC774\uC6A9\uC744 \uC885\uB8CC\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
        return;
      }
      table.closed = !table.closed;
      persist();
      render();
      return;
    }
    if (action === "delete-table") {
      if (currentOrders(id).length) {
        showToast("\uC9C4\uD589 \uC911\uC778 \uC8FC\uBB38\uC774 \uC788\uB294 \uD14C\uC774\uBE14\uC740 \uC0AD\uC81C\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.");
        return;
      }
      modalAction = { title: "\uD14C\uC774\uBE14\uC744 \uC0AD\uC81C\uD560\uAE4C\uC694?", message: "\uD574\uB2F9 \uD14C\uC774\uBE14\uC5D0 \uC5F0\uACB0\uB41C NFC \uD0DC\uADF8\uB3C4 \uD568\uAED8 \uC0AD\uC81C\uB429\uB2C8\uB2E4.", run: () => {
        data.tables = data.tables.filter((table) => table.id !== id);
        data.tags = data.tags.filter((tag) => tag.tableId !== id);
        persist();
        render();
        showToast("\uD14C\uC774\uBE14\uC744 \uC0AD\uC81C\uD588\uC2B5\uB2C8\uB2E4.");
      } };
      render();
      return;
    }
    if (action === "make-tag") {
      data.tags.push({ id: uid("tag"), token: uid("cvx"), tableId: id, active: true, createdAt: (/* @__PURE__ */ new Date()).toISOString() });
      persist();
      navigate("tags");
      showToast("NFC \uC5F0\uACB0 \uD0DC\uADF8\uB97C \uB9CC\uB4E4\uC5C8\uC2B5\uB2C8\uB2E4.");
      return;
    }
    if (action === "toggle-tag") {
      const tag = data.tags.find((item) => item.id === id);
      if (tag) tag.active = !tag.active;
      persist();
      render();
      showToast(tag?.active ? "\uD0DC\uADF8\uB97C \uD65C\uC131\uD654\uD588\uC2B5\uB2C8\uB2E4." : "\uD0DC\uADF8\uB97C \uBE44\uD65C\uC131\uD654\uD588\uC2B5\uB2C8\uB2E4.");
      return;
    }
    if (action === "delete-tag") {
      modalAction = { title: "NFC \uD0DC\uADF8\uB97C \uC0AD\uC81C\uD560\uAE4C\uC694?", message: "\uC774 \uD0DC\uADF8\uC758 \uACE0\uAC1D \uC5F0\uACB0 \uC8FC\uC18C\uB294 \uB354 \uC774\uC0C1 \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.", run: () => {
        data.tags = data.tags.filter((tag) => tag.id !== id);
        persist();
        render();
        showToast("NFC \uD0DC\uADF8\uB97C \uC0AD\uC81C\uD588\uC2B5\uB2C8\uB2E4.");
      } };
      render();
      return;
    }
    if (action === "reset-demo") {
      modalAction = { title: "\uB370\uBAA8 \uB370\uC774\uD130\uB97C \uCD08\uAE30\uD654\uD560\uAE4C\uC694?", message: "\uD14C\uC774\uBE14, \uD0DC\uADF8, \uC8FC\uBB38\uACFC \uC2DD\uB2F9 \uC124\uC815\uC774 \uCC98\uC74C \uC0C1\uD0DC\uB85C \uB3CC\uC544\uAC11\uB2C8\uB2E4.", run: () => {
        const authenticated = data.authenticated;
        data = seedData();
        data.authenticated = authenticated;
        persist();
        render();
        showToast("\uCD08\uAE30 \uB370\uBAA8 \uB370\uC774\uD130\uB97C \uBD88\uB7EC\uC654\uC2B5\uB2C8\uB2E4.");
      } };
      render();
      return;
    }
    if (action === "close-modal") {
      modalAction = null;
      render();
      return;
    }
    if (action === "confirm-modal") {
      const pending = modalAction;
      modalAction = null;
      pending?.run();
      return;
    }
    if (event.target.classList.contains("modal-backdrop")) {
      modalAction = null;
      render();
    }
  }
  app.addEventListener("click", handleClick);
  app.addEventListener("submit", handleSubmit);
  window.addEventListener("hashchange", render);
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      const updated = JSON.parse(event.newValue);
      if (Array.isArray(updated.orders) && Array.isArray(updated.tables) && Array.isArray(updated.tags)) {
        data = updated;
        render();
      }
    } catch (error) {
      console.warn("Ignored invalid cross-tab demo update.", error);
    }
  });
  window.addEventListener("popstate", render);
  setInterval(() => {
    if (new URLSearchParams(location.search).has("tag")) updateCustomerEtaProgress();
  }, 1e3);
  setInterval(() => {
    if (new URLSearchParams(location.search).has("tag")) renderCustomer();
  }, 3e4);
  render();
})();
