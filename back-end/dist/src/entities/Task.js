'use strict';
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === 'object' && typeof Reflect.decorate === 'function')
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === 'object' && typeof Reflect.metadata === 'function')
      return Reflect.metadata(k, v);
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.Task = void 0;
const typeorm_1 = require('typeorm');
const TaskStatus_enum_1 = require('../enums/TaskStatus.enum');
const Kanban_1 = require('./Kanban');
let Task = class Task {
  constructor(title, description, order) {
    this.title = title;
    this.description = description;
    this.status = TaskStatus_enum_1.TaskStatus.TODO;
    this.order = order;
  }
};
exports.Task = Task;
__decorate(
  [(0, typeorm_1.PrimaryGeneratedColumn)(), __metadata('design:type', Number)],
  Task.prototype,
  'id',
  void 0
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata('design:type', String),
  ],
  Task.prototype,
  'title',
  void 0
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata('design:type', String),
  ],
  Task.prototype,
  'description',
  void 0
);
__decorate(
  [
    (0, typeorm_1.Column)({
      type: 'enum',
      enum: TaskStatus_enum_1.TaskStatus,
      default: TaskStatus_enum_1.TaskStatus.TODO,
    }),
    __metadata('design:type', String),
  ],
  Task.prototype,
  'status',
  void 0
);
__decorate(
  [
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata('design:type', Number),
  ],
  Task.prototype,
  'order',
  void 0
);
__decorate(
  [
    (0, typeorm_1.ManyToOne)(
      () => Kanban_1.Kanban,
      (kanban) => kanban.tasks,
      { onDelete: 'CASCADE' }
    ),
    __metadata('design:type', Kanban_1.Kanban),
  ],
  Task.prototype,
  'kanban',
  void 0
);
exports.Task = Task = __decorate(
  [
    (0, typeorm_1.Entity)('Tasks'),
    __metadata('design:paramtypes', [String, String, Number]),
  ],
  Task
);
