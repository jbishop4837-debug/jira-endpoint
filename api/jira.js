export default async function handler(req, res) {
  try {
    const email = "jbishop@enphaseenergy.com";
    const token = "ATATT3xFfGF0nWnMvymVYBwxd67rbkJE9rzknRvBrFIh3jPix5QmZDmf-xbNS_AJ86o1gRrAkW0Tuv-PyVELKEQh4mw0He1Wh0lAbE0z350BPCuiT224U031K-Wy1SdEDXjChissyUQmCHKKtYyrr0cDQ6z1oRVlpdg36bOKs4_11oyI6HYjELM=B57DE287"; // your API token
    const domain = "enphase.atlassian.net";

    const auth = Buffer.from(`${email}:${token}`).toString("base64");

    // Always fetch issues updated in the last 2 hours
    const jql = 'project = GSS AND updated >= -2h AND issuekey > 0 ORDER BY updated DESC';

    console.log("JQL sent to Jira:", jql);

    const url = `https://${domain}/rest/api/3/search/jql`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        jql: jql,
        maxResults: 100,
        fields: [
          "summary",
          "status",
          "updated",
          "assignee",
          "reporter",
          "customfield_12953" // Site ID
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
