import { $fetch } from "ohmyfetch";
import { humanizeAmount, zeroDecimalCurrencies } from "medusa-core-utils";
import { BaseService } from "medusa-interfaces";
import { EmbedBuilder } from "@discordjs/builders";

class DiscordService extends BaseService {
  /**
   * @param {Object} options - options defined in `medusa-config.js`
   *    {
   *      webhook_url: "https://discord.com/api/webhooks/...",
   *      admin_orders_url: "https:..../orders"
   *    }
   */
  constructor({ orderService, totalsService, regionService }, options) {
    super();

    this.orderService_ = orderService;

    this.totalsService_ = totalsService;

    this.regionService_ = regionService;

    this.options_ = options;
  }

  async orderNotification(orderId) {
    const order = await this.orderService_.retrieve(orderId, {
      select: [
        "shipping_total",
        "discount_total",
        "tax_total",
        "refunded_total",
        "gift_card_total",
        "subtotal",
        "total",
      ],
      relations: [
        "customer",
        "billing_address",
        "shipping_address",
        "discounts",
        "discounts.rule",
        "shipping_methods",
        "payments",
        "fulfillments",
        "returns",
        "swaps",
        "swaps.return_order",
        "swaps.payment",
        "swaps.shipping_methods",
        "swaps.shipping_address",
        "swaps.additional_items",
        "swaps.fulfillments",
      ],
    });

    const { subtotal, tax_total, discount_total, shipping_total, total } =
      order;

    const currencyCode = order.currency_code.toUpperCase();
    const getDisplayAmount = (amount) => {
      const humanAmount = humanizeAmount(amount, currencyCode);
      if (zeroDecimalCurrencies.includes(currencyCode.toLowerCase())) {
        return humanAmount;
      }
      return humanAmount.toFixed(2);
    };

    const embed = new EmbedBuilder()
      .setTitle("Order Placed")
      .setColor(0xb836d9)
      .setFooter({ text: this.options_.name })
      .setTimestamp(Date.now());

    const fields = [
      {
        name: "Order",
        value: `[View](${this.options_.admin_orders_url}/${order.id})`,
      },
      { name: "Customer", value: order.customer.email },

      {
        name: "Items",
        value: order.items.map((i) => `${i.quantity}x ${i.title}`).join("\n"),
      },
      {
        name: "Total",
        value: `${getDisplayAmount(
          subtotal
        )} ${currencyCode}\n*Shipping*\t${getDisplayAmount(
          shipping_total
        )} ${currencyCode}\n*Discount Total*\t${getDisplayAmount(
          discount_total
        )} ${currencyCode}\n*Tax*\t${getDisplayAmount(
          tax_total
        )} ${currencyCode}\n*Total*\t${getDisplayAmount(
          total
        )} ${currencyCode}`,
      },
    ];
    embed.addFields(fields);

    return await $fetch(this.options_.webhook_url, {
      method: "POST",
      body: { embeds: [embed.toJSON()], username: this.options_.name },
    });
  }
}

export default DiscordService;
