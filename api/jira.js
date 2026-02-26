export default async function handler(req, res) {
  try {
    const email = "jbishop@enphaseenergy.com";
   const apiToken = process.env.JIRA_API_TOKEN;
    const domain = "enphase.atlassian.net";

    const auth = Buffer.from(`${email}:${apiToken}`).toString("base64");

    // Always fetch issues updated in the last 2 hours
    const jql = "project IN (GSS, SWS, UPGD, EFW) AND labels = TSE_TIER3_FST_CRITICAL ORDER BY created DESC";

const url = `https://${domain}/rest/api/3/search/jql`;

const response = await fetch(url, {
  method: "POST",
  headers: {
    "Authorization": `Basic ${Buffer.from(`${email}:${apiToken}`).toString("base64")}`,
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
  queries: [
    {
      query: jql
    }
  ],
  maxResults: 500,
  fields: [
    "summary",
    "customfield_12953",
    "assignee",
    "reporter",
    "updated",
    "status"
  ]
})

});


    const text = await response.text();

    res.status(response.status).json({
      ok: response.ok,
      status: response.status,
      jiraResponse: text
    });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.toString() });
  }
}
