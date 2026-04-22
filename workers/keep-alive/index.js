/**
 * Hallowed Ground — Supabase Keep-Alive Worker
 * Runs every 3 days to prevent the free-tier Supabase project from pausing.
 * Deploy: wrangler deploy --config workers/keep-alive/wrangler.toml
 */
export default {
  async scheduled(event, env, ctx) {
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/soldiers?select=id&limit=1`,
      { headers: { apikey: env.SUPABASE_ANON_KEY } }
    );
    console.log(`Keep-alive ping: ${res.status}`);
  },
};
