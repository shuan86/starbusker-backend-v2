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
exports.BuskerPerformanceComment = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const Member_1 = require("./Member");
const Busker_1 = require("./Busker");
const BuskerPerformance_1 = require("./BuskerPerformance");
let BuskerPerformanceComment = class BuskerPerformanceComment {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BuskerPerformanceComment.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", Number)
], BuskerPerformanceComment.prototype, "buskerId", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", Number)
], BuskerPerformanceComment.prototype, "performanceId", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", Number)
], BuskerPerformanceComment.prototype, "memberId", void 0);
__decorate([
    typeorm_1.Column(),
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", String)
], BuskerPerformanceComment.prototype, "comment", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp', default: () => 'NOW()' }),
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", String)
], BuskerPerformanceComment.prototype, "time", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Member_1.Member, member => member.buskerPerformanceComments, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Member_1.Member)
], BuskerPerformanceComment.prototype, "member", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Busker_1.Busker, busker => busker.performances, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Busker_1.Busker)
], BuskerPerformanceComment.prototype, "busker", void 0);
__decorate([
    typeorm_1.ManyToOne(type => BuskerPerformance_1.BuskerPerformance, performance => performance.buskerPerformanceComments, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", BuskerPerformance_1.BuskerPerformance)
], BuskerPerformanceComment.prototype, "buskerPerformance", void 0);
BuskerPerformanceComment = __decorate([
    typeorm_1.Entity()
], BuskerPerformanceComment);
exports.BuskerPerformanceComment = BuskerPerformanceComment;
//# sourceMappingURL=BuskerPerformanceComment.js.map