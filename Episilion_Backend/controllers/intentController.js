const OpenAI = require("openai");
const pool = require("../config/db.js");
const { getDistance } = require("geolib");

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

// DB helper
const queryDB = (sql, values = []) =>
  pool.query(sql, values).then(([rows]) => rows);

// Classify query
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

      type: normalizeGender(h.type),

      price: price?.price_min || null,

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
    filtered.sort((a, b) => a.distanceMeters - b.distanceMeters);
  }

  // CHEAP
  if (q.includes("cheap") || q.includes("budget") || q.includes("affordable")) {
    filtered.sort((a, b) => a.price - b.price);
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
      (h) => h.type === "female" || h.type === "mixed",
    );
  }

  // MALE
  if (
    q.includes("boys") ||
    q.includes("boy") ||
    q.includes("male") ||
    q.includes("men")
  ) {
    filtered = filtered.filter((h) => h.type === "male" || h.type === "mixed");
  }

  return filtered;
}

// Extract limit
function extractLimit(query) {
  const match = query.match(/\b(\d+)\b/);
  return match ? parseInt(match[1]) : 5;
}

// Parse AI response — handles both [ID: xxx] and bare UUID formats
function parseAI(text) {
  const cleaned = text.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  // Extract overall reason
  const reasonMatch = cleaned.match(/^Reason:\s*(.+)$/m);
  const overallReason = reasonMatch ? reasonMatch[1].trim() : null;

  // Extract no match message
  const noMatchMatch = cleaned.match(/^No match:\s*(.+)$/m);
  const noMatch = noMatchMatch ? noMatchMatch[1].trim() : null;

  const lines = cleaned.split("\n").filter((l) => l.trim());
  const results = [];

  for (const line of lines) {
    // Try both formats the AI might return
    const match =
      line.match(/^\d+\.\s*\[ID:\s*([^\]]+)\]\s*(.+?)\s*-\s*(\d+)/) || // [ID: xxx] format
      line.match(/^\d+\.\s*([a-f0-9-]{36})\s+(.+?)\s*-\s*(\d+)/i); // bare UUID format

    if (match) {
      results.push({
        id: match[1].trim(),
        name: match[2].trim(),
        price: parseInt(match[3].trim()),
      });
    }
  }

  return { results, overallReason, noMatch };
}

// Main controller
exports.searchHostelsAI = async (req, res) => {
  const { query } = req.body;

  // 1. VALIDATE
  if (!query || typeof query !== "string" || query.trim() === "") {
    return res.status(400).json({ error: "Query is required" });
  }

  // 2. CLASSIFY
  if (!classifyQuery(query)) {
    return res.status(400).json({
      error: "out_of_scope",
      message:
        "I can only help you find hostels. Try asking something like 'show me cheap girls hostels near campus with wifi'.",
    });
  }

  try {
    // 3. FETCH DATA
    const hostels = await queryDB("SELECT * FROM hostels");
    const pricing = await queryDB("SELECT * FROM pricing");
    const locations = await queryDB("SELECT * FROM locations");
    const amenities = await queryDB("SELECT * FROM amenities");

    let aiData = formatHostels(hostels, pricing, locations, amenities);

    // 4. SMART FILTER
    aiData = applySmartFilter(aiData, query);

    // 5. EXTRACT LIMIT
    const limit = extractLimit(query);

    // 6. CALL AI
    const completion = await client.chat.completions.create({
      model: "meta/llama-3.1-8b-instruct",
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
- A hostel with type "mixed" accommodates both male and female residents
- If the user asks for a boys or girls hostel and none exist, recommend mixed hostels instead
- NEVER return "No match" if any hostels exist in the data


IF hostels match, return ONLY in this exact format:

Reason: [one sentence telling the user what was found based on their request. Example: "Here are 3 affordable girls hostels near campus with wifi for you."]
1. [ID: uuid] Hostel Name - price
2. [ID: uuid] Hostel Name - price

IF no hostels match, return ONLY:

No match: [one sentence explaining why and what the user could try instead]


Where price is a number only, no currency symbol.
`,
        },
        {
          role: "user",
          content: `
User request:
${query}

Hostels:
${JSON.stringify(aiData)}

Return best matches only.
          `,
        },
      ],
      max_tokens: 300,
    });

    const raw = completion.choices[0].message.content;
    // console.log("RAW AI:", raw);

    // 7. PARSE
    const { results, overallReason, noMatch } = parseAI(raw);

    // 8. HANDLE NO MATCH
    if (noMatch || results.length === 0) {
      return res.status(404).json({
        error: "no_match",
        message:
          noMatch ||
          "No hostels found matching your request. Try adjusting your search.",
      });
    }

    // 9. ENFORCE LIMIT
    // 9. LIMIT RESULTS
    const finalResults = results.slice(0, limit);

    // 10. INCREMENT AI USAGE
    await queryDB(
      `
  UPDATE ai_usage
  SET requests_used = requests_used + 1
  WHERE user_id = ?
  `,
      [req.user.user_id],
    );

    await queryDB(
      `
  UPDATE device_ai_usage
  SET requests_used =
      requests_used + 1
  WHERE device_id = ?
  `,
      [req.headers["x-device-id"]],
    );

    // 11. CALCULATE REMAINING REQUESTS
    const remaining =
      req.aiUsage.requests_limit - (req.aiUsage.requests_used + 1);

    const today = new Date().toISOString().split("T")[0];

    await pool.execute(
      `UPDATE usage_logs
   SET requests_used =
   requests_used + 1
   WHERE user_id = ?
   AND usage_date = ?`,
      [req.user.id, today],
    );

    // 12. FINAL RESPONSE
    res.json({
      reason: overallReason,
      total: finalResults.length,
      remainingRequests: remaining,

      result: finalResults.map((h) => ({
        id: h.id,
        name: h.name,
        price: h.price,
      })),
    });
  } catch (err) {
    console.error("searchHostelsAI error:", err);
    res.status(500).json({ error: "AI search failed" });
  }
};
