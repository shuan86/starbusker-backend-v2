"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Member = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const Busker_1 = require("./Busker");
let Member = class Member {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Member.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ length: 20, nullable: false }),
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", String)
], Member.prototype, "account", void 0);
__decorate([
    typeorm_1.Column({ length: 20, nullable: false }),
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", String)
], Member.prototype, "password", void 0);
__decorate([
    typeorm_1.Column({ nullable: false }),
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", Boolean)
], Member.prototype, "male", void 0);
__decorate([
    typeorm_1.Column({ length: 20, nullable: false }),
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", String)
], Member.prototype, "email", void 0);
__decorate([
    typeorm_1.Column({ length: 20, nullable: false }),
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", String)
], Member.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ default: 0, nullable: true }),
    __metadata("design:type", Number)
], Member.prototype, "exp", void 0);
__decorate([
    typeorm_1.Column({ default: '', nullable: true }),
    __metadata("design:type", String)
], Member.prototype, "avatar", void 0);
__decorate([
    typeorm_1.OneToMany(type => Busker_1.Busker, busker => busker.memberId),
    __metadata("design:type", Array)
], Member.prototype, "buskers", void 0);
Member = __decorate([
    typeorm_1.Entity()
], Member);
exports.Member = Member;
//# sourceMappingURL=Member.js.map