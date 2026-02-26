export default async function handler(req, res) {
  try {
    const email = "jbishop@enphaseenergy.com";
    const apiToken = process.env.JIRA_API_TOKEN;
    const domain = "enphase.atlassian.net";

    const auth = Buffer.from(`${email}:${apiToken}`).toString("base64");

    const jql = "project IN (GSS, SWS, UPGD, EFW) AND labels = TSE_TIER3_FST_CRITICAL ORDER BY created DESC";

    const url = `https://${domain}/rest/api/3/search?jql=${encodeURIComponent(jql)}&maxResults=500`;

    const response = await fetch(url, {
  method: "GET",
  headers: {
    "Authorization": `Basic ${auth}`,
    "Accept": "application/json"
  }
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
