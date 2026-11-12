/// <reference types="@Violytra/themes-api/hidden" />
/// <reference types="@Violytra/types/plugins/settings.plugins" />

import { ToastActionCreators } from '@Violytra/discord/actions'
import { Design } from '@Violytra/discord/design'
import { onSettingsModulesLoaded } from '@Violytra/discord/modules/settings'
import { ReactNavigationNative } from '@Violytra/externals/react-navigation'
import { lookupGeneratedIconComponent } from '@Violytra/utils/discord'
import { RouteNames, Setting } from './constants'
import { isThemePlugin } from './utils/plugins'
import type { PluginApi, PreInitPluginApi } from '@Violytra/plugins/types'

export let themesInternal: PreInitPluginApi['themesInternal']
export let pluginSettings: PluginApi['pluginSettings']

interface Settings {
	guideShownAt?: number
}

export default plugin<{ jsonStorage: Settings }>({
	jsonStorage: {
		load: true,
	},
	preInit({ themesInternal: internal }) {
		themesInternal = internal
	},
	start({ cleanup, pluginSettings: settings, plugin }) {
		pluginSettings = settings
		// Manage theme plugins under Themes instead of standard plugins settings
		settings.claimPlugins(isThemePlugin)
		cleanup(
			onSettingsModulesLoaded(() => {
				import('./register').then(({ default: register }) =>
					cleanup(register()),
				)
			}),
		)

		if (plugin.startedLate) {
			ToastActionCreators.open('Violytra_THEMES_GUIDE', {
				icon: lookupGeneratedIconComponent('LightbulbIcon'),
				text: (
					<Design.Text variant="text-md/normal" color="text-strong">
						You can now access:{' \n'}
						<Design.Text variant="text-md/bold">
							Settings &gt; Violytra &gt; Themes
						</Design.Text>
					</Design.Text>
				),
				duration: 10000,
			})
		}
	},
	SettingsComponent: () => {
		const navigation = ReactNavigationNative.useNavigation()
		navigation.replace(RouteNames[Setting.ViolytraThemes])

		return (
			<Design.Text>This page isn't supposed to exist. :clueless:</Design.Text>
		)
	},
})


