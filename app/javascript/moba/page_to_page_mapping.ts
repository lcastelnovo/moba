import type { PageMapping } from "@thoughtbot/superglue";
import DashboardIndex from "../../views/moba/dashboard/index";
import ResourceIndex from "../../views/moba/resources/index";
import ResourceShow from "../../views/moba/resources/show";
import ResourceNew from "../../views/moba/resources/new";
import ResourceEdit from "../../views/moba/resources/edit";

export const pageToPageMapping: PageMapping = {
  "moba/dashboard/index": DashboardIndex,
  "moba/resources/index": ResourceIndex,
  "moba/resources/show": ResourceShow,
  "moba/resources/new": ResourceNew,
  "moba/resources/edit": ResourceEdit,
};
