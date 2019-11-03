import {EntityStore} from './entity-store';

interface TestingEntity {
    id: string;
    value: string;
}

describe('EntityStore', () => {

    let entityStore: EntityStore<TestingEntity>;

    beforeEach(() => {
        entityStore = new EntityStore();
    });

    it('should create', () => {
        expect(entityStore).toBeTruthy();
    });


    it('should add an entity', (done) => {
        spyOn(entityStore, 'dispatchEntities').and.callThrough();
        const testEntity: TestingEntity = {
            id: '1234',
            value: 'test value'
        };
        entityStore.addEntity(testEntity);
        entityStore.entities.subscribe(e => {
            if (e.length === 1) {
                expect(e[0].id).toBe('1234');
                expect(e[0].value).toBe('test value');
                expect(entityStore.dispatchEntities).toHaveBeenCalledTimes(1);
                done();
            }
        });
    });

    it('should update an entity', (done) => {
        spyOn(entityStore, 'dispatchEntities').and.callThrough();
        const testEntity: TestingEntity = {
            id: '1234',
            value: 'test value'
        };
        const updatedTestEntity: TestingEntity = {
            id: '1234',
            value: 'updated test value'
        };
        entityStore.addEntity(testEntity);
        entityStore.entities.subscribe(e => {
            if (e.length === 1 && e[0].value === 'test value') {
                expect(e[0].id).toBe('1234');
                expect(e[0].value).toBe('test value');
                expect(entityStore.dispatchEntities).toHaveBeenCalledTimes(1);
                entityStore.updateEntity(updatedTestEntity, 'id');
                entityStore.entities.subscribe(e2 => {
                    if (e2[0].value === 'updated test value') {
                        expect(e2[0].id).toBe('1234');
                        expect(entityStore.dispatchEntities).toHaveBeenCalledTimes(2);
                        done();
                    }
                });
            }
        });
    });

    it('should NOT update an entity if no matching id and throw an error', (done) => {
        spyOn(entityStore, 'dispatchEntities').and.callThrough();
        const testEntity: TestingEntity = {
            id: '1234',
            value: 'test value'
        };
        const updatedTestEntity: TestingEntity = {
            id: '12345',
            value: 'updated test value'
        };
        entityStore.addEntity(testEntity);
        entityStore.entities.subscribe(e => {
            if (e.length === 1 && e[0].value === 'test value') {
                expect(e[0].id).toBe('1234');
                expect(e[0].value).toBe('test value');
                expect(entityStore.dispatchEntities).toHaveBeenCalledTimes(1);
                try {
                    entityStore.updateEntity(updatedTestEntity, 'id');
                } catch (e) {
                    expect(e).toBeTruthy();
                    done();
                }
            }
        });
    });

    it('should NOT update an entity if wrong id field value given and throw an error', (done) => {
        spyOn(entityStore, 'dispatchEntities').and.callThrough();
        const testEntity: TestingEntity = {
            id: '1234',
            value: 'test value'
        };
        const updatedTestEntity: TestingEntity = {
            id: '12345',
            value: 'updated test value'
        };
        entityStore.addEntity(testEntity);
        entityStore.entities.subscribe(e => {
            if (e.length === 1 && e[0].value === 'test value') {
                expect(e[0].id).toBe('1234');
                expect(e[0].value).toBe('test value');
                expect(entityStore.dispatchEntities).toHaveBeenCalledTimes(1);
                try {
                    entityStore.updateEntity(updatedTestEntity, 'idField');
                } catch (e) {
                    expect(e).toBeTruthy();
                    done();
                }
            }
        });
    });

    it('should delete an entity', (done) => {
        spyOn(entityStore, 'dispatchEntities').and.callThrough();
        const testEntity: TestingEntity = {
            id: '1234',
            value: 'test value'
        };
        const secondTestEntity: TestingEntity = {
            id: '12345',
            value: 'second test value'
        };
        entityStore.addEntity(testEntity);
        entityStore.addEntity(secondTestEntity);
        entityStore.entities.subscribe(e => {
            if (e.length === 2) {
                expect(e[0].id).toBe('1234');
                expect(e[0].value).toBe('test value');
                expect(e[1].id).toBe('12345');
                expect(e[1].value).toBe('second test value');
                expect(entityStore.dispatchEntities).toHaveBeenCalledTimes(2);
                entityStore.removeEntity('1234');
                entityStore.entities.subscribe(e2 => {
                    if (e2.length === 1) {
                        expect(e2[0].id).toBe('12345');
                        expect(e2[0].value).toBe('second test value');
                        done();
                    }
                });
            }
        });
    });

    it('should NOT delete an entity if no matching id and throw an error', (done) => {
        spyOn(entityStore, 'dispatchEntities').and.callThrough();
        const testEntity: TestingEntity = {
            id: '1234',
            value: 'test value'
        };
        const secondTestEntity: TestingEntity = {
            id: '12345',
            value: 'second test value'
        };
        entityStore.addEntity(testEntity);
        entityStore.addEntity(secondTestEntity);
        entityStore.entities.subscribe(e => {
            if (e.length === 2) {
                expect(e[0].id).toBe('1234');
                expect(e[0].value).toBe('test value');
                expect(e[1].id).toBe('12345');
                expect(e[1].value).toBe('second test value');
                expect(entityStore.dispatchEntities).toHaveBeenCalledTimes(2);
                try {
                    entityStore.removeEntity('123456', 'id');
                } catch (e) {
                    expect(e).toBeTruthy();
                    expect(entityStore.rawEntities.length).toBe(2);
                    done();
                }
            }
        });
    });

    it('should NOT delete an entity if wrong id field value given and throw an error', (done) => {
        spyOn(entityStore, 'dispatchEntities').and.callThrough();
        const testEntity: TestingEntity = {
            id: '1234',
            value: 'test value'
        };
        const secondTestEntity: TestingEntity = {
            id: '12345',
            value: 'second test value'
        };
        entityStore.addEntity(testEntity);
        entityStore.addEntity(secondTestEntity);
        entityStore.entities.subscribe(e => {
            if (e.length === 2) {
                expect(e[0].id).toBe('1234');
                expect(e[0].value).toBe('test value');
                expect(e[1].id).toBe('12345');
                expect(e[1].value).toBe('second test value');
                expect(entityStore.dispatchEntities).toHaveBeenCalledTimes(2);
                try {
                    entityStore.removeEntity('1234', 'wrongIdField');
                } catch (e) {
                    expect(e).toBeTruthy();
                    expect(entityStore.rawEntities.length).toBe(2);
                    done();
                }
            }
        });
    });

    it('should set entities and clear any existing entities', (done) => {
        spyOn(entityStore, 'dispatchEntities').and.callThrough();
        const testEntity: TestingEntity = {
            id: '1234',
            value: 'test value'
        };
        const newTestEntity: TestingEntity = {
            id: '12345',
            value: 'new test value'
        };
        entityStore.addEntity(testEntity);
        entityStore.entities.subscribe(e => {
            if (e.length === 1 && e[0].value === 'test value') {
                expect(e[0].id).toBe('1234');
                expect(e[0].value).toBe('test value');
                expect(entityStore.dispatchEntities).toHaveBeenCalledTimes(1);
                entityStore.setEntities([newTestEntity, newTestEntity]);
            } else if (e.length === 2 && e[0].value === 'new test value') {
                expect(e[0].id).toBe('12345');
                expect(e[0].value).toBe('new test value');
                expect(entityStore.dispatchEntities).toHaveBeenCalledTimes(2);
                done();
            }
        });
    });

    it('should remove all entities', (done) => {
        spyOn(entityStore, 'dispatchEntities').and.callThrough();
        const testEntity: TestingEntity = {
            id: '1234',
            value: 'test value'
        };
        const newTestEntity: TestingEntity = {
            id: '12345',
            value: 'new test value'
        };
        entityStore.addEntity(testEntity);
        entityStore.addEntity(newTestEntity);
        entityStore.entities.subscribe(e => {
            if (e.length === 2) {
                expect(e[0].id).toBe('1234');
                expect(e[0].value).toBe('test value');
                expect(e[1].id).toBe('12345');
                expect(e[1].value).toBe('new test value');
                expect(entityStore.dispatchEntities).toHaveBeenCalledTimes(2);
                entityStore.removeAllEntities();
                entityStore.entities.subscribe(e2 => {
                    if (e2.length === 0) {
                        expect(entityStore.dispatchEntities).toHaveBeenCalledTimes(3);
                        expect(entityStore.dispatchEntities).toHaveBeenCalledWith([]);
                        done();
                    }
                });
            }
        });
    });

    it('should dispatch entities and replace existing entities', (done) => {
        const testEntity: TestingEntity = {
            id: '1234',
            value: 'test value'
        };
        const newTestEntity: TestingEntity = {
            id: '12345',
            value: 'new test value'
        };
        entityStore.addEntity(testEntity);
        entityStore.entities.subscribe(e => {
            if (e.length === 1 && e[0].value === 'test value') {
                expect(e[0].id).toBe('1234');
                expect(e[0].value).toBe('test value');
                entityStore.dispatchEntities([newTestEntity, newTestEntity]);
            } else if (e.length === 2 && e[0].value === 'new test value') {
                expect(e[0].id).toBe('12345');
                expect(e[0].value).toBe('new test value');
                done();
            }
        });
    });

    it('should dispatch existing entities', (done) => {
        const testEntity: TestingEntity = {
            id: '1234',
            value: 'test value'
        };
        const newTestEntity: TestingEntity = {
            id: '12345',
            value: 'new test value'
        };
        let count = 0;
        entityStore.addEntity(testEntity);
        entityStore.addEntity(newTestEntity);
        entityStore.entities.subscribe(e => {
            if (e.length === 2) {
                if (count === 0) {
                    count = 1;
                    expect(e[0].id).toBe('1234');
                    expect(e[0].value).toBe('test value');
                    expect(e[1].id).toBe('12345');
                    expect(e[1].value).toBe('new test value');
                    entityStore.dispatchEntities();
                } else if (count === 1) {
                    expect(e[0].id).toBe('1234');
                    expect(e[0].value).toBe('test value');
                    expect(e[1].id).toBe('12345');
                    expect(e[1].value).toBe('new test value');
                    done();
                }
            }
        });
    });

});
