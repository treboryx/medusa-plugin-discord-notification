## medusa-plugin-discord-notification

![Medusa Hackathon 2022 - medusa-plugin-discord-notification](https://i.imgur.com/EDNGE1b.jpg)

## About

### Participants

Robert - @treboryx

### Description

Receive order notifications in Discord via a webhook for your Medusa store.

### Preview

_Not Applicable_

## Set up this plugin

### Requirements

This plugin is made to work with MedusaJS. You can find the documentation [here](https://medusajs.com/docs/). Here's what you'll need to get started with this plugin:

- [Node.js](https://nodejs.org/en/)
- [Medusa Store](https://docs.medusajs.com/quickstart/quick-start/)

### Install Project

1. Install the plugin:

```bash
npm install medusa-plugin-discord-notification

# or

yarn add medusa-plugin-discord-notification
```

2. Add the plugin to your `medusa-config.js` file (inside the `plugins` array):

```js
  {
    resolve: `medusa-plugin-discord-notification`,
    options: {
      name: "My Store",
      webhook_url: `<WEBHOOK_URL>`,
      admin_orders_url: `http://localhost:7001/a/orders`,
    },
  }
```

4. Copy the webhook URL you created through Discord\* and paste it into the `webhook_url` in the plugin's options

5. 🎉Voila! You'll start receiving messages on your discord's channel whenever an order is created.

## Resources

- [Medusa Hackathon 2022](https://medusajs.com/blog/medusa-hackathon)
- [Medusa’s GitHub repository](https://github.com/medusajs/medusa)
- [Medusa Documentation](https://docs.medusajs.com/)

### How to create a webhook in Discord

1. Go to your server settings and select the `Integrations` tab
2. Click on `Webhooks` and then `Create Webhook`
3. Select the channel you wish to create the webhook for (they are per channel)
4. Give your webhook a name and copy the URL
