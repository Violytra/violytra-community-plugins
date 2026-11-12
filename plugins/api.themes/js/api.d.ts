import type { ThemesApi } from '@violytra/themes-api/types'

declare module '@valenced/plugins/types' {
	interface PreInitPluginApi<
		O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions,
	> {
		themes: ThemesApi
	}
}

