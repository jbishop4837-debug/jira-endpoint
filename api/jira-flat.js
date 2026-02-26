export default async function handler(req, res) {
  try {
    const response = await fetch("https://jira-endpoint.vercel.app/api/jira");
    const data = await response.json();

    // Parse the raw Jira JSON string
    const jira = JSON.parse(data.jiraResponse);
    const issues = jira.issues || [];

    // CSV headers EXACTLY matching your Excel sheet
    let csv = "JIRA Ticket,Issue Description,Site ID,JIRA Assignee,JIRA Reporter,Last Update,Ticket Status,Date Last Checked\n";

    for (const issue of issues) {
      const f = issue.fields;

      const key = issue.key || "";
      const summary = (f.summary || "").replace(/,/g, " ");
      const siteId = f.customfield_12953 || "";
      const assignee = f.assignee?.displayName || "";
      const reporter = f.reporter?.displayName || "";
      const updated = f.updated || "";
      const status = f.status?.name || "";

      csv += `${key},${summary},${siteId},${assignee},${reporter},${updated},${status}\n`;
    }

    res.setHeader("Content-Type", "text/csv");
    res.status(200).send(csv);

  } catch (err) {
    res.status(500).json({ ok: false, error: err.toString() });
  }
}
