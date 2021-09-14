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
exports.GetBuskerType = exports.EnrollBuskerType = exports.Busker = exports.BuskerType = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const Member_1 = require("./Member");
const BuskerPerformance_1 = require("./BuskerPerformance");
const BuskerPerformanceComment_1 = require("./BuskerPerformanceComment");
var BuskerType;
(function (BuskerType) {
    BuskerType[BuskerType["other"] = 0] = "other";
    BuskerType[BuskerType["singer"] = 1] = "singer";
    BuskerType[BuskerType["drawer"] = 2] = "drawer";
    BuskerType[BuskerType["drummer"] = 3] = "drummer";
})(BuskerType = exports.BuskerType || (exports.BuskerType = {}));
let Busker = class Busker {
    constructor(memberId, type, description, likeAmount) {
        this.memberId = memberId;
        this.type = type;
        this.description = description;
        this.likeAmount = likeAmount;
    }
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
    typeorm_1.Column({ default: 0, nullable: true }),
    __metadata("design:type", Number)
], Busker.prototype, "likeAmount", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Member_1.Member, member => member.buskers),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Member_1.Member)
], Busker.prototype, "member", void 0);
__decorate([
    typeorm_1.OneToMany(type => BuskerPerformance_1.BuskerPerformance, performance => performance.buskerId, { cascade: true }),
    __metadata("design:type", Array)
], Busker.prototype, "performances", void 0);
__decorate([
    typeorm_1.OneToMany(type => BuskerPerformanceComment_1.BuskerPerformanceComment, comment => comment.buskerId, { cascade: true }),
    __metadata("design:type", Array)
], Busker.prototype, "buskerPerformanceComments", void 0);
Busker = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Number, Number, String, Number])
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
class GetBuskerType {
    constructor(id) {
        this.id = id;
    }
}
exports.GetBuskerType = GetBuskerType;
//# sourceMappingURL=Busker.js.map