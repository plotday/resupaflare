/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Queue consumer: a Worker that can consume from a
 * Queue: https://developers.cloudflare.com/queues/get-started/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

type QueueMessage = {
  url: string;
  method: string;
  headers: Record<string, string>;
};

export interface Env {
  // Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
  QUEUE: Queue<QueueMessage>;
}

export default {
  // Our fetch handler is invoked on a HTTP request: we can send a message to a queue
  // during (or after) a request.
  // https://developers.cloudflare.com/queues/platform/javascript-apis/#producer
  async fetch(
    req: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    // To send a message on a queue, we need to create the queue first
    // https://developers.cloudflare.com/queues/get-started/#3-create-a-queue
    await env.QUEUE.send({
      url: req.url,
      method: req.method,
      headers: Object.fromEntries(req.headers),
    });
    return new Response("Sent message to the queue");
  },
  // The queue handler is invoked when a batch of messages is ready to be delivered
  // https://developers.cloudflare.com/queues/platform/javascript-apis/#messagebatch
  async queue(batch: MessageBatch<Error>, _env: Env): Promise<void> {
    // A queue consumer can make requests to other endpoints on the Internet,
    // write to R2 object storage, query a D1 Database, and much more.
    for (let message of batch.messages) {
      // Process each message (we'll just log these)
      console.log(
        `message ${message.id} processed: ${JSON.stringify(message.body)}`
      );
    }
  },
};
