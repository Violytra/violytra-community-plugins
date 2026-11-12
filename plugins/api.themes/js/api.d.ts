import type { ThemesApi } from '@Violytra/themes-api/types'

declare module '@Violytra/plugins/types' {
	interface PreInitPluginApi<
		O extends PluginApiExtensionsOptions = PluginApiExtensionsOptions,
	> {
		themes: ThemesApi
	}
}

