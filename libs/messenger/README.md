## Telegram

### Webhook secure

There is two base strategies to secure webhook endpoints and ensure that only your chat bot will be able to use them:
- limit ip adress by specific subnets
- add secret token into request headers

Limit ip adress relatively simple and only requires local guard that will be able to check if request ip belong to allowed netmasks.

To add secret token into header reqiers existing mechanism from messenger itself.
Lukily telegram allows it. At the moment of registering a webhook we can specify `secret_token` parameter at [https://core.telegram.org/bots/api#setwebhook](setWebhook) api request.

## See:

- [https://core.telegram.org/bots/webhooks](Marvin's Marvellous Guide to All Things Webhook)
- [https://core.telegram.org/bots/api#setwebhook](How to setup webhook)
