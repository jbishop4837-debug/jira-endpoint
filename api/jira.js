export default async function handler(req, res) {
  try {
    const JIRA_EMAIL = "jbishop@enphaseenergy.com";
    const JIRA_TOKEN = "YOUR_REAL_TOKEN_HERE";
    const JIRA_DOMAIN = "enphase.atlassian.net";

    const jql =
      'labels = TSE_TIER3_FST_CRITICAL AND updated >= -1d ORDER BY updated DESC';

    const url = `https://${JIRA_DOMAIN}/rest/api/3/search/jql`;

    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString("base64");

    const body = {
      queries: [
        {
          query: jql,
          maxResults: 100
        }
      ],
      fields: ["summary", "status", "updated", "labels"]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const text = await response.text();

    return res.status(response.status).json({
      ok: response.ok,
      status: response.status,
      jiraResponse: text
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      status: 500,
      error: err.toString()
    });
  }
}
