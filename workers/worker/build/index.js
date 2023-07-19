// src/index.ts
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},n=(new Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d7a15213-6a7c-5614-b580-53064908cae2")}catch(e){}}();
var src_default = {
  async fetch(req, env, ctx) {
    await env.QUEUE.send({
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers)
    });
    return new Response("Sent message to the queue");
  },
  async queue(batch, env) {
    for (let message of batch.messages) {
      console.log(
        `message ${message.id} processed: ${JSON.stringify(message.body)}`
      );
    }
  }
};
export {
  src_default as default
};
//# debugId=d7a15213-6a7c-5614-b580-53064908cae2
//# sourceMappingURL=index.js.map
