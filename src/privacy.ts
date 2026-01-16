export const privacyPolicyHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Letterkenny Slack App Privacy Policy</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; line-height: 1.5; }
      h1 { margin-bottom: 0.5rem; }
      h2 { margin-top: 1.5rem; }
      code { background: #f4f4f4; padding: 0.1rem 0.3rem; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>Privacy Policy</h1>
    <p>
      Letterkenny for Slack processes the text you submit to the
      <code>/letterkenny</code> slash command in order to generate a rewritten
      message. We do not sell or share your data.
    </p>

    <h2>What we collect</h2>
    <ul>
      <li>Slash command text you submit</li>
      <li>Workspace/team IDs and channel IDs required to respond</li>
    </ul>

    <h2>How we use data</h2>
    <ul>
      <li>Generate the translated response</li>
      <li>Post messages only when you choose to post</li>
    </ul>

    <h2>Data retention</h2>
    <p>
      OAuth tokens are stored per workspace to enable posting. We do not store
      message content beyond the request lifecycle.
    </p>

    <h2>Contact</h2>
    <p>If you have questions, contact the app owner.</p>
  </body>
</html>`;

export const supportHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Letterkenny Slack App Support</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; line-height: 1.5; }
      h1 { margin-bottom: 0.5rem; }
      code { background: #f4f4f4; padding: 0.1rem 0.3rem; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>Support</h1>
    <p>If you need help with the Letterkenny Slack app, email <strong>letterkenny-slack-support@googlegroups.com</strong>.</p>
    <p>Include your workspace name and a brief description of the issue.</p>
  </body>
</html>`;

export const termsHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Letterkenny Slack App Terms of Service</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; line-height: 1.5; }
      h1 { margin-bottom: 0.5rem; }
      h2 { margin-top: 1.5rem; }
    </style>
  </head>
  <body>
    <h1>Terms of Service</h1>
    <p>
      The Letterkenny Slack app is provided “as is” without warranties of any kind.
      By installing and using the app, you agree to use it in compliance with Slack’s
      terms and your organization’s policies.
    </p>

    <h2>Acceptable use</h2>
    <p>
      You are responsible for the content you submit and post. Do not use the app
      to violate laws, Slack policies, or workplace guidelines.
    </p>

    <h2>Availability</h2>
    <p>
      We may modify or discontinue the app at any time without notice.
    </p>

    <h2>Liability</h2>
    <p>
      We are not liable for damages arising from use of the app.
    </p>

    <h2>Contact</h2>
    <p>If you have questions, contact letterkenny-slack-support@googlegroups.com.</p>
  </body>
</html>`;

export const subProcessorsHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Letterkenny Slack App Sub-processors</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; line-height: 1.5; }
      h1 { margin-bottom: 0.5rem; }
      table { border-collapse: collapse; width: 100%; }
      th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
      th { background: #f6f6f6; }
    </style>
  </head>
  <body>
    <h1>Sub-processors</h1>
    <p>We use the following sub-processors to operate the app.</p>
    <table>
      <thead>
        <tr>
          <th>Sub-processor</th>
          <th>Purpose</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Cloudflare</td>
          <td>Hosting and data storage (Workers + KV)</td>
        </tr>
        <tr>
          <td>Slack</td>
          <td>API platform for slash commands and message posting</td>
        </tr>
        <tr>
          <td>Google Groups</td>
          <td>Support email routing</td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
