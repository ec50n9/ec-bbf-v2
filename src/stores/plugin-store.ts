import type { MixedData } from "@/services/types";
import type {
  EcDataProvider,
  EcDataSelector,
  EcPlugin,
  InfoView,
  ActionConfig,
} from "@/types/plugin";
import { create } from "zustand";

type PluginStore = {
  allPlugins: EcPlugin<any>[];
  providers: EcDataProvider[];
  selectors: EcDataSelector<MixedData>[];
  actions: ActionConfig<MixedData>[];
  infoViews: InfoView<MixedData>[];
  currentProviderId: string | undefined;
  currentSelectorId: string | undefined;
  currentProvider: () => EcDataProvider | null;
  currentSelector: () => EcDataSelector<MixedData> | null;
  initPlugins: () => Promise<void>;
  selectProvider: (id: string) => void;
  selectSelector: (id: string) => void;
};

export const usePluginStore = create<PluginStore>((set, get) => ({
  allPlugins: [],
  providers: [],
  selectors: [],
  actions: [],
  infoViews: [],
  currentProviderId: undefined,
  currentSelectorId: undefined,

  currentProvider() {
    const { providers, currentProviderId } = get();
    if (!providers.length || !currentProviderId) return null;

    return (
      providers.find((provider) => provider.id === currentProviderId) || null
    );
  },
  currentSelector() {
    const { selectors, currentSelectorId } = get();
    if (!selectors.length || !currentSelectorId) return null;

    return (
      selectors.find((selector) => selector.id === currentSelectorId) || null
    );
  },

  initPlugins: async () => {
    const pluginFiles = import.meta.glob("@/ec-plugins/*.tsx");
    const plugins: EcPlugin<any>[] = [];
    for (const path in pluginFiles) {
      const mod = await pluginFiles[path]();
      plugins.push(mod.default);
    }

    const providers = plugins
      .filter((plugin) => plugin.dataProvider)
      .map((plugin) => plugin.dataProvider as EcDataProvider);

    const selectors = plugins
      .filter((plugin) => plugin.dataSelector)
      .map((plugin) => plugin.dataSelector as EcDataSelector<MixedData>);

    const actions = plugins.flatMap((plugin) => plugin.actions || []);

    const infoViews = plugins.flatMap((plugin) => plugin.infoViews || []);

    set({
      allPlugins: plugins,
      providers,
      selectors,
      actions,
      infoViews,
      currentProviderId: providers[0]?.id || undefined,
      currentSelectorId: selectors[0]?.id || undefined,
    });
  },

  selectProvider: (id: string) => {
    set({ currentProviderId: id });
  },

  selectSelector: (id: string) => {
    set({ currentSelectorId: id });
  },
}));
