/**
 * Hallowed Ground — Supabase Keep-Alive + Limit Monitor
 * ───────────────────────────────────────────────────────
 * Runs every 3 days (cron: 0 12 every3days).
 *
 * What it does:
 *  1. Pings Supabase to prevent the free tier from pausing (7-day inactivity limit).
 *  2. Checks database row count — alerts via email if approaching free-tier limits.
 *  3. If Supabase is unreachable → sends alert email so you know the site is down.
 *
 * Free-tier Supabase limits:
 *  - 500 MB database storage
 *  - 2 GB bandwidth / month
 *  - Project pauses after 7 days of inactivity
 *
 * Secrets required (set via wrangler secret put):
 *  - SUPABASE_ANON_KEY
 *  - ALERT_EMAIL_API_KEY   (Resend API key)
 *
 * Vars in wrangler.toml:
 *  - SUPABASE_URL
 *  - ALERT_EMAIL           (your email address)
 */

const ALERT_THRESHOLD_ROWS = 500_000  // warn if soldiers table exceeds this
const ALERT_EMAIL_FROM     = 'Hallowed Ground <onboarding@resend.dev>'

export default {
  async scheduled(event, env, ctx) {
    const results = {
      timestamp:   new Date().toISOString(),
      ping:        null,
      row_count:   null,
      alert_sent:  false,
      errors:      [],
    };

    // ── 1. Keep-alive ping ───────────────────────────────────────────────────
    try {
      const res = await fetch(
        `${env.SUPABASE_URL}/rest/v1/soldiers?select=id&limit=1`,
        {
          headers: {
            apikey: env.SUPABASE_ANON_KEY,
            Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
          },
        }
      );

      results.ping = res.status;

      if (!res.ok) {
        results.errors.push(`Supabase ping failed: HTTP ${res.status}`);
        await sendAlert(env, {
          subject: '🔴 Hallowed Ground — Supabase is DOWN',
          headline: 'Supabase is unreachable',
          body: `The keep-alive ping returned HTTP ${res.status}. The map at /the-fallen is likely showing the maintenance page. Log in to supabase.com to check the project status.`,
          cta_label: 'Open Supabase Dashboard',
          cta_href: 'https://supabase.com/dashboard',
        });
        results.alert_sent = true;
      }
    } catch (err) {
      results.errors.push(`Ping exception: ${err.message}`);
      await sendAlert(env, {
        subject: '🔴 Hallowed Ground — Supabase unreachable',
        headline: 'Cannot reach Supabase',
        body: `The keep-alive worker could not connect to Supabase at all. Error: ${err.message}. The site may be showing the maintenance page.`,
        cta_label: 'Open Supabase Dashboard',
        cta_href: 'https://supabase.com/dashboard',
      });
      results.alert_sent = true;
    }

    // ── 2. Row count check ───────────────────────────────────────────────────
    if (results.ping === 200) {
      try {
        const countRes = await fetch(
          `${env.SUPABASE_URL}/rest/v1/soldiers?select=id`,
          {
            headers: {
              apikey:  env.SUPABASE_ANON_KEY,
              Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
              Prefer: 'count=exact',
              'Range-Unit': 'items',
              Range: '0-0',
            },
          }
        );

        const contentRange = countRes.headers.get('content-range') || '';
        // content-range: 0-0/58226
        const totalMatch = contentRange.match(/\/(\d+)$/);
        const total = totalMatch ? parseInt(totalMatch[1], 10) : null;
        results.row_count = total;

        if (total && total > ALERT_THRESHOLD_ROWS) {
          await sendAlert(env, {
            subject: `⚠️ Hallowed Ground — ${total.toLocaleString()} rows in database`,
            headline: 'Database row count is high',
            body: `The soldiers table now has ${total.toLocaleString()} rows. Supabase free tier allows 500MB of storage. Consider checking your storage usage in the Supabase dashboard.`,
            cta_label: 'Check Storage Usage',
            cta_href: 'https://supabase.com/dashboard/project/xsmfoollwkfscaqcyhkq/settings/database',
          });
          results.alert_sent = true;
        }
      } catch (err) {
        results.errors.push(`Row count check failed: ${err.message}`);
      }
    }

    console.log('Keep-alive result:', JSON.stringify(results, null, 2));
  },
};

// ── Email alert via Resend ─────────────────────────────────────────────────────
async function sendAlert(env, { subject, headline, body, cta_label, cta_href }) {
  if (!env.ALERT_EMAIL_API_KEY || !env.ALERT_EMAIL) return;

  const html = `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:32px;color:#0F0E0C;background:#fff;">
      <div style="border-top:2px solid #0F0E0C;padding:10px 0;margin-bottom:28px;">
        <p style="margin:0;font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:#888;font-family:monospace;">
          Library of War — System Alert
        </p>
      </div>
      <h1 style="font-size:22px;font-weight:900;margin:0 0 12px;">${headline}</h1>
      <p style="font-size:15px;line-height:1.7;color:#333;margin:0 0 28px;">${body}</p>
      <a href="${cta_href}"
         style="display:inline-block;background:#0F0E0C;color:#fff;font-family:monospace;
                font-size:11px;letter-spacing:0.2em;text-transform:uppercase;
                padding:12px 24px;text-decoration:none;">
        ${cta_label}
      </a>
      <p style="margin-top:32px;font-size:10px;color:#ccc;font-family:monospace;letter-spacing:0.15em;">
        LIBRARY OF WAR · AUTOMATED MONITOR · libraryofwar.com
      </p>
    </div>
  `;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.ALERT_EMAIL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    ALERT_EMAIL_FROM,
        to:      env.ALERT_EMAIL,
        subject,
        html,
      }),
    });
  } catch (err) {
    console.error('Alert email failed:', err.message);
  }
}
