"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// For .env file to work
_dotenv["default"].config();

var Server =
/*#__PURE__*/
function () {
  function Server() {
    _classCallCheck(this, Server);

    this.app = (0, _express["default"])();
    this.setDefaultConfiguration();
  }

  _createClass(Server, [{
    key: "setDefaultConfiguration",
    value: function setDefaultConfiguration() {
      this.app.set('port', process.env.SERVER_PORT || 3000);
    }
  }, {
    key: "createStaticFolder",
    value: function createStaticFolder(path) {}
  }, {
    key: "initServer",
    value: function initServer() {
      var _this = this;

      this.app.listen(this.app.get('port'), function () {
        console.log("Red Tetris is running on http://localhost:" + _this.app.get('port'));
      });
    }
  }]);

  return Server;
}();

exports["default"] = Server;