import {CRUDStore} from './crud-store';

interface TestingEntity {
    id: string;
    value: string;
}

describe('CRUDStore', () => {

    let crudStore: CRUDStore<TestingEntity>;

    beforeEach(() => {
        crudStore = new CRUDStore();
    });

    it('should create', () => {
        expect(crudStore).toBeTruthy();
    });

});
