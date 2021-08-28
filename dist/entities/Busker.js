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
exports.EnrollBuskerType = exports.Busker = exports.BuskerKind = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const Member_1 = require("./Member");
const BuskerPerformance_1 = require("./BuskerPerformance");
var BuskerKind;
(function (BuskerKind) {
    BuskerKind[BuskerKind["other"] = 0] = "other";
    BuskerKind[BuskerKind["singer"] = 1] = "singer";
    BuskerKind[BuskerKind["drawer"] = 2] = "drawer";
    BuskerKind[BuskerKind["drummer"] = 3] = "drummer";
})(BuskerKind = exports.BuskerKind || (exports.BuskerKind = {}));
let Busker = class Busker {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Busker.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Busker.prototype, "memberId", void 0);
__decorate([
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Busker.prototype, "type", void 0);
__decorate([
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], Busker.prototype, "description", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Member_1.Member, member => member.buskers, { onDelete: 'CASCADE' }),
    __metadata("design:type", Member_1.Member)
], Busker.prototype, "member", void 0);
__decorate([
    typeorm_1.OneToMany(type => BuskerPerformance_1.BuskerPerformance, performance => performance.buskerId, { cascade: true }),
    __metadata("design:type", Array)
], Busker.prototype, "performances", void 0);
Busker = __decorate([
    typeorm_1.Entity()
], Busker);
exports.Busker = Busker;
//front-end request format
class EnrollBuskerType {
    constructor(description, type) {
        this.description = description;
        this.type = type;
    }
}
exports.EnrollBuskerType = EnrollBuskerType;
//# sourceMappingURL=Busker.js.map