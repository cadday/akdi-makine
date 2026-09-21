import Dexie from "dexie";

class AkdiMakineDatabase extends Dexie {
  constructor() {
    super("akdi-makine-db");

    this.version(1).stores({
      // Add your actual tables here later.
    });
  }
}

export const db = new AkdiMakineDatabase();
