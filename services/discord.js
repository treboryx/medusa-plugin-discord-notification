"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _ohmyfetch = require("ohmyfetch");

var _medusaCoreUtils = require("medusa-core-utils");

var _medusaInterfaces = require("medusa-interfaces");

var _builders = require("@discordjs/builders");

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

var DiscordService = /*#__PURE__*/function (_BaseService) {
  (0, _inherits2["default"])(DiscordService, _BaseService);

  var _super = _createSuper(DiscordService);

  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    {
   *      webhook_url: "https://discord.com/api/webhooks/...",
   *      admin_orders_url: "https:..../orders"
   *    }
   */
  function DiscordService(_ref, options) {
    var _this;

    var orderService = _ref.orderService,
        totalsService = _ref.totalsService,
        regionService = _ref.regionService;
    (0, _classCallCheck2["default"])(this, DiscordService);
    _this = _super.call(this);
    _this.orderService_ = orderService;
    _this.totalsService_ = totalsService;
    _this.regionService_ = regionService;
    _this.options_ = options;
    return _this;
  }

  (0, _createClass2["default"])(DiscordService, [{
    key: "orderNotification",
    value: function () {
      var _orderNotification = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(orderId) {
        var order, subtotal, tax_total, discount_total, shipping_total, total, currencyCode, getDisplayAmount, embed, fields;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.orderService_.retrieve(orderId, {
                  select: ["shipping_total", "discount_total", "tax_total", "refunded_total", "gift_card_total", "subtotal", "total"],
                  relations: ["customer", "billing_address", "shipping_address", "discounts", "discounts.rule", "shipping_methods", "payments", "fulfillments", "returns", "swaps", "swaps.return_order", "swaps.payment", "swaps.shipping_methods", "swaps.shipping_address", "swaps.additional_items", "swaps.fulfillments"]
                });

              case 2:
                order = _context.sent;
                subtotal = order.subtotal, tax_total = order.tax_total, discount_total = order.discount_total, shipping_total = order.shipping_total, total = order.total;
                currencyCode = order.currency_code.toUpperCase();

                getDisplayAmount = function getDisplayAmount(amount) {
                  var humanAmount = (0, _medusaCoreUtils.humanizeAmount)(amount, currencyCode);

                  if (_medusaCoreUtils.zeroDecimalCurrencies.includes(currencyCode.toLowerCase())) {
                    return humanAmount;
                  }

                  return humanAmount.toFixed(2);
                };

                embed = new _builders.EmbedBuilder().setTitle("Order Placed").setColor(0xb836d9).setFooter({
                  text: this.options_.name
                }).setTimestamp(Date.now());
                fields = [{
                  name: "Order",
                  value: "[View](".concat(this.options_.admin_orders_url, "/").concat(order.id, ")")
                }, {
                  name: "Customer",
                  value: order.customer.email
                }, {
                  name: "Items",
                  value: order.items.map(function (i) {
                    return "".concat(i.quantity, "x ").concat(i.title);
                  }).join("\n")
                }, {
                  name: "Total",
                  value: "".concat(getDisplayAmount(subtotal), " ").concat(currencyCode, "\n*Shipping*\t").concat(getDisplayAmount(shipping_total), " ").concat(currencyCode, "\n*Discount Total*\t").concat(getDisplayAmount(discount_total), " ").concat(currencyCode, "\n*Tax*\t").concat(getDisplayAmount(tax_total), " ").concat(currencyCode, "\n*Total*\t").concat(getDisplayAmount(total), " ").concat(currencyCode)
                }];
                embed.addFields(fields);
                _context.next = 11;
                return (0, _ohmyfetch.$fetch)(this.options_.webhook_url, {
                  method: "POST",
                  body: {
                    embeds: [embed.toJSON()],
                    username: this.options_.name
                  }
                });

              case 11:
                return _context.abrupt("return", _context.sent);

              case 12:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function orderNotification(_x) {
        return _orderNotification.apply(this, arguments);
      }

      return orderNotification;
    }()
  }]);
  return DiscordService;
}(_medusaInterfaces.BaseService);

var _default = DiscordService;
exports["default"] = _default;