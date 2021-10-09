"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sum = exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = exports.getUsers = void 0;
const user_entity_1 = require("../entities/user.entity");
const typeorm_1 = require("typeorm");
function getUsers() {
    return typeorm_1.getRepository(user_entity_1.User).find();
}
exports.getUsers = getUsers;
function createUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        let newUser = typeorm_1.getRepository(user_entity_1.User).create(data);
        return yield typeorm_1.getRepository(user_entity_1.User).save(newUser);
    });
}
exports.createUser = createUser;
function getUser(id) {
    return typeorm_1.getRepository(user_entity_1.User).findOne(id);
}
exports.getUser = getUser;
function updateUser(id, data) {
    return __awaiter(this, void 0, void 0, function* () {
        let modifyUser = new user_entity_1.User();
        modifyUser.name = data.name;
        modifyUser.email = data.email;
        modifyUser.introduction = data.introduction;
        yield typeorm_1.getRepository(user_entity_1.User).update(id, modifyUser);
        return yield typeorm_1.getRepository(user_entity_1.User).findOne(id);
    });
}
exports.updateUser = updateUser;
function deleteUser(id) {
    return typeorm_1.getRepository(user_entity_1.User).delete(id);
}
exports.deleteUser = deleteUser;
const sum = (a, b) => a + b;
exports.sum = sum;
//# sourceMappingURL=user.repo.js.map