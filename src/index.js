/**
 * Welcome to Cloudflare Workers! This is your first scheduled worker.
 *
 * - Run `wrangler dev --local` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/cdn-cgi/mf/scheduled"` to trigger the scheduled event
 * - Go back to the console to see what your worker has logged
 * - Update the Cron trigger in wrangler.toml (see https://developers.cloudflare.com/workers/wrangler/configuration/#triggers)
 * - Run `wrangler publish --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/runtime-apis/scheduled-event/
 */

//             ilw8      [k]       kciceblue duckymachete sadshiba
const users = [14167692, 16551387, 27108477, 32005855,    10747626]

export default {
	async scheduled(controller, env, ctx) {
		let userToFetch = users[new Date().getMinutes() % users.length];
		let target = `https://osutrack-api.ameo.dev/update?user=${userToFetch}&mode=0`;
		let res = await fetch(target, {
			method: "POST",
		})
		if (res.status < 200 || res.status >= 400) {
			console.log(`[POST - ${res.status}] Request to ${target} failed with return status code ${res.status}`);
		} else {
			console.log(`[POST - ${res.status}] Successfully updated user ${userToFetch}`);
		}
	},
};
