import {Observable} from 'rxjs';
import {PageableResponseParameters} from '../../models/api/pageable-response-parameters';
import {PageableDataList} from '../../models/api/pageble-data-list';

export interface IEntityStore<T> {
    entities: Observable<T[]>;

    paging: Observable<PageableResponseParameters>;

    rawPaging: PageableResponseParameters;

    addEntity(entity: T): void;

    setEntities(entities: T[]): void;

    removeEntity(entityId: any, idField: 'id' | string): void;

    removeAllEntities(): void;

    dispatchEntities(entities?: T[]): void;

    setEntitiesAndPaging(pageableDataList: PageableDataList<T>);

    updatePaging(pageInfo: Partial<PageableResponseParameters>);
}


