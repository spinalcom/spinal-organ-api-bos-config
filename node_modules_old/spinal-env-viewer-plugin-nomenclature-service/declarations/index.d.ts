import { NomenclatureTree } from "./modules/NomenclatureTree";
import { NomenclatureProfil } from "./modules/Profil";
declare class SpinalNomenclatureService {
    profileNodeType: string;
    defaultContextName: string;
}
interface SpinalNomenclatureService extends NomenclatureProfil, NomenclatureTree {
}
declare const spinalNomenclatureService: SpinalNomenclatureService;
export { spinalNomenclatureService };
export default spinalNomenclatureService;
