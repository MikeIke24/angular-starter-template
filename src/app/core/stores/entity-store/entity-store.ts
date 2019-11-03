import {BehaviorSubject, Observable} from 'rxjs';
import * as _ from 'lodash';
import {IEntityStore} from './entity-store.model';
import {MessageStore} from '../message-store/message-store';
import {PageableResponseParameters} from '../../models/api/pageable-response-parameters';
import {PageableDataList} from '../../models/api/pageble-data-list';

export class EntityStore<T> extends MessageStore implements IEntityStore<T> {
    protected readonly entitySubject: BehaviorSubject<T[]>;
    protected readonly pagingSubject: BehaviorSubject<PageableResponseParameters>;

    constructor() {
        super();
        this.entitySubject = new BehaviorSubject([]);
        this.pagingSubject = new BehaviorSubject(null);
    }

    get entities(): Observable<T[]> {
        return this.entitySubject.asObservable();
    }

    get rawEntities(): T[] {
        return _.cloneDeep(this.entitySubject.value);
    }

    addEntity(entity: T): void {
        const entities = this.rawEntities;
        entities.push(entity);
        this.dispatchEntities(entities);
    }

    updateEntity(entity: T, idField = 'id'): void {
        const entities = this.rawEntities;
        const id = entity[idField];
        const i = !!id ? entities.findIndex(e => e[idField] === id) : -1;
        if (i === -1) {
            throw new Error(`Could not find entity with id: ${id} on id field ${idField}`);
        }
        entities[i] = entity;
        this.dispatchEntities(entities);
    }

    setEntities(entities: T[]): void {
        this.dispatchEntities(entities);
    }

    removeEntity(entityId: any, idField = 'id') {
        const entities = this.rawEntities;
        const i = !!entityId ? entities.findIndex(e => e[idField] === entityId) : -1;
        if (i === -1) {
            throw new Error(`Could not find entity with id: ${entityId} on id field ${idField}`);
        }
        entities.splice(i, 1);
        this.dispatchEntities(entities);
    }

    removeAllEntities(): void {
        this.dispatchEntities([]);
    }

    dispatchEntities(entities?: T[]): void {
        !!entities ? this.entitySubject.next(_.cloneDeep(entities)) : this.entitySubject.next(this.rawEntities);
    }


    get paging(): Observable<PageableResponseParameters> {
        return this.pagingSubject.asObservable();
    }

    get rawPaging(): PageableResponseParameters {
        return this.pagingSubject.value;
    }

    setEntitiesAndPaging(pageableDataList: PageableDataList<T>) {
        this.dispatchEntities(pageableDataList.content);
        this.updatePaging(pageableDataList);
    }

    updatePaging(pageInfo: PageableDataList<T>) {
        delete pageInfo.content;
        const paging = _.cloneDeep(Object.assign(this.pagingSubject.value || {}, pageInfo));
        this.pagingSubject.next(paging);
    }
}
