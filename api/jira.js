export default async function handler(req, res) {
  try {
    const email = "jbishop@enphaseenergy.com";
    const token = "ATATT3xFfGF0X8-NEleRVd_C_9CXxuhKiczNYx53mfo6co1XM3Ko0RurjlTocgbgIdrQM_ymemA5klTME3hZE1j3SYtyj7v90QqgNi_7wFaDiOHHpp2YxqN2VuI-eMVjsDqshccqfXcfoGqFOj3d2UOCdFZGQc2TrEFtcxnfZmdurdCY-oCm6Lo=35B37B69";
    const domain = "enphase.atlassian.net";

    const auth = Buffer.from(`${email}:${token}`).toString("base64");

    const body = {
      query: "project = GSS AND updated >= -1d"
    };

    const response = await fetch(`https://${domain}/rest/api/3/search/jql`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(body)
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
