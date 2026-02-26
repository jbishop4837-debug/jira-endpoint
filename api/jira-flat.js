export default async function handler(req, res) {
  try {
    const email = "jbishop@enphaseenergy.com";
    const token = process.env.JIRA_API_TOKEN;
    const domain = "enphase.atlassian.net";

    const auth = Buffer.from(`${email}:${token}`).toString("base64");

    const jql = 'project = GSS AND updated >= -2h AND issuekey > 0 ORDER BY updated DESC';

    const response = await fetch(`https://${domain}/rest/api/3/search/jql`, {
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
          "customfield_12953"
        ]
      })
    });

    const text = await response.text();
    const data = JSON.parse(text);

    const issues = data.issues || [];

    let csv = "key,summary,siteId,assignee,reporter,updated,status,checked\n";

    const now = new Date().toISOString();

    for (const issue of issues) {
      const fields = issue.fields || {};

      const row = [
        issue.key || "",
        (fields.summary || "").replace(/,/g, " "),
        fields.customfield_12953 || "",
        fields.assignee?.displayName?.replace(/,/g, " ") || "",
        fields.reporter?.displayName?.replace(/,/g, " ") || "",
        fields.updated || "",
        fields.status?.name?.replace(/,/g, " ") || "",
        now
      ];

      csv += row.join(",") + "\n";
    }

    res.setHeader("Content-Type", "text/csv");
    res.status(200).send(csv);

  } catch (err) {
    res.status(500).send("error," + err.toString());
  }
}
