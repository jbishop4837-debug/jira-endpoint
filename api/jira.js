export default async function handler(req, res) {
  try {
    const JIRA_EMAIL = "jbishop@enphaseenergy.com";
    const JIRA_TOKEN = "ATATT3xFfGF0X8-NEleRVd_C_9CXxuhKiczNYx53mfo6co1XM3Ko0RurjlTocgbgIdrQM_ymemA5klTME3hZE1j3SYtyj7v90QqgNi_7wFaDiOHHpp2YxqN2VuI-eMVjsDqshccqfXcfoGqFOj3d2UOCdFZGQc2TrEFtcxnfZmdurdCY-oCm6Lo=35B37B69";
    const JIRA_DOMAIN = "enphase.atlassian.net";

    const jql =
      'labels = TSE_TIER3_FST_CRITICAL AND updated >= -1d ORDER BY updated DESC';

    const url = `https://${JIRA_DOMAIN}/rest/api/3/search/jql?query=${encodeURIComponent(
      jql
    )}&maxResults=100&fields=summary,updated,status,labels`;

    const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString("base64");

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });

    const text = await response.text();

    return res.status(response.status).json({
      ok: response.ok,
      status: response.status,
      jiraResponse: text,
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      status: 500,
      error: err.toString(),
    });
  }
}
