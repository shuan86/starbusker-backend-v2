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
exports.GetPerformanceType = exports.GetPerformancesType = exports.ApplyPerformanceType = exports.BuskerPerformance = void 0;
const typeorm_1 = require("typeorm");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const Busker_1 = require("./Busker");
const BuskerPerformanceComment_1 = require("./BuskerPerformanceComment");
let BuskerPerformance = class BuskerPerformance {
    constructor(buskerId, title, description, time, lineMoney, highestOnlineAmount, latitude, longitude, location) {
        this.buskerId = buskerId;
        this.title = title;
        this.description = description;
        this.time = time;
        this.lineMoney = lineMoney;
        this.highestOnlineAmount = highestOnlineAmount;
        this.latitude = latitude;
        this.longitude = longitude;
        this.location = location;
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BuskerPerformance.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], BuskerPerformance.prototype, "buskerId", void 0);
__decorate([
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], BuskerPerformance.prototype, "title", void 0);
__decorate([
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], BuskerPerformance.prototype, "description", void 0);
__decorate([
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    typeorm_1.Column({ type: 'timestamp', default: () => 'NOW()' }),
    __metadata("design:type", String)
], BuskerPerformance.prototype, "time", void 0);
__decorate([
    typeorm_1.Column({ default: () => 0 }),
    __metadata("design:type", Number)
], BuskerPerformance.prototype, "lineMoney", void 0);
__decorate([
    typeorm_1.Column({ default: () => 0 }),
    __metadata("design:type", Number)
], BuskerPerformance.prototype, "highestOnlineAmount", void 0);
__decorate([
    typeorm_1.Column({ type: "double" }),
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", Number)
], BuskerPerformance.prototype, "latitude", void 0);
__decorate([
    typeorm_1.Column({ type: "double" }),
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", Number)
], BuskerPerformance.prototype, "longitude", void 0);
__decorate([
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    typeorm_1.Column(),
    __metadata("design:type", String)
], BuskerPerformance.prototype, "location", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Busker_1.Busker, busker => busker.performances, { onDelete: 'CASCADE' }),
    typeorm_1.JoinColumn(),
    __metadata("design:type", Busker_1.Busker)
], BuskerPerformance.prototype, "busker", void 0);
__decorate([
    typeorm_1.OneToMany(type => BuskerPerformanceComment_1.BuskerPerformanceComment, comment => comment.performanceId, { cascade: true }),
    __metadata("design:type", Array)
], BuskerPerformance.prototype, "buskerPerformanceComments", void 0);
BuskerPerformance = __decorate([
    typeorm_1.Entity(),
    __metadata("design:paramtypes", [Number, String, String, String, Number, Number, Number, Number, String])
], BuskerPerformance);
exports.BuskerPerformance = BuskerPerformance;
//front-end request format
class ApplyPerformanceType {
    constructor(tile, description, time, location) {
        this.tile = tile;
        this.description = description;
        this.time = time;
        this.location = location;
    }
}
exports.ApplyPerformanceType = ApplyPerformanceType;
class GetPerformancesType {
    constructor(time, page) {
        this.time = time;
        this.page = page;
    }
}
__decorate([
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", String)
], GetPerformancesType.prototype, "time", void 0);
__decorate([
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", Number)
], GetPerformancesType.prototype, "page", void 0);
exports.GetPerformancesType = GetPerformancesType;
class GetPerformanceType {
    constructor(id) {
        this.performanceId = id;
    }
}
__decorate([
    class_validator_1.IsDefined(),
    class_transformer_1.Expose(),
    __metadata("design:type", Number)
], GetPerformanceType.prototype, "performanceId", void 0);
exports.GetPerformanceType = GetPerformanceType;
//# sourceMappingURL=BuskerPerformance.js.map