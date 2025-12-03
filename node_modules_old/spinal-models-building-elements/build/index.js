"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BIMElement = exports.AbstractElement = undefined;

var _AbstractElement = require("./AbstractElement");

var _AbstractElement2 = _interopRequireDefault(_AbstractElement);

var _BIMElement = require("./BIMElement");

var _BIMElement2 = _interopRequireDefault(_BIMElement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const spinalCore = require("spinal-core-connectorjs");
const globalType = typeof window === "undefined" ? global : window;

exports.AbstractElement = _AbstractElement2.default;
exports.BIMElement = _BIMElement2.default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJzcGluYWxDb3JlIiwicmVxdWlyZSIsImdsb2JhbFR5cGUiLCJ3aW5kb3ciLCJnbG9iYWwiLCJBYnN0cmFjdEVsZW1lbnQiLCJCSU1FbGVtZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBS0E7Ozs7QUFDQTs7Ozs7O0FBTkEsTUFBTUEsYUFBYUMsUUFBUSx5QkFBUixDQUFuQjtBQUNBLE1BQU1DLGFBQWEsT0FBT0MsTUFBUCxLQUFrQixXQUFsQixHQUFnQ0MsTUFBaEMsR0FBeUNELE1BQTVEOztRQVFFRSxlLEdBQUFBLHlCO1FBQ0FDLFUsR0FBQUEsb0IiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzcGluYWxDb3JlID0gcmVxdWlyZShcInNwaW5hbC1jb3JlLWNvbm5lY3RvcmpzXCIpO1xuY29uc3QgZ2xvYmFsVHlwZSA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB3aW5kb3c7XG5cblxuXG5pbXBvcnQgQWJzdHJhY3RFbGVtZW50IGZyb20gJy4vQWJzdHJhY3RFbGVtZW50JztcbmltcG9ydCBCSU1FbGVtZW50IGZyb20gJy4vQklNRWxlbWVudCc7XG5cbmV4cG9ydCB7XG4gIEFic3RyYWN0RWxlbWVudCxcbiAgQklNRWxlbWVudFxufSJdfQ==