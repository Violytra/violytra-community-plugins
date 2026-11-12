import type { Plugin } from '@Violytra/plugins/types'
import type * as store from './store'

declare module '@Violytra/plugins/types' {
	interface PreInitPluginApi<
		O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions,
	> {
		themesInternal: {
			store: typeof store
			plugin: Plugin<any, any>
		}
	}
}

