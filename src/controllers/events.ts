import { SlackEventsService } from "../services";
import Express from "express";

const eventsService = new SlackEventsService();

async function eventsController(req: Express.Request, res: Express.Response) {
  const body = req.body;
  const requestType = body?.type;
  if (requestType === "url_verification") {
    return res.send({
      challenge: body.challenge,
    });
  }
  console.log("RECIEVED REQUEST EVENTS:", body?.event);

  const isBotMessage = !!body?.event?.bot_id;
  // listening for only non-bot messages
  if (requestType === "event_callback" && !isBotMessage) {
    const eventType = body?.event?.type;

    const isFollowUp = eventType === "message" && body?.event?.thread_ts;
    const isAppMention = eventType === "app_mention";
    const isDm = eventType === "message" && body?.event?.channel_type === "im";

    if (isAppMention || isFollowUp || isDm)
      return await eventsService.answerQuestion(req, res);
  }

  return res.send("OK").status(200);
}

export { eventsController };
