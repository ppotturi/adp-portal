// import Bookshelf from 'bookshelf';

// export class ProgrammeManager extends Bookshelf.Model<ProgrammeManager> {
  
//   get tableName() { return 'programme_manager'; }

//   public get ProgrammeManagerId(): string {
//     return this.get('id');
//   }
//   public set ProgrammeManagerId(value: string) {
//     this.set({ id: value });
//   }
//   public get Name(): string {
//     return this.get('name');
//   }
//   public set Name(value: string) {
//     this.set({ name: value });
//   }
//   public get EntityIdentifier(): string {
//     return this.get('entity_identifier');
//   }
//   public set EntityIdentifier(value: string) {
//     this.set({ entity_identifier: value });
//   }

//   programmes(): Bookshelf.Collection<DeliveryProgrammeM> {
//     return this.belongsToMany(DeliveryProgrammeM, 'delivery_programme_pm');
//   }
// }

