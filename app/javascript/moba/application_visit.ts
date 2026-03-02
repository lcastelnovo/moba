import {
  ApplicationRemote,
  ApplicationVisit,
  SuperglueStore,
  BuildVisitAndRemote,
} from "@thoughtbot/superglue";
import { visit, remote } from "@thoughtbot/superglue/action_creators";

export const buildVisitAndRemote: BuildVisitAndRemote = (ref, store: SuperglueStore) => {
  const appRemote: ApplicationRemote = (path, { dataset, ...options }) => {
    return store.dispatch(remote(path, options));
  };

  const appVisit: ApplicationVisit = (path, { dataset, ...options } = {}) => {
    return store
      .dispatch(visit(path, options))
      .then((meta) => {
        // Check if assets need refresh
        if (meta.needsRefresh) {
          window.location.href = meta.pageKey;
          return meta;
        }

        // Navigate to the new page
        const navigationAction = meta.navigationAction;
        ref.current?.navigateTo(meta.pageKey, {
          action: navigationAction,
        });

        return meta;
      })
      .catch((err) => {
        console.error(err);
        const response = err.response as Response | undefined;

        if (response && response.ok) {
          window.location.href = response.url;
        }
      });
  };

  return { visit: appVisit, remote: appRemote };
};
