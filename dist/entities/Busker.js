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
exports.Busker = void 0;
const typeorm_1 = require("typeorm");
const Member_1 = require("./Member");
var BuskerKind;
(function (BuskerKind) {
    BuskerKind[BuskerKind["singer"] = 0] = "singer";
    BuskerKind[BuskerKind["drawer"] = 1] = "drawer";
    BuskerKind[BuskerKind["other"] = 2] = "other";
})(BuskerKind || (BuskerKind = {}));
let Busker = class Busker {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Busker.prototype, "id", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Member_1.Member, member => member.id),
    __metadata("design:type", Member_1.Member)
], Busker.prototype, "member", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], Busker.prototype, "kind", void 0);
Busker = __decorate([
    typeorm_1.Entity()
], Busker);
exports.Busker = Busker;
//# sourceMappingURL=Busker.js.map