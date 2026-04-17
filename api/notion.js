// api/notion.js (Vercel Serverless Function)
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_KEY });

export default async function handler(req, res) {
  const { parentPageId } = req.query;

  // 1. Check if the database exists (simplified search)
  const search = await notion.search({
    query: "Graph Tool Storage",
    filter: { property: "object", value: "database" }
  });

  let databaseId;

  if (search.results.length === 0) {
    // 2. SELF-PROVISION: Create the database if it's a blank slate
    const newDb = await notion.databases.create({
      parent: { page_id: parentPageId },
      title: [{ text: { content: "Graph Tool Storage" } }],
      properties: {
        Name: { title: {} },
        X: { number: {} },
        Y: { number: {} },
        Connections: { relation: { database_id: "", dual_property: {} } }
      }
    });
    databaseId = newDb.id;
  } else {
    databaseId = search.results[0].id;
  }

  // 3. Fetch current nodes
  const pages = await notion.databases.query({ database_id: databaseId });
  res.status(200).json({ pages: pages.results, databaseId });
}