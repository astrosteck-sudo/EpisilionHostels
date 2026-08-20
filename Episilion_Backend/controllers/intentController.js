const OpenAI = require("openai");
const pool = require("../config/db.js");
const { getDistance } = require("geolib");

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
  timeout: 30000, // reasoning models can take longer than plain instruct models
});

// DB helper
const queryDB = (sql, values = []) =>
  pool.query(sql, values).then(([rows]) => rows);

// Classify query — decides which AI mode to use, not whether to block it
function classifyQuery(query) {
  const keywords = [
    "hostel",
    "room",
    "boys",
    "girls",
    "male",
    "female",
    "price",
    "cheap",
    "wifi",
    "laundry",
    "campus",
    "near",
    "close",
    "find",
    "show",
    "list",
    "recommend",
  ];
  return keywords.some((k) => query.toLowerCase().includes(k));
}

function normalizeGender(type) {
  if (!type) return "mixed";

  const t = type.toLowerCase();

  if (
    t.includes("girl") ||
    t.includes("female") ||
    t.includes("women") ||
    t.includes("ladies")
  ) {
    return "female";
  }

  if (t.includes("boy") || t.includes("male") || t.includes("men")) {
    return "male";
  }

  return "mixed";
}

// Format DB data for AI
function formatHostels(hostels, pricing, locations, amenities) {
  // SCHOOL COORDINATES
  const SCHOOL = {
    latitude: 5.660969,
    longitude: -0.166374,
  };

  return hostels.map((h) => {
    const price = pricing.find((p) => p.hostel_id === h.hostel_id);

    const loc = locations.find((l) => l.hostel_id === h.hostel_id);

    // DISTANCE CALCULATION
    let distanceMeters = null;

    if (loc?.latitude && loc?.longitude) {
      distanceMeters = getDistance(SCHOOL, {
        latitude: Number(loc.latitude),
        longitude: Number(loc.longitude),
      });
    }

    return {
      id: h.hostel_id,

      name: h.name,

      // Used internally by applySmartFilter — never sent to the AI as-is.
      genderFilter: normalizeGender(h.type),

      // Sent to the AI verbatim, in the same words the user and your DB
      // use ("Girls" / "Boys" / "Mixed"), so the model never has to
      // translate "girls" -> "female" on its own.
      type: h.type || "Mixed",

      price: price?.price_min || null,

      // NOTE: assumed column name — adjust if your hostels table uses a
      // different field (e.g. cover_image, thumbnail_url).
      image: h.main_image || null,

      distanceMeters,

      amenities: amenities
        .filter((a) => a.hostel_id === h.hostel_id)
        .map((a) => a.amenity),
    };
  });
}

// Smart filtering
function applySmartFilter(data, query) {
  const q = query.toLowerCase();

  let filtered = [...data];

  // CLOSE / NEAR
  if (q.includes("close") || q.includes("near")) {
    filtered.sort(
      (a, b) =>
        (a.distanceMeters ?? Infinity) - (b.distanceMeters ?? Infinity),
    );
  }

  // CHEAP
  if (q.includes("cheap") || q.includes("budget") || q.includes("affordable")) {
    filtered.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
  }

  // WITHIN X METERS
  const metersMatch = q.match(/within\s+(\d+)\s*meters?/);

  if (metersMatch) {
    const maxMeters = parseInt(metersMatch[1]);

    filtered = filtered.filter(
      (h) => h.distanceMeters !== null && h.distanceMeters <= maxMeters,
    );
  }

  // FEMALE
  if (
    q.includes("girls") ||
    q.includes("girl") ||
    q.includes("female") ||
    q.includes("ladies")
  ) {
    filtered = filtered.filter(
      (h) => h.genderFilter === "female" || h.genderFilter === "mixed",
    );
  }

  // MALE
  if (
    q.includes("boys") ||
    q.includes("boy") ||
    q.includes("male") ||
    q.includes("men")
  ) {
    filtered = filtered.filter(
      (h) => h.genderFilter === "male" || h.genderFilter === "mixed",
    );
  }

  return filtered;
}

// Extract limit — ignores numbers that belong to a "within X meters" phrase
function extractLimit(query) {
  const stripped = query.replace(/within\s+\d+\s*meters?/gi, "");
  const match = stripped.match(/\b(\d+)\b/);
  return match ? parseInt(match[1]) : 5;
}

// Parse the hostel-mode AI response.
// The model only returns IDs (+ reason) — never name/price — so nothing
// about the real data can be mis-typed or hallucinated on the way back.
function parseAI(text) {
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  const reasonMatch = cleaned.match(/^Reason:\s*(.+)$/m);
  const overallReason = reasonMatch ? reasonMatch[1].trim() : null;

  const noMatchMatch = cleaned.match(/^No match:\s*(.+)$/m);
  const noMatch = noMatchMatch ? noMatchMatch[1].trim() : null;

  const lines = cleaned.split("\n").filter((l) => l.trim());
  const ids = [];

  for (const line of lines) {
    const match =
      line.match(/^\d+\.\s*\[ID:\s*([^\]]+)\]/) || // [ID: xxx] format
      line.match(/^\d+\.\s*([a-f0-9-]{36})\b/i); // bare UUID format

    if (match) {
      ids.push(match[1].trim());
    }
  }

  return { ids, overallReason, noMatch };
}

// Increment + return remaining AI requests for the current user/device
async function incrementUsage(req) {
  console.log("[incrementUsage] start, isPremium:", req.isPremium);
  const today = new Date().toISOString().split("T")[0];

  if (req.isPremium) {
    await pool.execute(
      `UPDATE usage_logs
       SET requests_used = requests_used + 1
       WHERE user_id = ? AND usage_date = ?`,
      [req.user.user_id, today],
    );

    const [updatedUsage] = await pool.query(
      `SELECT requests_used
       FROM usage_logs
       WHERE user_id = ? AND usage_date = ?`,
      [req.user.user_id, today],
    );

    console.log("[incrementUsage] premium done");
    return req.aiUsage.requests_limit - updatedUsage[0].requests_used;
  }

  // FREE USER — burn one credit from both the account and the device
  await pool.query(
    `UPDATE ai_usage SET requests_used = requests_used + 1 WHERE user_id = ?`,
    [req.user.user_id],
  );

  await pool.query(
    `UPDATE device_ai_usage SET requests_used = requests_used + 1 WHERE device_id = ?`,
    [req.headers["x-device-id"]],
  );

  const [updatedAiUsage] = await pool.query(
    `SELECT requests_used, requests_limit FROM ai_usage WHERE user_id = ?`,
    [req.user.user_id],
  );

  console.log("[incrementUsage] free user done:", updatedAiUsage[0]);
  return updatedAiUsage[0].requests_limit - updatedAiUsage[0].requests_used;
}

// Main controller
exports.searchHostelsAI = async (req, res) => {
  const { query } = req.body;
  console.log("[1] Received query:", query);

  // 1. VALIDATE
  if (!query || typeof query !== "string" || query.trim() === "") {
    return res.status(400).json({ error: "Query is required" });
  }

  const isHostelQuery = classifyQuery(query);
  console.log("[2] isHostelQuery:", isHostelQuery);

  try {
    // 2A. NON-HOSTEL QUERY → plain chatbot mode, no site data involved
    if (!isHostelQuery) {
      console.log("[3a] entering chat branch, calling AI...");
      const completion = await client.chat.completions.create({
        model: "nvidia/nemotron-3-super-120b-a12b",
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content: `You are the assistant for Episilion Hostels, a hostel-booking platform. Answer the user's message helpfully and naturally, like a normal chatbot. Do not mention hostel listings, IDs, or pricing formats — this message isn't about finding a hostel. Keep replies concise.`,
          },
          { role: "user", content: query },
        ],
        max_tokens: 1000,
        // NVIDIA NIM-specific extension for Nemotron 3 reasoning control.
        // Not part of the official OpenAI type defs (the JS SDK just
        // serializes whatever is on the params object, unlike the Python
        // SDK's separate extra_body kwarg), so it goes directly here.
        // @ts-ignore
        chat_template_kwargs: { thinking: false },
      });
      console.log("[4a] AI responded (chat branch)");
      console.log(
        "[4a-raw] content:",
        completion.choices[0].message.content,
        "| reasoning_content:",
        completion.choices[0].message.reasoning_content,
      );

      const message = (
        completion.choices[0].message.content ??
        completion.choices[0].message.reasoning_content ??
        ""
      )
        .replace(/<think>[\s\S]*?<\/think>/g, "")
        .trim();

      const remainingRequests = await incrementUsage(req);
      console.log("[5a] usage incremented, sending response");

      return res.json({ type: "chat", message, remainingRequests });
    }

    // 2B. HOSTEL QUERY → structured search flow
    console.log("[3b] entering hostel branch, querying DB...");
    const hostels = await queryDB("SELECT * FROM hostels");
    console.log("[4b] hostels fetched:", hostels.length);
    const pricing = await queryDB("SELECT * FROM pricing");
    console.log("[5b] pricing fetched:", pricing.length);
    const locations = await queryDB("SELECT * FROM locations");
    console.log("[6b] locations fetched:", locations.length);
    const amenities = await queryDB("SELECT * FROM amenities");
    console.log("[7b] amenities fetched:", amenities.length);

    let aiData = formatHostels(hostels, pricing, locations, amenities);
    aiData = applySmartFilter(aiData, query);
    console.log("[8b] aiData built, count:", aiData.length);

    const limit = extractLimit(query);

    console.log("[9b] calling AI for hostel matching...");
    const completion = await client.chat.completions.create({
      model: "nvidia/nemotron-3-super-120b-a12b",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
You are a hostel recommendation engine.

RULES:
- Use ONLY the provided hostel data
- DO NOT invent hostels
- DO NOT use JSON
- DO NOT use <think>
- DO NOT introduce yourself
- The Reason must describe what the user asked for and what was found, NOT the data or how many hostels exist in the database
- DO NOT explain the database contents
- DO NOT say things like "the database only has mixed hostels"
- Each hostel's "type" field is exactly "Girls", "Boys", or "Mixed" — this matches the user's own wording (e.g. a "girls hostel" request means type "Girls")
- A hostel with type "Mixed" accommodates both male and female residents
- If the user asks for a boys or girls hostel and none exist, recommend Mixed hostels instead
- NEVER return "No match" if the Hostels list below is non-empty
- Only return the "id" field for each hostel you pick. Copy it EXACTLY, character for character, from the data. NEVER output a hostel name or price yourself.

IF hostels match, return ONLY in this exact format:

Reason: [one sentence telling the user what was found based on their request]
1. [ID: <exact id from data>]
2. [ID: <exact id from data>]

IF no hostels match, return ONLY:

No match: [one sentence explaining why and what the user could try instead]
`,
        },
        {
          role: "user",
          content: `
User request:
${query}

Hostels:
${JSON.stringify(
  aiData.map(({ genderFilter, ...visible }) => visible),
)}

Return best matches only.
          `,
        },
      ],
      max_tokens: 1000,
      // Same reasoning-disable flag as the chat branch above.
      // @ts-ignore
      chat_template_kwargs: { thinking: false },
    });
    console.log("[10b] AI responded (hostel branch)");
    console.log(
      "[10b-raw] content:",
      completion.choices[0].message.content,
      "| reasoning_content:",
      completion.choices[0].message.reasoning_content,
    );

    const raw =
      completion.choices[0].message.content ??
      completion.choices[0].message.reasoning_content ??
      "";
    console.log("[10b-combined] Full AI text used for parsing:\n", raw);

    const { ids, overallReason, noMatch } = parseAI(raw);
    console.log("[11b] parsed AI response, ids:", ids, "noMatch:", noMatch);

    // Ground every ID against the real data — anything the model
    // hallucinated or mistyped simply won't be found and is dropped.
    const matched = ids
      .map((id) => aiData.find((h) => h.id === id))
      .filter(Boolean);
    console.log("[12b] matched against real data, count:", matched.length);

    if (noMatch || matched.length === 0) {
      const remainingRequests = await incrementUsage(req);
      console.log("[13b] no_match path, sending response");
      return res.status(404).json({
        type: "no_match",
        message:
          noMatch ||
          "No hostels found matching your request. Try adjusting your search.",
        remainingRequests,
      });
    }

    const finalResults = matched.slice(0, limit);
    const remainingRequests = await incrementUsage(req);
    console.log("[13b] success path, sending response");

    res.json({
      type: "hostels",
      reason: overallReason,
      total: finalResults.length,
      remainingRequests,
      result: finalResults.map((h) => ({
        id: h.id,
        name: h.name,
        price: h.price,
        image: h.image,
      })),
    });
  } catch (err) {
    console.error("[ERROR] searchHostelsAI error:", err);
    res.status(500).json({ error: "AI search failed" });
  }
};