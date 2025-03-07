import ElectronStore from 'electron-store'

class StoreService {
  public store = new ElectronStore<StoreSchema>({
    name: 'quotation-system',
    migrations: {
      '1.0.0': (store) => {
        if (!store.get('products')) store.set('products', [])
      }
    }
  })

  async updateEntity<T extends keyof StoreSchema>(
    table: T,
    id: string,
    updater: (entity: StoreSchema[T][number]) => StoreSchema[T][number]
  ): Promise<void> {
    const entities = this.store.get(table) as StoreSchema[T];
    const index = entities.findIndex((x:StoreSchema[T][number]) => x.id === id);

    if (index === -1) throw new Error('Entity does not exist');

    const updated = [...entities];
    updated[index] = updater(entities[index]);
    this.store.set(table, updated);
  }

  async insertEntity<T extends keyof StoreSchema>(
    table: T,
    entity: StoreSchema[T][number],
    uniqueFields: (keyof StoreSchema[T][number])[] = []
  ): Promise<void> {
    const entities = this.store.get(table) || [] as StoreSchema[T];

    const exists = entities.some(e => uniqueFields.some(field => e[field] === entity[field]))
    if (exists) throw new Error('Duplicate entry for unique fields');


    const _item = entity;
    _item.id = crypto.randomUUID();
    this.store.set(table, [...entities, _item]);
  }

  async paginate<T extends keyof StoreSchema>(
    table: T,
    filter?: (item: StoreSchema[T][number]) => boolean,
    page = 1,
    pageSize = 10,
  ): Promise<{
    data: StoreSchema[T][number];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  }> {
    let data = this.store.get(table) as StoreSchema[T]
    if (data.length < 1) {
      return {
        data: [],
        total: data.length,
        page: page > 1 ? page -1 : 1,
        pageSize,
        hasMore: false
      }
    }
    if (filter) {
      data = data.filter(filter)
    }
    console.log(`totals:${data.length}, page:${page}, pageSize:${pageSize}`)
    const start = (page - 1) * pageSize
    return {
      data: data.slice(start, start + pageSize),
      total: data.length,
      page,
      pageSize,
      hasMore: (data.length > (pageSize * page))
    }
  }

  async syncToCloud() {
    /*TODO: await implementation*/
  }
}

export const storeService = new StoreService();