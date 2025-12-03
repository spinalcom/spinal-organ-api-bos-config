"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _spinalModelsBimobject = require("spinal-models-bimobject");

var _spinalModelsBimobject2 = _interopRequireDefault(_spinalModelsBimobject);

var _Utilities = require("./Utilities");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const spinalCore = require("spinal-core-connectorjs");
const globalType = typeof window === "undefined" ? global : window;

class BIMElement extends _spinalModelsBimobject2.default {
  constructor(_id, _name, _type, name = "BIMElement") {
    super(_id, _name, 0);
    if (FileSystem._sig_server) {
      this.add_attr({
        type: _type || "BimObject",
        externalId: ""
      });
    }
  }

  initExternalId() {
    _Utilities.Utilities.getExternalId(this.id.get()).then(_externalId => {
      this.externalId.set(_externalId);
    });
  }

  initExternalIdAsync() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let _externalId = yield _Utilities.Utilities.getExternalId(_this.id.get());
      _this.externalId.set(_externalId);
    })();
  }

  setName(_name) {
    this.name.set(_name);
  }

  toIfc() {
    return `${this.constructor.name}(${this.id.get()},${this.name.get()});`;
  }

}

exports.default = BIMElement;
spinalCore.register_models([BIMElement]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9CSU1FbGVtZW50LmpzIl0sIm5hbWVzIjpbInNwaW5hbENvcmUiLCJyZXF1aXJlIiwiZ2xvYmFsVHlwZSIsIndpbmRvdyIsImdsb2JhbCIsIkJJTUVsZW1lbnQiLCJTcGluYWxCSU1PYmplY3QiLCJjb25zdHJ1Y3RvciIsIl9pZCIsIl9uYW1lIiwiX3R5cGUiLCJuYW1lIiwiRmlsZVN5c3RlbSIsIl9zaWdfc2VydmVyIiwiYWRkX2F0dHIiLCJ0eXBlIiwiZXh0ZXJuYWxJZCIsImluaXRFeHRlcm5hbElkIiwiVXRpbGl0aWVzIiwiZ2V0RXh0ZXJuYWxJZCIsImlkIiwiZ2V0IiwidGhlbiIsIl9leHRlcm5hbElkIiwic2V0IiwiaW5pdEV4dGVybmFsSWRBc3luYyIsInNldE5hbWUiLCJ0b0lmYyIsInJlZ2lzdGVyX21vZGVscyJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBR0E7Ozs7QUFFQTs7Ozs7O0FBTEEsTUFBTUEsYUFBYUMsUUFBUSx5QkFBUixDQUFuQjtBQUNBLE1BQU1DLGFBQWEsT0FBT0MsTUFBUCxLQUFrQixXQUFsQixHQUFnQ0MsTUFBaEMsR0FBeUNELE1BQTVEOztBQVFlLE1BQU1FLFVBQU4sU0FBeUJDLCtCQUF6QixDQUF5QztBQUN0REMsY0FBWUMsR0FBWixFQUFpQkMsS0FBakIsRUFBd0JDLEtBQXhCLEVBQStCQyxPQUFPLFlBQXRDLEVBQW9EO0FBQ2xELFVBQU1ILEdBQU4sRUFBV0MsS0FBWCxFQUFrQixDQUFsQjtBQUNBLFFBQUlHLFdBQVdDLFdBQWYsRUFBNEI7QUFDMUIsV0FBS0MsUUFBTCxDQUFjO0FBQ1pDLGNBQU1MLFNBQVMsV0FESDtBQUVaTSxvQkFBWTtBQUZBLE9BQWQ7QUFJRDtBQUVGOztBQUVEQyxtQkFBaUI7QUFDZkMseUJBQVVDLGFBQVYsQ0FBd0IsS0FBS0MsRUFBTCxDQUFRQyxHQUFSLEVBQXhCLEVBQXVDQyxJQUF2QyxDQUE0Q0MsZUFBZTtBQUN6RCxXQUFLUCxVQUFMLENBQWdCUSxHQUFoQixDQUFvQkQsV0FBcEI7QUFDRCxLQUZEO0FBR0Q7O0FBRUtFLHFCQUFOLEdBQTRCO0FBQUE7O0FBQUE7QUFDMUIsVUFBSUYsY0FBYyxNQUFNTCxxQkFBVUMsYUFBVixDQUF3QixNQUFLQyxFQUFMLENBQVFDLEdBQVIsRUFBeEIsQ0FBeEI7QUFDQSxZQUFLTCxVQUFMLENBQWdCUSxHQUFoQixDQUFvQkQsV0FBcEI7QUFGMEI7QUFHM0I7O0FBSURHLFVBQVFqQixLQUFSLEVBQWU7QUFDYixTQUFLRSxJQUFMLENBQVVhLEdBQVYsQ0FBY2YsS0FBZDtBQUNEOztBQUVEa0IsVUFBUTtBQUNOLFdBQVEsR0FBRSxLQUFLcEIsV0FBTCxDQUFpQkksSUFBSyxJQUFHLEtBQUtTLEVBQUwsQ0FBUUMsR0FBUixFQUFjLElBQUcsS0FBS1YsSUFBTCxDQUFVVSxHQUFWLEVBQWdCLElBQXBFO0FBQ0Q7O0FBL0JxRDs7a0JBQW5DaEIsVTtBQW1DckJMLFdBQVc0QixlQUFYLENBQTJCLENBQUN2QixVQUFELENBQTNCIiwiZmlsZSI6IkJJTUVsZW1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzcGluYWxDb3JlID0gcmVxdWlyZShcInNwaW5hbC1jb3JlLWNvbm5lY3RvcmpzXCIpO1xuY29uc3QgZ2xvYmFsVHlwZSA9IHR5cGVvZiB3aW5kb3cgPT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB3aW5kb3c7XG5cbmltcG9ydCBTcGluYWxCSU1PYmplY3QgZnJvbSBcInNwaW5hbC1tb2RlbHMtYmltb2JqZWN0XCI7XG5cbmltcG9ydCB7XG4gIFV0aWxpdGllc1xufSBmcm9tIFwiLi9VdGlsaXRpZXNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCSU1FbGVtZW50IGV4dGVuZHMgU3BpbmFsQklNT2JqZWN0IHtcbiAgY29uc3RydWN0b3IoX2lkLCBfbmFtZSwgX3R5cGUsIG5hbWUgPSBcIkJJTUVsZW1lbnRcIikge1xuICAgIHN1cGVyKF9pZCwgX25hbWUsIDApO1xuICAgIGlmIChGaWxlU3lzdGVtLl9zaWdfc2VydmVyKSB7XG4gICAgICB0aGlzLmFkZF9hdHRyKHtcbiAgICAgICAgdHlwZTogX3R5cGUgfHwgXCJCaW1PYmplY3RcIixcbiAgICAgICAgZXh0ZXJuYWxJZDogXCJcIlxuICAgICAgfSk7XG4gICAgfVxuXG4gIH1cblxuICBpbml0RXh0ZXJuYWxJZCgpIHtcbiAgICBVdGlsaXRpZXMuZ2V0RXh0ZXJuYWxJZCh0aGlzLmlkLmdldCgpKS50aGVuKF9leHRlcm5hbElkID0+IHtcbiAgICAgIHRoaXMuZXh0ZXJuYWxJZC5zZXQoX2V4dGVybmFsSWQpXG4gICAgfSlcbiAgfVxuXG4gIGFzeW5jIGluaXRFeHRlcm5hbElkQXN5bmMoKSB7XG4gICAgbGV0IF9leHRlcm5hbElkID0gYXdhaXQgVXRpbGl0aWVzLmdldEV4dGVybmFsSWQodGhpcy5pZC5nZXQoKSlcbiAgICB0aGlzLmV4dGVybmFsSWQuc2V0KF9leHRlcm5hbElkKVxuICB9XG5cblxuXG4gIHNldE5hbWUoX25hbWUpIHtcbiAgICB0aGlzLm5hbWUuc2V0KF9uYW1lKVxuICB9XG5cbiAgdG9JZmMoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0oJHt0aGlzLmlkLmdldCgpfSwke3RoaXMubmFtZS5nZXQoKX0pO2BcbiAgfVxuXG59XG5cbnNwaW5hbENvcmUucmVnaXN0ZXJfbW9kZWxzKFtCSU1FbGVtZW50XSlcbiJdfQ==