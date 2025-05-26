// lib/subscribeWithReconnect.js
export default async function subscribeWithReconnect(
  pb,
  collection,
  topic,
  handler
) {
  const socket = pb.realtime.client;

  // Ensure fresh connection
  if (!socket || socket.readyState !== 1) {
    try {
      await pb.realtime.disconnect();
      await pb.realtime.connect();
    } catch (connectError) {
      console.error("❌ Failed to (re)connect realtime socket:", connectError);
      throw connectError;
    }
  }

  try {
    return await pb.collection(collection).subscribe(topic, handler);
  } catch (err) {
    if (err.status === 404) {
      console.warn("⚠️ Missing or invalid client ID. Reinitializing...");
      try {
        await pb.realtime.disconnect();
        await pb.realtime.connect();
        return await pb.collection(collection).subscribe(topic, handler);
      } catch (reconnectError) {
        console.error("🔥 Reconnect failed after 404:", reconnectError);
        throw reconnectError;
      }
    }

    // Other non-404 errors
    throw err;
  }
}
