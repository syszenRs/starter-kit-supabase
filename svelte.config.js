import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$service: 'src/lib/server/services',
			$controller: 'src/lib/server/controllers',
			$components: 'src/lib/components',
			$constant: 'src/lib/constants',
			$store: 'src/lib/stores',
			$schemaDB: 'src/schemas/database',
			$schemaValidate: 'src/schemas/validation',
			$dto: 'src/lib/dto',
			$serverDto: 'src/lib/server/dto'
		}
	}
};

export default config;
