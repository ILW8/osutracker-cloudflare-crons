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

		// 727 webhook
		let now = new Date();

		let thing = new Intl.DateTimeFormat(undefined, { timeZone: 'Europe/London', hour: 'numeric' }).format(now);
		thing += new Intl.DateTimeFormat(undefined, { timeZone: 'Europe/London', minute: 'numeric' }).format(now);
		if (thing.includes("727")) {
			if (!("DISCORD_WEBHOOK_URL" in env) || env.DISCORD_WEBHOOK_URL.length === 0) {
				console.log("This worker is misconfigured. DISCORD_WEBHOOK_URL is missing.")
				return;
			}
			let webhook_url = env.DISCORD_WEBHOOK_URL
			await fetch(webhook_url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				redirect: "follow",
				body: JSON.stringify({
					"content": null,
					"embeds": [
						{
							"title": "WHEN YOU SEE IT",
							"description": `It's currently ${now.toLocaleString("ca-iso8601", {timeZone: "Europe/London"})} in \`Europe/London\``,
							"color": 1985535,
							"image": {
								"url": "https://cdn.discordapp.com/emojis/811095985597317150.gif"
							}
						}
					],
					"attachments": []
				})
			})
		}
	},
};
