class OrderSubscriber {
  constructor({ discordService, eventBusService }) {
    eventBusService.subscribe("order.placed", async ({ id }) => {
      await discordService.orderNotification(id);
    });
  }
}

export default OrderSubscriber;
