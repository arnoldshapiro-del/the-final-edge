// Serverless neural-voice TTS for the click-to-read feature.
//
// Uses the npm package "msedge-tts" (v2.x) to synthesize speech via Microsoft
// Edge's free Read-Aloud endpoint — NO API key required. Returns an MP3 the
// browser plays as an <audio> element, which is why it works in Edge even
// though Edge's window.speechSynthesis voice list is broken.
//
// Endpoint:  /.netlify/functions/tts?voice=en-US-AvaNeural&text=Hello
//
// This file is ESM because the app's package.json sets "type": "module".
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// Only allow known-good neural voices; anything else falls back to Ava.
const ALLOWED = new Set([
  "en-US-AvaNeural",
  "en-US-EmmaNeural",
  "en-US-JennyNeural",
  "en-US-AriaNeural",
  "en-US-MichelleNeural",
  "en-US-AndrewNeural",
  "en-US-BrianNeural",
  "en-US-GuyNeural",
  "en-US-ChristopherNeural",
]);
const DEFAULT_VOICE = "en-US-AvaNeural";

export const handler = async (event) => {
  try {
    const params = (event && event.queryStringParameters) || {};
    const text = String(params.text || "").slice(0, 5000).trim();
    let voice = String(params.voice || "");
    if (!ALLOWED.has(voice)) voice = DEFAULT_VOICE;

    if (!text) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "text/plain" },
        body: "Missing text parameter",
      };
    }

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    // toStream() is synchronous in msedge-tts 2.x and returns a Node Readable.
    const { audioStream } = tts.toStream(text);

    const buffer = await new Promise((resolve, reject) => {
      const chunks = [];
      const timer = setTimeout(() => reject(new Error("TTS timeout")), 22000);
      audioStream.on("data", (chunk) => chunks.push(chunk));
      audioStream.on("end", () => {
        clearTimeout(timer);
        resolve(Buffer.concat(chunks));
      });
      audioStream.on("error", (err) => {
        clearTimeout(timer);
        reject(err);
      });
    });

    try { tts.close(); } catch (_e) { /* ignore */ }

    if (!buffer || buffer.length < 1) throw new Error("Empty audio");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=86400",
      },
      body: buffer.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "text/plain" },
      body: "TTS error: " + (err && err.message ? err.message : String(err)),
    };
  }
};
