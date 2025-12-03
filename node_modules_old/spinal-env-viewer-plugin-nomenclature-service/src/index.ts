/*
 * Copyright 2022 SpinalCom - www.spinalcom.com
 * 
 * This file is part of SpinalCore.
 * 
 * Please read all of the following terms and conditions
 * of the Free Software license Agreement ("Agreement")
 * carefully.
 * 
 * This Agreement is a legally binding contract between
 * the Licensee (as defined below) and SpinalCom that
 * sets forth the terms and conditions that govern your
 * use of the Program. By installing and/or using the
 * Program, you agree to abide by all the terms and
 * conditions stated or referenced herein.
 * 
 * If you do not agree to abide by these terms and
 * conditions, do not demonstrate your acceptance and do
 * not install or use the Program.
 * You should have received a copy of the license along
 * with this file. If not, see
 * <http://resources.spinalcom.com/licenses.pdf>.
 */

import { NomenclatureTree } from "./modules/NomenclatureTree";
import { NomenclatureProfil } from "./modules/Profil";

const globalType: any = typeof window === "undefined" ? global : window;

function applyMixins(derivedConstructor: any, baseConstructors: any[]) {
    baseConstructors.forEach(baseConstructor => {
        Object.getOwnPropertyNames(baseConstructor.prototype)
            .forEach(name => {
                Object.defineProperty(derivedConstructor.prototype,
                    name,
                    Object.
                        getOwnPropertyDescriptor(
                            baseConstructor.prototype,
                            name
                        )
                );
            });
    });
}

class SpinalNomenclatureService {
    public profileNodeType: string = "AttributeConfiguration";
    public defaultContextName: string = "NomenclatureConfiguration";
};

interface SpinalNomenclatureService extends NomenclatureProfil, NomenclatureTree { };

applyMixins(SpinalNomenclatureService, [NomenclatureTree, NomenclatureProfil]);

const spinalNomenclatureService = new SpinalNomenclatureService();

globalType.spinalNomenclatureService = spinalNomenclatureService;

export { spinalNomenclatureService };

export default spinalNomenclatureService;
